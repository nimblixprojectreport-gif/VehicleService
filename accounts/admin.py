from django.contrib import admin
from .models import User, Role

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('mobile', 'full_name', 'role', 'is_active', 'is_verified')
    search_fields = ('mobile', 'full_name', 'email')
    list_filter = ('role', 'is_active', 'is_verified')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
