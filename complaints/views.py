from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Complaint
from .serializers import ComplaintSerializer, ComplaintCreateSerializer, ComplaintUpdateSerializer


class ComplaintViewSet(viewsets.ModelViewSet):
    """
    CRUD for complaints.
    GET    /api/complaints/              - list (filtered by user role)
    POST   /api/complaints/              - create complaint
    GET    /api/complaints/{id}/         - retrieve
    PATCH  /api/complaints/{id}/         - update status / resolution_note
    DELETE /api/complaints/{id}/         - delete
    POST   /api/complaints/{id}/resolve/ - resolve a complaint (admin)
    GET    /api/complaints/my/           - complaints filed by current user
    """
    queryset = Complaint.objects.all().order_by('-created_at')
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'status']
    ordering_fields = ['created_at', 'status']

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, 'role', '')
        if str(role).upper() == 'ADMIN' or user.is_staff:
            return Complaint.objects.all().order_by('-created_at')
        return Complaint.objects.filter(user=user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return ComplaintCreateSerializer
        if self.action in ['update', 'partial_update']:
            return ComplaintUpdateSerializer
        return ComplaintSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save()
        return Response(ComplaintSerializer(complaint).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my')
    def my_complaints(self, request):
        """GET /api/complaints/my/ — complaints filed by current user"""
        qs = Complaint.objects.filter(user=request.user).order_by('-created_at')
        serializer = ComplaintSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='resolve')
    def resolve(self, request, pk=None):
        """POST /api/complaints/{id}/resolve/ — admin resolves a complaint"""
        user = request.user
        role = getattr(user, 'role', '')
        if str(role).upper() != 'ADMIN' and not user.is_staff:
            return Response({'error': 'Only admins can resolve complaints'}, status=status.HTTP_403_FORBIDDEN)
        complaint = self.get_object()
        complaint.status = 'RESOLVED'
        complaint.resolution_note = request.data.get('resolution_note', '')
        complaint.save()
        return Response(ComplaintSerializer(complaint).data, status=status.HTTP_200_OK)
