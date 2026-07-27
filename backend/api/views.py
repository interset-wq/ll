from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response

from learning_logs.models import Topic, Entry
from .serializers import (
    UserSerializer, TopicSerializer, EntrySerializer, RegisterSerializer
)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Topic):
            return obj.owner == request.user
        if isinstance(obj, Entry):
            return obj.topic.owner == request.user
        return False


class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Topic.objects.filter(owner=self.request.user).order_by('-date_added')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EntryViewSet(viewsets.ModelViewSet):
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        qs = Entry.objects.filter(topic__owner=self.request.user)
        topic_id = self.request.query_params.get('topic')
        if topic_id:
            qs = qs.filter(topic_id=topic_id)
        favorited = self.request.query_params.get('favorited')
        if favorited == 'true':
            qs = qs.filter(favorited=True)
        return qs.order_by('-date_added')

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        entry = self.get_object()
        entry.favorited = not entry.favorited
        entry.save(update_fields=['favorited'])
        return Response({'favorited': entry.favorited})

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        entry = self.get_object()
        new_entry = Entry.objects.create(
            title=f"{entry.title} (copy)" if entry.title else '',
            text=entry.text,
            topic=entry.topic,
            word_count=entry.word_count,
        )
        return Response(
            EntrySerializer(new_entry).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        data = UserSerializer(user).data
        data['token'] = token.key
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        data = UserSerializer(user).data
        data['token'] = token.key
        return Response(data)
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)
