from django.contrib import admin
from .models import User, OTP

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = ("id","full_name","mobile","role","is_verified","is_active")
    search_fields = ("mobile","full_name")
    list_filter = ("role","is_verified")

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    
    list_display = ("mobile","otp_code","is_used","expires_at")