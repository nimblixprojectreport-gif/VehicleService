from rest_framework import serializers
from django.utils import timezone
from .models import Complaint, ComplaintHistory, ComplaintEvidence, ComplaintType

class ComplaintTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for Complaint Type - For admin to manage types
    """
    complaint_count = serializers.IntegerField(source='complaints.count', read_only=True)
    
    class Meta:
        model = ComplaintType
        fields = [
            'id', 
            'name', 
            'description', 
            'is_active', 
            'complaint_count',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'complaint_count']

class ComplaintEvidenceSerializer(serializers.ModelSerializer):
    """
    Serializer for Complaint Evidence
    """
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = ComplaintEvidence
        fields = [
            'id', 'file', 'file_type', 'description', 
            'uploaded_by', 'uploaded_by_name', 'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at']

class ComplaintHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for Complaint History
    """
    action_by_name = serializers.CharField(source='action_by.get_full_name', read_only=True)
    
    class Meta:
        model = ComplaintHistory
        fields = [
            'id', 'action', 'old_value', 'new_value', 
            'notes', 'action_by', 'action_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ComplaintSerializer(serializers.ModelSerializer):
    """
    Main Complaint Serializer - for reading complaints
    """
    complainant_name = serializers.CharField(source='complainant.get_full_name', read_only=True)
    against_user_name = serializers.CharField(source='against_user.get_full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    history = ComplaintHistorySerializer(many=True, read_only=True)
    evidence_files = ComplaintEvidenceSerializer(many=True, read_only=True)
    
    # Complaint type details
    complaint_type_details = ComplaintTypeSerializer(source='complaint_type', read_only=True)
    
    # Add human-readable values
    complaint_type_display = serializers.CharField(source='get_complaint_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    resolution_type_display = serializers.CharField(source='get_resolution_type_display', read_only=True)
    
    class Meta:
        model = Complaint
        fields = [
            'id', 'complaint_id', 'booking',
            'complainant', 'complainant_name', 'complainant_role',
            'against_user', 'against_user_name',
            'complaint_type', 'complaint_type_display', 'complaint_type_details',
            'priority', 'priority_display',
            'status', 'status_display',
            'subject', 'description', 'attachments',
            'assigned_to', 'assigned_to_name',
            'resolution_notes', 'resolution_type', 'resolution_type_display',
            'resolution_amount', 'resolved_at',
            'created_at', 'updated_at',
            'history', 'evidence_files'
        ]
        read_only_fields = [
            'id', 'complaint_id', 'created_at', 'updated_at', 
            'resolved_at', 'history', 'evidence_files'
        ]

class ComplaintCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for CREATING new complaints
    """
    class Meta:
        model = Complaint
        fields = [
            'booking', 'against_user', 'complaint_type',
            'subject', 'description', 'attachments'
        ]
    
    def validate_subject(self, value):
        """
        Validate the subject field
        - Must be at least 10 characters
        - Cannot be empty
        """
        # Check if subject is empty
        if not value:
            raise serializers.ValidationError("Subject cannot be empty")
        
        # Check minimum length
        if len(value) < 10:
            raise serializers.ValidationError(
                f"Subject must be at least 10 characters long. "
                f"You entered {len(value)} characters."
            )
        
        # Check maximum length (from your model)
        if len(value) > 200:
            raise serializers.ValidationError(
                f"Subject cannot exceed 200 characters. "
                f"You entered {len(value)} characters."
            )
        
        # Remove extra spaces
        value = ' '.join(value.split())
        
        return value
    
    def validate_description(self, value):
        """
        Validate the description field
        - Must be at least 20 characters
        - Cannot be empty
        """
        # Check if description is empty
        if not value:
            raise serializers.ValidationError("Description cannot be empty")
        
        # Check minimum length
        if len(value) < 20:
            raise serializers.ValidationError(
                f"Description must be at least 20 characters long. "
                f"You entered {len(value)} characters. Please provide more details."
            )
        
        # Check maximum length (from your model)
        if len(value) > 5000:
            raise serializers.ValidationError(
                f"Description cannot exceed 5000 characters. "
                f"You entered {len(value)} characters."
            )
        
        return value
    
    def validate_complaint_type(self, value):
        """
        Validate that complaint type exists in database and is active
        """
        from .models import ComplaintType
        
        # Check if it's a valid ID
        try:
            if hasattr(value,'id'):
                value = value.id
            if isinstance(value,str) and value.isdigit():
                value=int(value)    
            complaint_type = ComplaintType.objects.get(id=value, is_active=True)
        except ComplaintType.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid complaint type selected. Please choose from active complaint types."
            )
        except ValueError:
            raise serializers.ValidationError("Complaint type must be a valid ID")
        
        return complaint_type.id # Return the instance, not the ID
    
    def validate(self, data):
        """
        Cross-field validation
        This runs after individual field validations
        """
        # Get the complaint_type instance
        complaint_type = data.get('complaint_type')
        
        # If complaint type is "vehicle_damage" (check by name), require against_user
        if complaint_type and complaint_type.name == "Vehicle Damage" and not data.get('against_user'):
            raise serializers.ValidationError({
                'against_user': 'You must specify the partner when reporting vehicle damage'
            })
        
        # If complaint type is "payment_issue", require booking
        if complaint_type and complaint_type.name == "Payment Issue" and not data.get('booking'):
            raise serializers.ValidationError({
                'booking': 'You must specify the booking for payment issues'
            })
        
        return data
    
    def create(self, validated_data):
        """
        Create a new complaint
        This method is called when saving the complaint
        """
        # Get the request from context (will have user when auth is ready)
        request = self.context.get('request')
        
        # If user is authenticated, set them as complainant
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['complainant'] = request.user
            
            # Auto-set role based on user type
            if hasattr(request.user, 'role'):
                if request.user.role == 'CUSTOMER':
                    validated_data['complainant_role'] = 'customer'
                elif request.user.role == 'PARTNER':
                    validated_data['complainant_role'] = 'partner'
        
        # Auto-set priority based on complaint type name
        complaint_type = validated_data.get('complaint_type')
        if complaint_type:
            if complaint_type.name == "Vehicle Damage":
                validated_data['priority'] = 'urgent'
            elif complaint_type.name in ["Payment Issue", "Partner Behavior"]:
                validated_data['priority'] = 'high'
            elif complaint_type.name == "Service Quality":
                validated_data['priority'] = 'medium'
            else:
                validated_data['priority'] = 'low'
        
        # Create the complaint
        complaint = Complaint.objects.create(**validated_data)
        
        return complaint

class ComplaintUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for UPDATING complaints (Admin only)
    """
    class Meta:
        model = Complaint
        fields = [
            'status', 'priority', 'assigned_to',
            'resolution_notes', 'resolution_type', 'resolution_amount'
        ]
    
    def update(self, instance, validated_data):
        # If status is being set to resolved, set resolved_at
        if (validated_data.get('status') == 'resolved' and 
            instance.status != 'resolved'):
            validated_data['resolved_at'] = timezone.now()
        
        return super().update(instance, validated_data)

class ComplaintActionSerializer(serializers.Serializer):
    """
    Serializer for taking actions on complaints
    """
    ACTION_CHOICES = [
        ('assign', 'Assign to Admin'),
        ('escalate', 'Escalate'),
        ('resolve', 'Resolve'),
        ('reject', 'Reject'),
        ('close', 'Close')
    ]
    
    action = serializers.ChoiceField(choices=ACTION_CHOICES)
    notes = serializers.CharField(required=True, max_length=1000)
    resolution_type = serializers.ChoiceField(
        choices=Complaint.RESOLUTION_CHOICES,
        required=False,
        allow_null=True
    )
    resolution_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        allow_null=True
    )