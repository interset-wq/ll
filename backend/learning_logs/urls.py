"""
URLs for learning_logs app
"""

from django.urls import path

from . import views


app_name = 'learning_logs'
urlpatterns = [
    path('', views.index, name='index'),
    path('topics/', views.topics, name='topics'),
    path('topics/<int:pk>/', views.topic, name='topic'),
    path('topics/new/', views.new_topic, name='new_topic'),
    path('topics/<int:pk>/entry/new/', views.new_entry, name='new_entry'),
    path('entry/<int:pk>/edit/', views.edit_entry, name='edit_entry'),
]
