from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
]
