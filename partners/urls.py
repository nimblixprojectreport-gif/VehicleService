from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerServiceViewSet

router = DefaultRouter()
router.register(r'services', PartnerServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]