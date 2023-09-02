from channels.routing import URLRouter, ProtocolTypeRouter
import os
from channels.auth import AuthMiddlewareStack
from .routing import ws_urlpatterns
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': (
        URLRouter(routes=ws_urlpatterns)
    )

})
