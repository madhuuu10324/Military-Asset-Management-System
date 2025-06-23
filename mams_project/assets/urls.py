# assets/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseRecordViewSet, DashboardSummaryView, EquipmentTypeViewSet

router = DefaultRouter()
router.register(r'purchases', PurchaseRecordViewSet, basename='purchase')
router.register(r'equipment-types', EquipmentTypeViewSet, basename='equipment-type')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]