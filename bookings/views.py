from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Booking, BookingTimeline


class BookingViewSet(viewsets.ModelViewSet):
    """Placeholder — full implementation pending."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset
            queryset = queryset.filter(status=status_param)
