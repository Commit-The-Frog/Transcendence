#!/bin/bash

set -e
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

redis-server --daemonize yes && daphne -b 0.0.0.0 -p 8000 config.asgi:application