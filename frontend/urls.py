from django.urls import path
from .views import index

urlpatterns = [
    path('', index , name=''),
    path('join/', index , name=''),
    path('create/', index , name=''),
    path('room/<str:roomCode>/', index , name=''),
]
