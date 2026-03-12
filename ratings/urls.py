from .views import RatingViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'ratings', RatingViewSet)

urlpatterns = router.urls