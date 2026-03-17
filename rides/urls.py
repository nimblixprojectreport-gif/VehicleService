from django.urls import path
from .views import BookRide


urlpatterns = [

    path('book-ride/', BookRide.as_view()),

]