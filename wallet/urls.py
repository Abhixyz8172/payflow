from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_wallet, name='create_wallet'),
    path('deposit/', views.deposit, name='deposit'),
    path('withdraw/', views.withdraw, name='withdraw'),
    path('balance/<str:username>/', views.balance, name='balance'),
    path('transfer/', views.transfer, name='transfer'),
    path('history/<str:username>/', views.transaction_history, name='transaction_history'),
    path('register/', views.register, name='register'),
]