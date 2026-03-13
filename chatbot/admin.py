from django.contrib import admin
from .models import Category, FAQ, Conversation, Message

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'order', 'created_at']
    list_editable = ['order']
    search_fields = ['name']

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'is_active', 'order', 'created_at']
    list_editable = ['is_active', 'order']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    fieldsets = (
        ('Question Details', {
            'fields': ('category', 'question', 'answer')
        }),
        ('Matching', {
            'fields': ('keywords',),
            'description': 'Enter keywords as JSON array: ["book", "service", "appointment"]'
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        }),
    )

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user', 'created_at']
    list_filter = ['created_at']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'role', 'timestamp']
    list_filter = ['role', 'timestamp']
