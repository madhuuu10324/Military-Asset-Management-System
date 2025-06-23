# mams_project/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App-specific API Endpoints
    path('api/assets/', include('assets.urls')),
    path('api/logistics/', include('logistics.urls')),
    path('api/users/', include('users.urls')), # You would add user management endpoints here
]