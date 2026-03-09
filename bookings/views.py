from django.shortcuts import render
from .models import Booking


def booking_list(request):
    queryset = Booking.objects.select_related(
        "vehicle",
        "service",
        "partner"
    )
    status_param = request.GET.get("status")
    if status_param:
        queryset = queryset.filter(status=status_param)

    context = {
        "bookings": queryset
    }

    return render(request, "bookings/booking_list.html", context)
