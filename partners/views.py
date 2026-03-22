from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Partner
from .serializers import PartnerSerializer


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # Custom API: availability update
    @action(detail=True, methods=['patch'])
    def availability(self, request, pk=None):
        partner = self.get_object()
        partner.is_available = request.data.get('is_available', partner.is_available)
        partner.save()
        return Response({"message": "Availability updated"})

    # Custom API: earnings
    @action(detail=True, methods=['get'])
    def earnings(self, request, pk=None):
        partner = self.get_object()
        return Response({
            "partner": partner.name,
            "earnings": partner.earnings
        })
