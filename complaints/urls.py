from django.urls import include
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for automatic URL routing
router = DefaultRouter()
router.register(r'complaints', views.ComplaintViewSet, basename='complaint')
router.register(r'complaint-types', views.ComplaintTypeViewSet)

# The router automatically creates these URLs:
# /api/complaints/ - GET (list), POST (create)
# /api/complaints/{id}/ - GET (retrieve), PUT/PATCH (update), DELETE (delete)
# /api/complaints/{id}/take_action/ - POST
# /api/complaints/{id}/add_evidence/ - POST
# /api/complaints/my_complaints/ - GET
# /api/complaints/stats/ - GET

urlpatterns = [
    path('', include(router.urls)),
    
    # Nested routes for complaint history
    path('complaints/<int:complaint_pk>/history/',
         views.ComplaintHistoryViewSet.as_view({'get': 'list'}),
         name='complaint-history-list'),
]