from django.urls import path

from .views import GroupCreateView, GroupDetailView, GroupJoinView, GroupListView, MatchingGroupsView

urlpatterns = [
    path('', GroupListView.as_view(), name='group-list'),
    path('create/', GroupCreateView.as_view(), name='group-create'),
    path('matching/', MatchingGroupsView.as_view(), name='group-matching'),
    path('<str:group_id>/', GroupDetailView.as_view(), name='group-detail'),
    path('<str:group_id>/join/', GroupJoinView.as_view(), name='group-join'),
]