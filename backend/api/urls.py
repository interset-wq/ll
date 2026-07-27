from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('topics', views.TopicViewSet, basename='topic')
router.register('entries', views.EntryViewSet, basename='entry')

app_name = 'api'
urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/auth/register/', views.register_view, name='register'),
    path('v1/auth/login/', views.login_view, name='login'),
    path('v1/auth/logout/', views.logout_view, name='logout'),
    path('v1/auth/me/', views.me_view, name='me'),
]
