from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BaseViewSet, me

router = DefaultRouter()
router.register(r'bases', BaseViewSet, basename='base')

urlpatterns = [
    path('me/', me, name='me'),
] + router.urls