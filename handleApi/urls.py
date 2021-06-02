from django.urls import path
from .views import RoomView, CreateRoomView

urlpatterns = [
    path('', RoomView.as_view()),
    path('createRoom', CreateRoomView.as_view()),
]
