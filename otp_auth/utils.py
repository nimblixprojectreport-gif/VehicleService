import secrets
import string

from django.conf import settings
from django.utils import timezone

from .constants import OTP_LENGTH


def generate_otp(length: int = OTP_LENGTH) -> str:
    digits = string.digits
    return "".join(secrets.choice(digits) for _ in range(length))


def normalize_mobile(mobile: str) -> str:
    return "".join(ch for ch in str(mobile) if ch.isdigit() or ch == "+")


def get_client_ip(request) -> str:
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def get_role_model_label() -> str:
    return getattr(settings, "OTP_AUTH_ROLE_MODEL", "accounts.Role")


def get_partner_profile_model_label() -> str:
    return getattr(settings, "OTP_AUTH_PARTNER_PROFILE_MODEL", "partners.PartnerProfile")


def get_default_role_name() -> str:
    return getattr(settings, "OTP_AUTH_DEFAULT_ROLE", "customer")


def now():
    return timezone.now()
