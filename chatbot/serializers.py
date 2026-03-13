from rest_framework import serializers
from .models import Category, FAQ, Conversation, Message

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'order', 'created_at']

class FAQSerializer(serializers.ModelSerializer):
    """
    Serializer for FAQ model
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'category_name', 'keywords', 'is_active', 'order', 'created_at', 'updated_at']

class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for Message model
    """
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'timestamp']

class ConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for Conversation model with nested messages
    """
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'session_id', 'user', 'messages', 'created_at', 'updated_at']