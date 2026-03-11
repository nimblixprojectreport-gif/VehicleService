from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import User


class MeView(RetrieveUpdateAPIView):
    """Return / update the currently authenticated user."""
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin-facing read-only user list."""
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

# Create your views here.
