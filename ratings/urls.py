from rest_framework.routers import DefaultRouter
from django.urls import path , include 
from . import views


router = DefaultRouter()
router.register(r'ratings', views.RatingViewSet)

urlpatterns = [
    path('', views.rating_frontend , name='rating_frontend'),
    path('api/', include(router.urls)),
]