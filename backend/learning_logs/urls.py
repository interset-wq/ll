from django.urls import path

from . import views


app_name = 'learning_logs'
urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('stats/', views.stats, name='stats'),
    path('about/', views.about, name='about'),
    path('topics/', views.topics, name='topics'),
    path('topics/new/', views.new_topic, name='new_topic'),
    path('topics/<int:pk>/', views.topic, name='topic'),
    path('topics/<int:pk>/edit/', views.edit_topic, name='edit_topic'),
    path('topics/<int:pk>/delete/', views.delete_topic, name='delete_topic'),
    path('topics/<int:pk>/entry/new/', views.new_entry, name='new_entry'),
    path('entry/<int:pk>/', views.entry_detail, name='entry_detail'),
    path('entry/<int:pk>/edit/', views.edit_entry, name='edit_entry'),
    path('entry/<int:pk>/delete/', views.delete_entry, name='delete_entry'),
    path('entry/<int:pk>/duplicate/', views.duplicate_entry, name='duplicate_entry'),
    path('entry/<int:pk>/favorite/', views.toggle_favorite, name='toggle_favorite'),
    path('favorites/', views.favorites, name='favorites'),
    path('search/', views.search, name='search'),
]
