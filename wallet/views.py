from django.db import transaction
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Wallet, Transaction
import json

@csrf_exempt
def create_wallet(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user, created = User.objects.get_or_create(username=data['username'])
        wallet, _ = Wallet.objects.get_or_create(user=user)
        return JsonResponse({'message': 'Wallet created', 'balance': str(wallet.balance)})

@csrf_exempt
def deposit(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        wallet = Wallet.objects.select_for_update().get(user__username=data['username'])
        with transaction.atomic():
            wallet.balance += data['amount']
            wallet.save()
            Transaction.objects.create(wallet=wallet, amount=data['amount'], transaction_type='CREDIT')
        return JsonResponse({'message': 'Deposit successful', 'balance': str(wallet.balance)})

@csrf_exempt
def withdraw(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(user__username=data['username'])
            if wallet.balance < data['amount']:
                return JsonResponse({'error': 'Insufficient balance'}, status=400)
            wallet.balance -= data['amount']
            wallet.save()
            Transaction.objects.create(wallet=wallet, amount=data['amount'], transaction_type='DEBIT')
        return JsonResponse({'message': 'Withdrawal successful', 'balance': str(wallet.balance)})

def balance(request, username):
    wallet = Wallet.objects.get(user__username=username)
    return JsonResponse({'username': username, 'balance': str(wallet.balance)})