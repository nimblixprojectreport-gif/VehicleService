from django.contrib import admin
from .models import Payment, Commission

# Register your models here.

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "transaction_id",
        "booking",
        "customer",
        "amount_paid",
        "payment_status",
        "created_at",
        "updated_at",
    )
    search_fields = ("transaction_id", "customer__username", "booking__booking_reference")
    list_filter = ("payment_status", "created_at")


@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = (
        "booking",
        "platform_percentage",
        "platform_amount",
        "partner_payout",
        "created_at",
        "updated_at",
    )
    search_fields = ("booking__booking_reference",)