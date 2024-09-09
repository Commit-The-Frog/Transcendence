"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter

# Django 설정을 먼저 로드
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Django 애플리케이션 로드
django_asgi_app = get_asgi_application()

# 여기서 websocket_urlpatterns를 임포트하도록 함
from remote_game.routing import websocket_urlpatterns

# ASGI 애플리케이션 설정
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                # JWT 토큰 검증 미들웨어
                # JWTAuthMiddleware,
                URLRouter(websocket_urlpatterns),
            )
        ),
    }
)
