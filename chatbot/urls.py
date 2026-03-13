from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for automatic URL routing
router = DefaultRouter()
router.register(r'faqs', views.FAQViewSet, basename='faq')
router.register(r'categories', views.CategoryViewSet, basename='category')

# Custom URL patterns
urlpatterns = [
    # Include all router URLs
    path('', include(router.urls)),
    
    # Chatbot public endpoints
    path('menu/', views.ChatbotViewSet.as_view({'get': 'menu'})),
    path('ask/', views.ChatbotViewSet.as_view({'post': 'ask'})),
    path('history/', views.ChatbotViewSet.as_view({'get': 'history'})),
]