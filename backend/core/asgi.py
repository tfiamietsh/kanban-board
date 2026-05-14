import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

from django.urls import path
from boards.consumers import BoardConsumer

application = ProtocolTypeRouter({
  'http': django_asgi_app,
  'websocket': URLRouter([path('ws/updates/', BoardConsumer.as_asgi())])
})
