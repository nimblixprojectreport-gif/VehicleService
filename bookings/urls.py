from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, BookingTimelineViewset

router = DefaultRouter()

router.register(r'bookings', BookingViewSet)
router.register(r'booking-timeline', BookingTimelineViewset)

urlpatterns = [
    path('', include(router.urls)),
]
