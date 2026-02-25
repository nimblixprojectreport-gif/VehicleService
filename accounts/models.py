from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin , BaseUserManager
from django.db import models
from core.models import TimeStampedModel


class Role(TimeStampedModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_user(self, mobile, password=None, **extra_fields):
        if not mobile:
            raise ValueError("Mobile number is required")
        user = self.model(mobile=mobile, **extra_fields)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(mobile, password, **extra_fields)

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
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)


    USERNAME_FIELD = "mobile"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.mobile
    
    objects = UserManager()


class OTP(TimeStampedModel):
    mobile = models.CharField(max_length=15, db_index=True)
    otp_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)