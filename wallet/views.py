from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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
        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(user__username=data['username'])
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def balance(request, username):
    wallet = Wallet.objects.get(user__username=request.user.username)
    return JsonResponse({'username': request.user.username, 'balance': str(wallet.balance)})
def balance(request, username):
    wallet = Wallet.objects.get(user__username=username)
    return JsonResponse({'username': username, 'balance': str(wallet.balance)})
 
@csrf_exempt
def transfer(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        sender_username = data['from_username']
        receiver_username = data['to_username']
        amount = data['amount']
        
        with transaction.atomic():
            sender_wallet = Wallet.objects.select_for_update().get(user__username=sender_username)
            receiver_wallet = Wallet.objects.select_for_update().get(user__username=receiver_username)
            
            if sender_wallet.balance < amount:
                return JsonResponse({'error': 'Insufficient balance'}, status=400)
            
            sender_wallet.balance -= amount
            receiver_wallet.balance += amount
            sender_wallet.save()
            receiver_wallet.save()
            
            Transaction.objects.create(wallet=sender_wallet, amount=amount, transaction_type='DEBIT')
            Transaction.objects.create(wallet=receiver_wallet, amount=amount, transaction_type='CREDIT')
        
        return JsonResponse({'message': f'Transfer successful', 'sender_balance': str(sender_wallet.balance)})    

def transaction_history(request, username):
    try:
        wallet = Wallet.objects.get(user__username=username)
        transactions = Transaction.objects.filter(wallet=wallet).order_by('-timestamp').values(
            'amount', 'transaction_type', 'timestamp'
        )
        return JsonResponse({
            'username': username,
            'transactions': list(transactions)
        })
    except Wallet.DoesNotExist:
        return JsonResponse({'error': 'Wallet not found'}, status=404)


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        user = User.objects.create_user(username=username, password=password)
        wallet, _ = Wallet.objects.get_or_create(user=user)
        return JsonResponse({'message': 'Registration successful!'})        