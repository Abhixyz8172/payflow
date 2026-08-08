FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 10000

CMD python manage.py migrate --noinput && gunicorn payflow.wsgi:application --bind 0.0.0.0:$PORT
