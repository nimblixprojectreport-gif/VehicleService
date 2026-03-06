from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'channel', 'is_read', 'created_at')
    list_filter = ('channel', 'is_read', 'created_at')
    search_fields = ('user__mobile', 'title', 'message')
    readonly_fields = ('created_at', 'updated_at')
