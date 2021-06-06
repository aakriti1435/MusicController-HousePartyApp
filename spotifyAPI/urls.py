from django.urls import path
from .views import AuthURL, spotify_callback

urlpatterns = [
    path("get-auth-url", AuthURL.as_view(), name=""),
    path("redirect", spotify_callback),
]
