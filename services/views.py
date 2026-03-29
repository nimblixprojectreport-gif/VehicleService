from rest_framework import viewsets
from .models import ServiceCategory
from .serializers import ServiceCategorySerializer


class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    filterset_fields = ['is_active']
    ordering_fields = ['name', 'base_price']
    ordering = ['name']

