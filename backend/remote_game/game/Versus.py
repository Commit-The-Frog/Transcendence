import asyncio

from channels.layers import get_channel_layer
from django.db import IntegrityError

from remote_game.game.Game import Game
from remote_game.game_objects.Player import Player
from match import models
from asgiref.sync import sync_to_async
from remote_game import Exceptions

import logging

from user.models import Userdb

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
        try:
            cnt = 0
            while len(self.players) < 2:
                if cnt >= 10:
                    raise Exceptions.TimeoutException()
                await asyncio.sleep(0.5)
                cnt += 0.5
            logger.info('All players participate')
            self.game = Game(self.id)
            self.game.add_player(self.players[0])
            self.game.add_player(self.players[1])
            await self.game.start()
            game_model = models.Game(
                left_user= await self.players[0].get_db_object(),
                right_user= await self.players[1].get_db_object(),
                left_win=self.players[0].get_score() == Game.max_score,
                right_win=self.players[1].get_score() == Game.max_score,
                type='pingpong'
            )
            await sync_to_async(game_model.save)(force_insert=False, force_update=False, using=None, update_fields=None)
            logger.info(f'Game Model Saved {game_model.id}')
            await channel_layer.group_send(
                self.id,
                {
                    'type': 'game_done'
                }
            )
        except Exceptions.TimeoutException as e:
            await channel_layer.group_send(self.id, {
                'type': 'game_abnormal',
                'data': 'timeout'
            })
            logger.error(f'{e} Error In Versus')
        except Exceptions.RemoteGameException as e:
            logger.error(f'{e} Error In Versus')
        except Userdb.DoesNotExist as e:
            await channel_layer.group_send(self.id, {
                'type': 'game_abnormal',
                'data': f'{e}'
            })
            logger.error(f'{e} Error In Versus')
        except Userdb.MultipleObjectsReturned as e:
            await channel_layer.group_send(self.id, {
                'type': 'game_abnormal',
                'data': f'{e}'
            })
            logger.error(f'{e} Error In Versus')
        except IntegrityError as e:
            logger.error('ForeignKey Error While Saving PvP model')
        except Exception as e:
            logger.error(f'{e} Error In Versus')

    def player_is_full(self):
        return len(self.players) >= 2