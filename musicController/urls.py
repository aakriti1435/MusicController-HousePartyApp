from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('handleApi.urls')),
    path('spotify/', include('spotifyAPI.urls')),
    path('', include('frontend.urls')),
]
