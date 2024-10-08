from django.urls import path
from . import views

urlpatterns = [
    # path('2fa', include("login.urls")),
    path('callback', views.CallbackView.as_view()),
    path('2fa', views.SecondAuthView.as_view()),
    path('check2fa', views.Check2faView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('refresh', views.RefreshView.as_view()),
    path('islogin', views.LoginCheckView.as_view()),
    path('', views.ApiLoginView.as_view())
]
