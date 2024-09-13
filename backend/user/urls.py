from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserView.as_view()),
    path('/search', views.SearchView.as_view()),
    path('/friend', views.FriendView.as_view()),
]
