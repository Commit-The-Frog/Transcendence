import asyncio

from channels.layers import get_channel_layer
from django.db import IntegrityError

from remote_game.game.Game import Game
from remote_game.game_objects.Player import Player
from match import models
from asgiref.sync import sync_to_async

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
        game_task = asyncio.create_task(self.game.start())
        await game_task
        game_model = models.Game(
            left_user= await self.players[0].get_db_object(),
            right_user= await self.players[1].get_db_object(),
            left_win=self.players[0].get_score() == Game.max_score,
            right_win=self.players[1].get_score() == Game.max_score,
            type='pingpong'
        )
        try:
            await sync_to_async(game_model.save)(force_insert=False, force_update=False, using=None, update_fields=None)
            logger.info(f'Game Model Saved {game_model.id}')
        except IntegrityError:
            logger.info('ForeignKey Error While Saving PvP model')
        await channel_layer.group_send(
            self.id,
            {
                'type': 'game_done'
            }
        )

    def player_is_full(self):
        return len(self.players) >= 2