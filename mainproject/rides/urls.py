from django.urls import path
from .views import RideFairAPIView

urlpatterns = [
    path('fare/', RideFairAPIView.as_view(), name='calculate-fare'),
]
