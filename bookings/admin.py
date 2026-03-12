from django.contrib import admin
from .models import Booking , BookingTimeline

# Register your models here.

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_reference",
        "customer",
        "partner",
        "vehicle",
        "service",
        "status",
        "scheduled_date",
        "scheduled_time",
        "total_amount",
    )
    search_fields = ("booking_reference", "customer__mobile", "partner__mobile")
    list_filter = ("status", "scheduled_date", "service")


@admin.register(BookingTimeline)
class BookingTimelineAdmin(admin.ModelAdmin):
    list_display = ("booking", "status", "note", "created_at", "updated_at")
    search_fields = ("booking__booking_reference", "status")
    list_filter = ("status", "created_at")

