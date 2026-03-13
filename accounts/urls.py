from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MeView, UserViewSet, LoginView , RegisterView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
     
    path('register/', RegisterView.as_view(), name='register'), 
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='account-me'),

] + router.urls