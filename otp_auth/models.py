from django.conf import settings
from django.db import models
from django.utils import timezone


class OTP(models.Model):
    mobile = models.CharField(max_length=15, db_index=True)
    otp_code = models.CharField(max_length=128)
    expires_at = models.DateTimeField(db_index=True)
    is_used = models.BooleanField(default=False, db_index=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["mobile", "is_used", "expires_at"]),
            models.Index(fields=["-created_at"]),
        ]

    def mark_used(self):
        self.is_used = True
        self.used_at = timezone.now()
        self.save(update_fields=["is_used", "used_at"])


class DeviceToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="device_tokens",
    )
    token = models.CharField(max_length=255, unique=True)
    device_id = models.CharField(max_length=128, blank=True, default="")
    platform = models.CharField(max_length=32, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_seen_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["user", "is_active"])]


class AuthAuditLog(models.Model):
    EVENT_OTP_SEND = "otp_send"
    EVENT_OTP_VERIFY = "otp_verify"
    EVENT_REGISTER = "register"
    EVENT_LOGIN = "login"

    EVENT_CHOICES = [
        (EVENT_OTP_SEND, "OTP Sent"),
        (EVENT_OTP_VERIFY, "OTP Verify"),
        (EVENT_REGISTER, "User Registered"),
        (EVENT_LOGIN, "User Login"),
    ]

    event_type = models.CharField(max_length=32, choices=EVENT_CHOICES, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="auth_audit_logs",
    )
    mobile = models.CharField(max_length=15, blank=True, default="", db_index=True)
    success = models.BooleanField(default=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
