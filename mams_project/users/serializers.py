from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User, Base
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# A serializer for the Base model is useful for nesting in the User serializer.
class BaseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Base model.
    """
    class Meta:
        model = Base
        fields = ['id', 'name', 'location']


class UserListDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for LISTING and RETRIEVING users.
    This serializer is read-only and does NOT expose the password hash.
    It provides a nested representation of the user's assigned base for convenience.
    """
    # Use the BaseSerializer to show the full base object, not just its ID.
    base = BaseSerializer(read_only=True)
    # Make the 'role' field display the human-readable name (e.g., "Admin")
    role = serializers.CharField(source='get_role_display')

    class Meta:
        model = User
        # Fields to be exposed in the API for read operations.
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'base',
            'is_active',
            'date_joined'
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for CREATING users.
    This serializer handles password validation and hashing.
    """
    # Ensure email is provided and is unique across all users.
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists.")]
    )
    # The 'base' field will accept the primary key (ID) of the base.
    base = serializers.PrimaryKeyRelatedField(queryset=Base.objects.all(), allow_null=True, required=False)

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            'role',
            'base'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True, # Password should never be sent back in a response.
                'required': True,
                'style': {'input_type': 'password'}, # Helps DRF's browsable API render a password field.
                'min_length': 8
            }
        }

    def create(self, validated_data):
        """
        Overrides the default .create() method.
        This is CRITICAL to ensure the password is HASHED, not saved as plain text.
        We use Django's `create_user` helper method which handles this automatically.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data['role'],
            base=validated_data.get('base')
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for UPDATING an existing user.
    Password is not required for updates.
    """
    class Meta:
        model = User
        # All fields are optional for a PATCH request.
        fields = [
            'email',
            'first_name',
            'last_name',
            'role',
            'base',
            'is_active'
        ]

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        token['base_id'] = user.base.id if user.base else None
        return token