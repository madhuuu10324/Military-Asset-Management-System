# logistics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransferRecordViewSet, AssignmentRecordViewSet, ExpenditureRecordViewSet  # Assuming you create other viewsets for Assignment/Expenditure

router = DefaultRouter()
router.register(r'transfers', TransferRecordViewSet, basename='transfer')
router.register(r'assignments', AssignmentRecordViewSet, basename='assignment')
router.register(r'expenditures', ExpenditureRecordViewSet, basename='expenditure')


urlpatterns = [
    path('', include(router.urls)),
]