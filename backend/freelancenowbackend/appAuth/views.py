from django.shortcuts import render
from functools import wraps
import jwt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from .serializers import UserSerializer
from app.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404

def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]

    return token

def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """
    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = get_token_auth_header(args[0])
            decoded = jwt.decode(token, verify=False)
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                for token_scope in token_scopes:
                    if token_scope == required_scope:
                        return f(*args, **kwargs)
            response = JsonResponse({'message': 'You don\'t have access to this resource'})
            response.status_code = 403
            return response
        return decorated
    return require_scope

@api_view(['POST'])
@permission_classes([AllowAny]) 
def login(request):
    # Fetch user by username (or name field if that's what you're using)
    user = get_object_or_404(User, name=request.data.get("name"))  # use "username" or "name" depending on your model

    # Check if the password is correct
    if not user.check_password(request.data.get("password")):
        return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)

    # Get or create an authentication token
    token, created = Token.objects.get_or_create(user=user)

    # Serialize the user data
    serializer = UserSerializer(instance=user)

    # Return the token and user data
    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(name= serializer.data["name"])
        user.set_password(serializer.data["password"])
        user.save()

        token = Token.objects.create(user=user)
        return Response({"token:": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    print(request.user)
    return Response("You are logged in with {}".format(request.user.username), status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def public(request):
    return JsonResponse({'message': 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'})


@api_view(['GET'])
def private(request):
    return JsonResponse({'message': 'Hello from a private endpoint! You need to be authenticated to see this.'})


@api_view(['GET'])
@requires_scope('read:messages')
def private_scoped(request):
    return JsonResponse({'message': 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'})