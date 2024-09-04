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
        if player in self.players.values() or len(self.players) >= 4:
            return
        self.players[len(self.players)] = player

    async def start(self):
        channel_layer = get_channel_layer()
        cnt = 0
        while len(self.players) < 4:
            await channel_layer.group_send(self.id, {
                'type': 'game_update',
                'data': {
                    'type': 'tour_waiting',
                    'players': [
                        player.get_id() for player in self.players.values()
                    ],
                }
            })
            if cnt >= 10:
                await channel_layer.group_send(self.id,{
                    'type': 'game_timeout'
                })
                return
            await asyncio.sleep(0.5)
            cnt += 0.5
        await channel_layer.group_send(self.id, {
            'type': 'game_update',
            'data': {
                'type': 'tour_waiting',
                'players': [
                    player.get_id() for player in self.players.values()
                ],
            }
        })
        logger.info('All players participate')
        self.games[0] = Game(self.id)
        self.games[0].add_player(self.players[0])
        self.games[0].add_player(self.players[1])
        self.players[0].reset()
        self.players[1].reset()
        await channel_layer.group_send(self.id, {
            'type': 'game_update',
            'data': {
                'type': 'game1',
                'playerL': self.players[0].get_id(),
                'playerR': self.players[1].get_id(),
            }
        })
        quarter_final_fst = asyncio.create_task(self.games[0].start())
        await quarter_final_fst
        self.games[1] = Game(self.id)
        self.games[1].add_player(self.players[2])
        self.games[1].add_player(self.players[3])
        self.players[2].reset()
        self.players[3].reset()
        await channel_layer.group_send(self.id, {
            'type': 'game_update',
            'data': {
                'type': 'game2',
                'playerL': self.players[2].get_id(),
                'playerR': self.players[3].get_id(),
            }
        })
        quarter_final_snd = asyncio.create_task(self.games[1].start())
        await quarter_final_snd
        self.games[2] = Game(self.id)
        self.games[2].add_player(self.games[0].winner)
        self.games[2].add_player(self.games[1].winner)
        if self.games[0].winner:
            self.games[0].winner.reset()
        if self.games[1].winner:
            self.games[1].winner.reset()
        await channel_layer.group_send(self.id, {
            'type': 'game_update',
            'data': {
                'type': 'final',
                'playerL': "" if not self.games[0].winner else self.games[0].winner.get_id(),
                'playerR': "" if not self.games[1].winner else self.games[1].winner.get_id(),
            }
        })
        final = asyncio.create_task(self.games[2].start())
        await final
        await channel_layer.group_send(
            self.id,
            {
                'type': 'game_done'
            }
        )

    def player_is_full(self):
        return len(self.players) >= 4