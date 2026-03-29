from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'categories', views.ServiceCategoryViewSet, basename='service-categories')

urlpatterns = [
    path('', include(router.urls)),
]
