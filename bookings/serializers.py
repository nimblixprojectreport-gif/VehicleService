from rest_framework import serializers
from .models import Booking, BookingTimeline

class BookingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Booking
        fields = "__all__"
        
class BookingtTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingTimeline
        fields = "__all__"        