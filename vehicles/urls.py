from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)

urlpatterns = router.urls
