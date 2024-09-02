import asyncio

from channels.layers import get_channel_layer

from remote_game.game.Game import Game
from remote_game.game_objects.Player import Player
import logging
logger = logging.getLogger('transcendence')

class Versus:
    def __init__(self, versus_id):
        self.id = versus_id
        self.game: Game = None
        self.players: dict[int, Player] = {}

    def add_player(self, player: Player):
        if player in self.players.values() or len(self.players) >= 2:
            return
        self.players[len(self.players)] = player

    async def start(self):
        channel_layer = get_channel_layer()
        cnt = 0
        while len(self.players) < 2:
            if cnt >= 10:
                await channel_layer.group_send(self.id, {
                    'type': 'game_timeout'
                })
                return
            await asyncio.sleep(0.5)
            cnt += 0.5
        logger.info('All players participate')
        self.game = Game(self.id)
        self.game.add_player(self.players[0])
        self.game.add_player(self.players[1])
        match = asyncio.create_task(self.game.start())
        await match
        await channel_layer.group_send(
            self.id,
            {
                'type': 'game_done'
            }
        )

    def player_is_full(self):
        return len(self.players) >= 2