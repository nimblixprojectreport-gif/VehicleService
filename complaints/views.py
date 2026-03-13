from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta

from .models import Complaint, ComplaintHistory, ComplaintEvidence, ComplaintType
from .serializers import (
    ComplaintSerializer, ComplaintCreateSerializer,
    ComplaintUpdateSerializer, ComplaintActionSerializer,
    ComplaintEvidenceSerializer, ComplaintHistorySerializer, ComplaintTypeSerializer,
)

class ComplaintViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Complaint CRUD operations
    """
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    # permission_classes = [IsAuthenticated]  # Uncomment when auth is ready
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]  # Uncomment when needed
    filterset_fields = ['status', 'priority', 'complaint_type', 'complainant_role']
    search_fields = ['complaint_id', 'subject', 'description']
    ordering_fields = ['created_at', 'priority', 'status', 'updated_at']
    
    def get_queryset(self):
        """
        Filter queryset based on user role
        - Admin sees all complaints
        - Customers see complaints they filed
        - Partners see complaints against them OR filed by them
        """
        user = self.request.user
        
        # Handle case when user is not authenticated (for testing)
        if not user.is_authenticated:
            return Complaint.objects.none()
        
        # Admin sees everything
        if hasattr(user, 'role') and user.role == 'admin':
            return Complaint.objects.all()
        
        # Customers see complaints they filed
        elif hasattr(user, 'role') and user.role == 'customer':
            return Complaint.objects.filter(complainant=user)
        
        # Partners see complaints they filed OR complaints against them
        elif hasattr(user, 'role') and user.role == 'partner':
            return Complaint.objects.filter(
                Q(complainant=user) | Q(against_user=user)
            )
        
        # Default - return nothing
        return Complaint.objects.none()
    
    def get_serializer_class(self):
        """
        Return different serializers for different actions
        """
        if self.action == 'create':
            return ComplaintCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ComplaintUpdateSerializer
        return ComplaintSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Create a new complaint
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save()
        
        # Create history entry
        user_name = "Unknown User"
        if request.user.is_authenticated:
            user_name = request.user.get_full_name() or request.user.username
        
        ComplaintHistory.objects.create(
            complaint=complaint,
            action_by=request.user if request.user.is_authenticated else None,
            action='CREATED',
            notes=f"Complaint filed by {user_name}"
        )
        
        return Response(
            ComplaintSerializer(complaint).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def take_action(self, request, pk=None):
        """
        Take action on a complaint (Admin only)
        """
        complaint = self.get_object()
        
        # Check if user is authenticated and is admin
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not hasattr(request.user, 'role') or request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can take actions on complaints'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ComplaintActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action = serializer.validated_data['action']
        notes = serializer.validated_data['notes']
        
        # Store old status for history
        old_status = complaint.status
        
        # Process different actions
        if action == 'assign':
            complaint.assigned_to = request.user
            complaint.status = 'under_review'
            action_message = f"Assigned to {request.user.get_full_name()}"
            
        elif action == 'escalate':
            complaint.status = 'escalated'
            complaint.priority = 'urgent'
            action_message = "Complaint escalated to urgent"
            
        elif action == 'resolve':
            complaint.status = 'resolved'
            complaint.resolved_at = timezone.now()
            complaint.resolution_notes = notes
            complaint.resolution_type = serializer.validated_data.get('resolution_type')
            complaint.resolution_amount = serializer.validated_data.get('resolution_amount')
            action_message = "Complaint resolved"
            
        elif action == 'reject':
            complaint.status = 'rejected'
            complaint.resolution_notes = notes
            action_message = "Complaint rejected"
            
        elif action == 'close':
            complaint.status = 'closed'
            action_message = "Complaint closed"
        
        complaint.save()
        
        # Create history entry
        ComplaintHistory.objects.create(
            complaint=complaint,
            action_by=request.user,
            action=action.upper(),
            old_value={'status': old_status},
            new_value={'status': complaint.status},
            notes=notes
        )
        
        return Response({
            'message': f'Action {action} completed successfully',
            'complaint': ComplaintSerializer(complaint).data
        })
    
    @action(detail=True, methods=['post'])
    def add_evidence(self, request, pk=None):
        """
        Add evidence files to complaint
        """
        complaint = self.get_object()
        
        # Handle unauthenticated users (for testing)
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user is allowed to add evidence
        user_role = getattr(request.user, 'role', None)
        if request.user != complaint.complainant and user_role != 'admin':
            return Response(
                {'error': 'Only the complainant or admin can add evidence'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if file was uploaded
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create evidence
        evidence = ComplaintEvidence.objects.create(
            complaint=complaint,
            file=request.FILES['file'],
            file_type=request.data.get('file_type', 'image'),
            uploaded_by=request.user,
            description=request.data.get('description', '')
        )
        
        return Response(
            ComplaintEvidenceSerializer(evidence).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def my_complaints(self, request):
        """
        Get all complaints filed by current user
        """
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        complaints = self.get_queryset().filter(complainant=request.user)
        page = self.paginate_queryset(complaints)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get complaint statistics
        Temporarily open for testing - will add admin check later
        """
        # For production, uncomment this:
        # if not request.user.is_authenticated or not hasattr(request.user, 'role') or request.user.role != 'admin':
        #     return Response(
        #         {'error': 'Admin access required'},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        
        try:
            # Calculate statistics
            total = Complaint.objects.count()
            pending = Complaint.objects.filter(status='pending').count()
            resolved = Complaint.objects.filter(status='resolved').count()
            rejected = Complaint.objects.filter(status='rejected').count()
            
            # Last 30 days
            thirty_days_ago = timezone.now() - timedelta(days=30)
            recent = Complaint.objects.filter(created_at__gte=thirty_days_ago).count()
            
            # Complaints by type
            by_type = Complaint.objects.values('complaint_type').annotate(
                count=Count('id')
            )
            
            # Complaints by status
            by_status = Complaint.objects.values('status').annotate(
                count=Count('id')
            )
            
            return Response({
                'total_complaints': total,
                'pending_complaints': pending,
                'resolved_complaints': resolved,
                'rejected_complaints': rejected,
                'recent_30_days': recent,
                'by_type': by_type,
                'by_status': by_status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ComplaintHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing complaint history
    """
    serializer_class = ComplaintHistorySerializer
    # permission_classes = [IsAuthenticated]  # Uncomment when auth is ready
    
    def get_queryset(self):
        """
        Get history for a specific complaint
        """
        complaint_id = self.kwargs.get('complaint_pk')
        return ComplaintHistory.objects.filter(complaint_id=complaint_id)

class ComplaintTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Complaint Types
    Admin can create, update, delete complaint types
    Regular users can only view active types
    """
    queryset = ComplaintType.objects.all()
    serializer_class = ComplaintTypeSerializer
    # permission_classes = [IsAuthenticated]  # Uncomment when auth is ready
    
    def get_queryset(self):
        """
        - Admin sees all complaint types
        - Regular users see only active types
        """
        user = self.request.user
        
        # Check if user is authenticated
        if not user.is_authenticated:
            return ComplaintType.objects.filter(is_active=True)
        
        # Admin sees everything
        if hasattr(user, 'role') and user.role == 'admin':
            return ComplaintType.objects.all()
        
        # Regular users see only active types
        return ComplaintType.objects.filter(is_active=True)
    
    def perform_destroy(self, instance):
        """
        Prevent deletion if complaint type is in use
        """
        if instance.complaints.count() > 0:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                f"Cannot delete '{instance.name}' because it is used by {instance.complaints.count()} complaints. "
                f"Set is_active=False instead to hide it."
            )
        instance.delete()