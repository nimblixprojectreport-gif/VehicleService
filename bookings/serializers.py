from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:

        model = Booking

        fields = [
            "id",
            "user",
            "vehicle",
            "service",
            "booking_date",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "status",
            "created_at"
        ]