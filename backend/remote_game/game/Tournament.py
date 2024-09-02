import asyncio

from channels.layers import get_channel_layer

from remote_game.game.Game import Game
from remote_game.game_objects.Player import Player
import logging
logger = logging.getLogger('transcendence')

class Tournament:
    def __init__(self, tournament_id):
        logger.info(f'{tournament_id} started')
        self.id = tournament_id
        self.games: dict[int, Game] = {}
        self.players: dict[int, Player] = {}

    def add_player(self, player: Player):
        self.players[len(self.players)] = player

    async def start(self):
        while len(self.players) < 4:
            await asyncio.sleep(0.1)
        logger.info('All players participate')
        self.games[0] = Game(self.id)
        self.games[0].add_player(self.players[0])
        self.games[0].add_player(self.players[1])
        quarter_final_fst = asyncio.create_task(self.games[0].start())
        await quarter_final_fst
        self.players[0].set_input({
            'upPressed': False,
            'downPressed': False,
        })
        self.players[1].set_input({
            'upPressed': False,
            'downPressed': False,
        })
        self.games[1] = Game(self.id)
        self.games[1].add_player(self.players[2])
        self.games[1].add_player(self.players[3])
        quarter_final_snd = asyncio.create_task(self.games[1].start())
        await quarter_final_snd
        self.players[2].set_input({
            'upPressed': False,
            'downPressed': False,
        })
        self.players[3].set_input({
            'upPressed': False,
            'downPressed': False,
        })
        self.games[2] = Game(self.id)
        self.games[2].add_player(self.games[0].winner)
        self.games[2].add_player(self.games[1].winner)
        final = asyncio.create_task(self.games[2].start())
        await final
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            self.id,
            {
                'type': 'tournament_message',
                'data': {
                    'status': 'game over',
                    'winner': self.games[2].winner.get_id(),
                }
            }
        )

    def player_is_full(self):
        return len(self.players) >= 4