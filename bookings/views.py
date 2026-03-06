from rest_framework import viewsets
from .models import Booking, BookingTimeline 
from .serializers import BookingSerializer, BookingtTimelineSerializer

# Create your views here.

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
class BookingTimelineViewset(viewsets.ModelViewSet):
    queryset = BookingTimeline.objects.all()
    serializer_class = BookingtTimelineSerializer    
