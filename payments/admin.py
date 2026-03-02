from django.contrib import admin
from .models import Payment, Commission

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'booking', 'customer', 'amount_paid', 'payment_method', 'payment_status', 'created_at', 'updated_at')
    list_filter = ('payment_status', 'payment_method', 'created_at', 'updated_at')
    search_fields = ('transaction_id', 'booking__id', 'customer__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('booking', 'platform_percentage', 'platform_amount', 'partner_payout', 'created_at', 'updated_at')
    search_fields = ('booking__booking_reference',)
    readonly_fields = ('created_at', 'updated_at')