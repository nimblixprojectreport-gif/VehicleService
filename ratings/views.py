from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Rating
from .serializers import RatingSerializer
from django.shortcuts import render

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [AllowAny]  
    
def rating_frontend(request):
    return render(request, 'html/index.html')