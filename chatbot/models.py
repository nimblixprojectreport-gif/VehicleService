from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    """
    Category model - groups FAQs into categories
    Example: Booking, Payment, Service Issues, etc.
    """
    name = models.CharField(max_length=100, help_text="Category name (e.g., Booking)")
    description = models.TextField(blank=True, help_text="Optional description")
    icon = models.CharField(max_length=50, blank=True, help_text="Emoji or icon name (e.g., 🚗, 💳)")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers appear first)")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name

class FAQ(models.Model):
    """
    FAQ model - stores questions and answers for the chatbot
    """
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='faqs',
        help_text="Which category does this question belong to?"
    )
    question = models.CharField(
        max_length=500, 
        help_text="The question users might ask (e.g., 'How to book a service?')"
    )
    keywords = models.JSONField(
        default=list, 
        blank=True,
        help_text="Keywords for matching (e.g., ['book', 'service', 'appointment'])"
    )
    answer = models.TextField(help_text="The response the chatbot will give")
    is_active = models.BooleanField(
        default=True, 
        help_text="Uncheck to hide this question from the chatbot"
    )
    order = models.IntegerField(default=0, help_text="Display order in menu")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category__order', 'order', 'question']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
    
    def __str__(self):
        return self.question[:50]

class Conversation(models.Model):
    """
    Conversation model - tracks each chat session
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="User if logged in, otherwise null"
    )
    session_id = models.CharField(
        max_length=100, 
        unique=True,
        help_text="Unique session ID for anonymous users"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Conversation {self.session_id[:10]}..."

class Message(models.Model):
    """
    Message model - individual messages in a conversation
    """
    ROLE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    
    conversation = models.ForeignKey(
        Conversation, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}"