from django.urls import re_path

from .game import consumers as game_consumers
from .waiting_queue import consumers as waiting_queue_consumers

websocket_urlpatterns = [
    re_path(r"ws/game/lobby$", waiting_queue_consumers.WaitingQueueConsumer.as_asgi()),
    re_path(r"ws/game/1vs1$", game_consumers.GameConsumer.as_asgi()),
    re_path(r"ws/game/tournament$", game_consumers.TournamentConsumer.as_asgi()),
]1