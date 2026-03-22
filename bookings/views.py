from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from .models import Booking, BookingTimeline
from .serializers import BookingSerializer, BookingTimelineSerializer
from accounts.models import User
import uuid
from datetime import datetime
from rest_framework import permissions

class IsCustomerOrPartnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        return obj.customer == user or obj.partner == user


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('customer', 'partner', 'vehicle', 'service').prefetch_related('timeline')
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        user = self.request.user
        if not user.is_staff:
            queryset = queryset.filter(Q(customer=user) | Q(partner=user))
        return queryset

    def perform_create(self, serializer):
        if not serializer.validated_data.get('booking_reference'):
            reference = f"BOOK-{uuid.uuid4().hex[:8].upper()}"
            serializer.save(customer=self.request.user, booking_reference=reference)
        else:
            serializer.save(customer=self.request.user)
        
        # Auto-create initial timeline
        BookingTimeline.objects.create(
            booking=serializer.instance,
            status=serializer.instance.status
        )

    @action(detail=True, methods=['patch'])
    def assign(self, request, pk=None):
        booking = self.get_object()
        if booking.status != 'PENDING':
            return Response({'error': 'Can only assign pending bookings'}, status=status.HTTP_400_BAD_REQUEST)
        
        partner_id = request.data.get('partner_id')
        try:
            partner = User.objects.get(id=partner_id, role='PARTNER')
            booking.partner = partner
            booking.status = 'ASSIGNED'
            booking.save()
            
            BookingTimeline.objects.create(
                booking=booking,
                status='ASSIGNED',
                note=f"Assigned to partner {partner.get_full_name()}"
            )
            return Response(BookingSerializer(booking).data)
        except User.DoesNotExist:
            return Response({'error': 'Partner not found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        if booking.customer != request.user and booking.partner != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        old_status = booking.status
        booking.status = new_status
        booking.save()
        
        BookingTimeline.objects.create(
            booking=booking,
            status=new_status,
            note=request.data.get('note', '')
        )
        return Response(BookingSerializer(booking).data)

