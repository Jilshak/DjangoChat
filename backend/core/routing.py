from django.urls import path, re_path
from chats.consumers import ChatConsumer

ws_urlpatterns = [
    re_path(r'ws/chat/(?P<id>\w+)/$', ChatConsumer.as_asgi()),
    # path(r'ws/chat/<int:id>/', ChatConsumer.as_asgi()),
    
]