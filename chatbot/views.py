import requests
import re
import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.db.models import Q
from .models import Category, FAQ, Conversation, Message
from .serializers import (
    CategorySerializer, FAQSerializer, 
    ConversationSerializer, MessageSerializer
)

API_BASE_URL = "https://api.vehicleservice.com/api/v1"

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAdminUser]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]

class ChatbotViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    def get_token(self):
        # For now return None - you'll implement auth later
        return None
    
    def extract_booking_id(self, text):
        """Extract booking ID from text like 'booking 123' or '#123'"""
        patterns = [
            r'booking[#\s]*(\d+)',
            r'#(\d+)',
            r'id[#\s]*(\d+)',
            r'(\d{6,})'  # 6+ digit numbers as fallback
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None
    
    def call_api(self, endpoint, method='GET', data=None):
        """Generic API caller"""
        try:
            headers = {}
            token = self.get_token()
            if token:
                headers['Authorization'] = f'Bearer {token}'
            
            url = f"{API_BASE_URL}{endpoint}"
            
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=5)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=data, timeout=5)
            else:
                return None
                
            if response.status_code in [200, 201]:
                return response.json()
            return None
        except Exception as e:
            print(f"API Error: {e}")
            return None
    
    @action(detail=False, methods=['get'])
    def menu(self, request):
        categories = Category.objects.all()
        result = []
        for category in categories:
            faqs = category.faqs.filter(is_active=True)[:5]
            category_data = {
                'id': category.id,
                'name': category.name,
                'icon': category.icon,
                'questions': [
                    {'id': faq.id, 'question': faq.question} for faq in faqs
                ]
            }
            result.append(category_data)
        return Response(result)

    @action(detail=False, methods=['post'])
    def ask(self, request):
        question = request.data.get('question', '').lower().strip()
        session_id = request.data.get('session_id', str(uuid.uuid4()))
        
        if not question:
            return Response({'error': 'Question required'}, status=400)
        
        conv, _ = Conversation.objects.get_or_create(session_id=session_id)
        Message.objects.create(conversation=conv, role='user', content=question)
        
        # ===== HANDLE SIMPLE RESPONSES FIRST =====
        if question in ['yes', 'ok', 'sure', 'help', 'yeah', 'yep', 'okay', 'fine']:
            answer = "Great! What would you like help with? You can choose from the menu above or type your question."
            Message.objects.create(conversation=conv, role='bot', content=answer)
            return Response({'answer': answer, 'session_id': session_id})
        
        # ===== 1. FIRST CHECK FAQ DATABASE =====
        faqs = FAQ.objects.filter(is_active=True)
        best_match = None
        highest_score = 0
        question_words = set(question.split())
        
        for faq in faqs:
            score = 0
            faq_words = set(faq.question.lower().split())
            common_words = question_words.intersection(faq_words)
            score += len(common_words) * 2
            
            if faq.keywords:
                keyword_matches = [k for k in faq.keywords if k in question]
                score += len(keyword_matches) * 3
            
            if score > highest_score:
                highest_score = score
                best_match = faq
        
        if best_match and highest_score >= 3:
            answer = best_match.answer
            Message.objects.create(conversation=conv, role='bot', content=answer)
            return Response({'answer': answer, 'session_id': session_id})
        
        # ===== 2. THEN CHECK FOR BOOKING QUERIES =====
        if any(word in question for word in ['track', 'status', 'delay', 'booking']):
            booking_id = self.extract_booking_id(question)
            if booking_id:
                booking = self.call_api(f'/bookings/{booking_id}/')
                if booking:
                    status_map = {
                        'pending': '⏳ Pending',
                        'assigned': '👨‍🔧 Assigned',
                        'in_progress': '🔧 In Progress',
                        'completed': '✅ Completed',
                        'cancelled': '❌ Cancelled',
                        'delayed': '⚠️ Delayed'
                    }
                    status_display = status_map.get(booking.get('status'), booking.get('status'))
                    
                    answer = f"📅 **Booking #{booking_id}**\n"
                    answer += f"Status: {status_display}\n"
                    if booking.get('scheduled_date'):
                        answer += f"Date: {booking.get('scheduled_date')}\n"
                    if booking.get('scheduled_time'):
                        answer += f"Time: {booking.get('scheduled_time')}\n"
                else:
                    answer = f"❌ Booking #{booking_id} not found. Please check the ID."
            else:
                answer = "Please provide your booking ID (e.g., 'Track booking 123')"
        
        # ===== 3. THEN CHECK FOR PAYMENT QUERIES =====
        elif any(word in question for word in ['payment', 'bill', 'refund']):  # REMOVED 'cost'
            booking_id = self.extract_booking_id(question)
            if booking_id:
                payment = self.call_api(f'/payments/booking/{booking_id}/')
                if payment:
                    payment_status_map = {
                        'pending': '⏳ Pending',
                        'completed': '✅ Paid',
                        'failed': '❌ Failed',
                        'refunded': '💰 Refunded'
                    }
                    status_display = payment_status_map.get(payment.get('payment_status'), payment.get('payment_status'))
                    
                    answer = f"💳 **Payment for Booking #{booking_id}**\n"
                    answer += f"Amount: ₹{payment.get('amount_paid', 'N/A')}\n"
                    answer += f"Status: {status_display}\n"
                    if payment.get('transaction_id'):
                        answer += f"Transaction ID: {payment.get('transaction_id')}"
                else:
                    answer = f"❌ No payment found for booking #{booking_id}"
            else:
                answer = "Please provide booking ID for payment details (e.g., 'Payment for booking 123')"
        
        # ===== 4. CHECK FOR COMPLAINT QUERIES =====
        elif any(word in question for word in ['complaint', 'damage', 'poor', 'issue']):
            booking_id = self.extract_booking_id(question)
            if booking_id:
                answer = "📝 **File a Complaint**\n\nPlease describe your issue clearly. Include:\n- What happened\n- When it happened\n- Any relevant details\n\nOur team will respond within 24 hours."
            else:
                answer = "To file a complaint, please provide your booking ID (e.g., 'Complaint for booking 123: Car damaged')"
        
        # ===== 5. FALLBACK =====
        else:
            answer = "I'm not sure. Please select from the menu options above or try rephrasing your question."
        
        Message.objects.create(conversation=conv, role='bot', content=answer)
        return Response({'answer': answer, 'session_id': session_id})
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response({'error': 'session_id required'}, status=400)
        
        try:
            conversation = Conversation.objects.get(session_id=session_id)
            serializer = ConversationSerializer(conversation)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response({'messages': []})