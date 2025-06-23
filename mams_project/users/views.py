from .models import Base, User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import BaseSerializer, UserListDetailSerializer, MyTokenObtainPairSerializer

class BaseViewSet(viewsets.ReadOnlyModelViewSet):
    """Provides a read-only API endpoint for listing all bases."""
    queryset = Base.objects.all().order_by('name')
    serializer_class = BaseSerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can see the list of bases

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Get current user's data."""
    serializer = UserListDetailSerializer(request.user)
    return Response(serializer.data)