from rest_framework import serializers
from .models import Booking, BookingTimeline
from vehicles.serializers import VehicleSerializer
from services.serializers import ServiceCategorySerializer
from accounts.serializers import UserSerializer


class BookingTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingTimeline
        fields = ['id', 'booking', 'status', 'note', 'created_at']
        read_only_fields = ['id', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    service = ServiceCategorySerializer(read_only=True)
    customer = UserSerializer(read_only=True)
    partner = UserSerializer(read_only=True)
    timeline = BookingTimelineSerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_reference', 'customer', 'partner', 'vehicle', 'service',
            'scheduled_date', 'scheduled_time', 'service_latitude', 'service_longitude',
            'status', 'total_amount', 'timeline', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'booking_reference', 'customer', 'timeline', 'created_at', 'updated_at']

