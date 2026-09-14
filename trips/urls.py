from django.urls import path

from .views import TripByGroupView, TripCreateView, TripListView

urlpatterns = [
    path('', TripListView.as_view(), name='trip-list'),
    path('group/<str:group_id>/', TripByGroupView.as_view(), name='trip-detail'),
    path('group/<str:group_id>/create/', TripCreateView.as_view(), name='trip-create'),
]