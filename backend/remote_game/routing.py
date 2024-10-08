from django.urls import re_path

from .game import consumers as game_consumers
from .waiting_queue import consumers as waiting_queue_consumers
from .user_state import consumers as user_status_consumers

websocket_urlpatterns = [
    re_path(r"game/lobby$", waiting_queue_consumers.WaitingQueueConsumer.as_asgi()),
    re_path(r"game/1vs1$", game_consumers.GameConsumer.as_asgi()),
    re_path(r"game/tournament$", game_consumers.TournamentConsumer.as_asgi()),
    re_path(r"user/status$", user_status_consumers.UserStateConsumer.as_asgi())
]