from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.utils import timezone
import uuid

User = get_user_model()

# Create your models here.

class ComplaintType(models.Model):
    """
    Dynamic Complaint Types - Admin can add/edit/delete these
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Name of complaint type (e.g., 'Late Service', 'Rude Behavior')"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Detailed description of what this complaint type covers"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this type from users"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = "Complaint Type"
        verbose_name_plural = "Complaint Types"
    
    def __str__(self):
        return self.name
    
    def complaint_count(self):
        """Return number of complaints using this type"""
        return self.complaints.count()


class Complaint(models.Model):
    """
    Complaint Model - Stores all complaints from users
    """
    
    # Priority Choices
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Status Choices
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
        ('escalated', 'Escalated'),
        ('closed', 'Closed'),
    ]
    
    # Resolution Type Choices
    RESOLUTION_CHOICES = [
        ('refund', 'Refund'),
        ('partial_refund', 'Partial Refund'),
        ('re_service', 'Re-service'),
        ('wallet_credit', 'Wallet Credit'),
        ('partner_warning', 'Partner Warning'),
        ('partner_suspension', 'Partner Suspension'),
        ('partner_block', 'Partner Block'),
        ('no_action', 'No Action'),
    ]
    
    # Complaint ID (like CMP-2024-00001)
    complaint_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        editable=False,
        help_text="Unique complaint reference (e.g., CMP-2024-00001)"
    )
    
    # Who filed the complaint
    complainant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='complaints_filed',
        help_text="User who filed the complaint"
    )
    
    # What is their role (customer or partner)
    complainant_role = models.CharField(
        max_length=20,
        choices=[('customer', 'Customer'), ('partner', 'Partner')],
        default='customer',
        help_text="Role of the person filing complaint"
    )
    
    # Who is being complained about (if any)
    against_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='complaints_against',
        help_text="User being complained against (optional)"
    )
    
    # Related booking (if any)
    booking = models.ForeignKey(
        'bookings.Booking',  # Assuming you have a Booking model
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='complaints',
        help_text="Related booking (optional)"
    )
    
    # Complaint details - UPDATED to use ForeignKey to ComplaintType
    complaint_type = models.ForeignKey(
        ComplaintType,
        on_delete=models.PROTECT,
        related_name='complaints',
        help_text="Type of complaint"
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium',
        help_text="Priority level"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Current status"
    )
    
    subject = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(5)],
        help_text="Short summary of complaint"
    )
    
    description = models.TextField(
        max_length=5000,
        validators=[MinLengthValidator(10)],
        help_text="Detailed description"
    )
    
    # Attachments (store file paths as JSON)
    attachments = models.JSONField(
        default=list,
        blank=True,
        help_text="List of attachment URLs"
    )
    
    # Admin assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_complaints',
        limit_choices_to={'role': 'admin'},
        help_text="Admin handling this complaint"
    )
    
    # Resolution details
    resolution_notes = models.TextField(
        max_length=5000,
        blank=True,
        null=True,
        help_text="Notes about resolution"
    )
    
    resolution_type = models.CharField(
        max_length=50,
        choices=RESOLUTION_CHOICES,
        null=True,
        blank=True,
        help_text="Type of resolution"
    )
    
    resolution_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Refund/credit amount if applicable"
    )
    
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When complaint was resolved"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['complaint_id']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['complainant']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.complaint_id or 'New'}: {self.subject[:50]}"
    
    def save(self, *args, **kwargs):
        """Generate complaint_id if not set"""
        if not self.complaint_id:
            # Get current year
            year = timezone.now().year
            
            # Find the last complaint this year
            last_complaint = Complaint.objects.filter(
                complaint_id__startswith=f'CMP-{year}'
            ).order_by('complaint_id').last()
            
            if last_complaint:
                # Extract the number and increment
                last_number = int(last_complaint.complaint_id.split('-')[-1])
                new_number = str(last_number + 1).zfill(5)
            else:
                # Start from 00001
                new_number = '00001'
            
            self.complaint_id = f'CMP-{year}-{new_number}'
        
        super().save(*args, **kwargs)
    
    def change_status(self, new_status, user, notes=""):
        """Change complaint status and log it"""
        old_status = self.status
        self.status = new_status
        
        if new_status == 'resolved':
            self.resolved_at = timezone.now()
        
        self.save()
        
        # Create history entry
        ComplaintHistory.objects.create(
            complaint=self,
            action_by=user,
            action='STATUS_CHANGE',
            old_value={'status': old_status},
            new_value={'status': new_status},
            notes=notes
        )


class ComplaintHistory(models.Model):
    """
    Track all changes to complaints
    """
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name='history'
    )
    
    action_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        help_text="User who performed this action"
    )
    
    action = models.CharField(
        max_length=100,
        help_text="What action was taken"
    )
    
    old_value = models.JSONField(
        null=True,
        blank=True,
        help_text="Previous values"
    )
    
    new_value = models.JSONField(
        null=True,
        blank=True,
        help_text="New values"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Additional notes"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name_plural = "Complaint histories"
    
    def __str__(self):
        return f"{self.complaint.complaint_id} - {self.action}"


class ComplaintEvidence(models.Model):
    """
    Store evidence files for complaints
    """
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name='evidence_files'
    )
    
    file = models.FileField(
        upload_to='complaints/evidence/%Y/%m/%d/',
        help_text="Upload evidence file"
    )
    
    file_type = models.CharField(
        max_length=50,
        choices=[
            ('image', 'Image'),
            ('document', 'Document'),
            ('video', 'Video'),
            ('other', 'Other'),
        ],
        default='image'
    )
    
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    
    description = models.CharField(
        max_length=255,
        blank=True,
        help_text="Brief description of this evidence"
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
        verbose_name_plural = "Complaint evidence"
    
    def __str__(self):
        return f"Evidence for {self.complaint.complaint_id}"