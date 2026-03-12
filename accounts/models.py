from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from core.models import TimeStampedModel


class Role(TimeStampedModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    ROLE_CHOICES = (
        ("CUSTOMER", "Customer"),
        ("PARTNER", "Partner"),
        ("ADMIN", "Admin"),
    )

    full_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "mobile"
    REQUIRED_FIELDS = ['full_name']  # Add full_name as required for createsuperuser

    def __str__(self):
        return self.mobile


class OTP(TimeStampedModel):
    mobile = models.CharField(max_length=15, db_index=True)
    otp_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)