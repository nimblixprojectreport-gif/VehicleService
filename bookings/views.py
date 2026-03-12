from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Booking, BookingTimeline
from .serializers import BookingSerializer, BookingtTimelineSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


class BookingTimelineViewset(viewsets.ModelViewSet):
    queryset = BookingTimeline.objects.all()
    serializer_class = BookingtTimelineSerializer
