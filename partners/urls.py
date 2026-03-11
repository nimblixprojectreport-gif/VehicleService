from django.urls import path, include
from rest_framework.routers import DefaultRouter

from complaints import views
from .views import PartnerProfileViewSet, PartnerServiceViewSet

router = DefaultRouter()
router.register(r'partners', PartnerProfileViewSet)
router.register(r'partner-services', PartnerServiceViewSet)

urlpatterns = [
    path('partners/', views.partner_list, name='partner_list'),
]   
