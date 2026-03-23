# Nearby Drivers API (Django + DRF)

## 1. Install dependencies
pip install -r requirements.txt

## 2. Create Django project
django-admin startproject vehicle_service
cd vehicle_service

## 3. Copy the drivers folder into the project directory

Project structure should look like:

vehicle_service/
    manage.py
    vehicle_service/
    drivers/

## 4. Add apps to settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drivers',
]

## 5. Run migrations
python manage.py makemigrations
python manage.py migrate

## 6. Run server
python manage.py runserver

## 7. Test API

GET request:

http://127.0.0.1:8000/drivers/nearby/?latitude=12.9716&longitude=77.5946

Returns drivers within 5km radius.