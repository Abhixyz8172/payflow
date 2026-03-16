# PayFlow - Digital Wallet System

A secure backend for a digital wallet system built with Django, FastAPI, PostgreSQL, and Docker.

## Features
- Create digital wallets
- Deposit & withdraw funds
- ACID compliant transactions
- Race condition prevention using Row-Level Locking

## Tech Stack
- Python, Django, FastAPI
- PostgreSQL, Redis
- Docker, AWS EC2

## API Endpoints
- POST /api/wallet/create/ - Create wallet
- POST /api/wallet/deposit/ - Deposit funds
- POST /api/wallet/withdraw/ - Withdraw funds
- GET /api/wallet/balance/username/ - Check balance

## Setup
\`\`\`bash
git clone https://github.com/Abhixyz8172/payflow.git
cd payflow
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`
