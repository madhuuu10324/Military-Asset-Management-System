# Create a new file: mams_project/permissions.py
from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'

class IsBaseCommander(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'BASE_COMMANDER'
    
    def has_object_permission(self, request, view, obj):
        # Allow commander to see/edit objects related to their own base
        if hasattr(obj, 'base'):
            return obj.base == request.user.base
        if hasattr(obj, 'from_base'): # For transfers
            return obj.from_base == request.user.base or obj.to_base == request.user.base
        return False

# ... other roles
class IsLogisticsOfficer(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'LOGISTICS_OFFICER'