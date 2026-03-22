from rest_framework.routers import DefaultRouter
from .views import PartnerProfileViewSet, PartnerServiceViewSet

router = DefaultRouter()
router.register(r'partners', PartnerProfileViewSet)
router.register(r'services', PartnerServiceViewSet)

urlpatterns = router.urls
# Create your tests here.
