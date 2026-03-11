from datetime import timedelta

from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .constants import OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN_SECONDS, OTP_TTL
from .models import AuthAuditLog, DeviceToken, OTP
from .serializers import LogoutSerializer, SendOTPSerializer, VerifyOTPSerializer
from .throttles import SendOTPThrottle, VerifyOTPThrottle
from .utils import (
    generate_otp,
    get_client_ip,
    get_default_role_name,
    get_partner_profile_model_label,
    get_role_model_label,
    normalize_mobile,
)


class SendOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [SendOTPThrottle]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mobile = normalize_mobile(serializer.validated_data["mobile"])
        client_ip = get_client_ip(request)

        recent_otp = (
            OTP.objects.filter(mobile=mobile)
            .order_by("-created_at")
            .only("created_at")
            .first()
        )
        if recent_otp:
            min_next_send = recent_otp.created_at + timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS)
            if timezone.now() < min_next_send:
                wait_seconds = int((min_next_send - timezone.now()).total_seconds())
                return Response(
                    {"error": "Please wait before requesting a new OTP", "retry_after": wait_seconds},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )

        raw_otp = generate_otp()
        OTP.objects.create(
            mobile=mobile,
            otp_code=make_password(raw_otp),
            expires_at=timezone.now() + OTP_TTL,
        )

        AuthAuditLog.objects.create(
            event_type=AuthAuditLog.EVENT_OTP_SEND,
            mobile=mobile,
            success=True,
            ip_address=client_ip or None,
        )

        print("OTP:", raw_otp)
        return Response({"message": "OTP sent"}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [VerifyOTPThrottle]

    @transaction.atomic
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mobile = normalize_mobile(serializer.validated_data["mobile"])
        otp_code = serializer.validated_data["otp"]
        role_name = serializer.validated_data.get("role") or get_default_role_name()
        client_ip = get_client_ip(request)

        otp_candidates = list(
            OTP.objects.select_for_update()
            .filter(mobile=mobile, is_used=False, expires_at__gte=timezone.now())
            .order_by("-created_at")
        )

        matched_otp = None
        for otp_obj in otp_candidates:
            if otp_obj.attempts >= OTP_MAX_ATTEMPTS:
                otp_obj.is_used = True
                otp_obj.save(update_fields=["is_used"])
                continue

            if check_password(otp_code, otp_obj.otp_code):
                matched_otp = otp_obj
                break

        if not matched_otp:
            latest = otp_candidates[0] if otp_candidates else None
            if latest and latest.attempts < OTP_MAX_ATTEMPTS:
                latest.attempts += 1
                if latest.attempts >= OTP_MAX_ATTEMPTS:
                    latest.is_used = True
                    latest.save(update_fields=["attempts", "is_used"])
                else:
                    latest.save(update_fields=["attempts"])

            AuthAuditLog.objects.create(
                event_type=AuthAuditLog.EVENT_OTP_VERIFY,
                mobile=mobile,
                success=False,
                ip_address=client_ip or None,
            )
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        matched_otp.mark_used()

        User = get_user_model()
        user, created = User.objects.get_or_create(mobile=mobile)

        if created:
            self._assign_role_to_new_user(user=user, role_name=role_name)
            setattr(user, "is_verified", True)
            user.save()
            self._create_partner_profile_if_needed(user=user)

            AuthAuditLog.objects.create(
                event_type=AuthAuditLog.EVENT_REGISTER,
                user=user,
                mobile=mobile,
                success=True,
                ip_address=client_ip or None,
                metadata={"role": getattr(getattr(user, "role", None), "name", role_name)},
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        self._upsert_device_token(user=user, serializer=serializer)

        refresh = RefreshToken.for_user(user)
        refresh["user_id"] = user.id
        refresh["role"] = getattr(getattr(user, "role", None), "name", role_name)

        AuthAuditLog.objects.create(
            event_type=AuthAuditLog.EVENT_OTP_VERIFY,
            user=user,
            mobile=mobile,
            success=True,
            ip_address=client_ip or None,
        )
        AuthAuditLog.objects.create(
            event_type=AuthAuditLog.EVENT_LOGIN,
            user=user,
            mobile=mobile,
            success=True,
            ip_address=client_ip or None,
        )

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user.id,
                "role": getattr(getattr(user, "role", None), "name", role_name),
                "is_new_user": created,
                "notification": "welcome",
            },
            status=status.HTTP_200_OK,
        )

    def _assign_role_to_new_user(self, user, role_name: str):
        role_model_label = get_role_model_label()
        role_model = apps.get_model(role_model_label)
        role = role_model.objects.get(name=role_name)
        if hasattr(user, "role"):
            # Support both FK role fields and simple CharField role fields
            from django.db.models import CharField as DjCharField
            field = user.__class__._meta.get_field("role")
            if isinstance(field, DjCharField):
                setattr(user, "role", role.name)
            else:
                setattr(user, "role", role)

    def _create_partner_profile_if_needed(self, user):
        user_role = getattr(user, "role", None)
        # Handle both string role (CharField) and object role (FK)
        role_name = user_role if isinstance(user_role, str) else getattr(user_role, "name", "")
        if role_name.lower() != "partner":
            return

        partner_profile_model = apps.get_model(get_partner_profile_model_label())
        partner_profile_model.objects.get_or_create(user=user)

    def _upsert_device_token(self, user, serializer):
        device_token = serializer.validated_data.get("device_token")
        if not device_token:
            return

        DeviceToken.objects.update_or_create(
            token=device_token,
            defaults={
                "user": user,
                "device_id": serializer.validated_data.get("device_id", ""),
                "platform": serializer.validated_data.get("platform", ""),
                "is_active": True,
            },
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh = serializer.validated_data["refresh"]
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)
