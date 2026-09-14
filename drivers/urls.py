from django.urls import path

from .views import DriverDetailView, DriverListView

urlpatterns = [
    path('', DriverListView.as_view(), name='driver-list'),
    path('<str:driver_id>/', DriverDetailView.as_view(), name='driver-detail'),
]