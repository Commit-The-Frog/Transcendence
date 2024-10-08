import asyncio

from channels.layers import get_channel_layer
from django.db import IntegrityError

from remote_game.game.Game import Game
from remote_game.game_objects.Player import Player
from match import models
from remote_game import Exceptions
from asgiref.sync import sync_to_async
import logging

from user.models import Userdb

logger = logging.getLogger('transcendence')


async def send_ready_msg(player1: Player, player2: Player):
    if player1:
        await player1.privmsg({
            'get_ready': True
        })
    if player2:
        await player2.privmsg({
            'get_ready': True
        })


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
        try:
            cnt = 0
            while len(self.players) < 4:
                await channel_layer.group_send(self.id, {
                    'type': 'game_update',
                    'data': {
                        'type': 'tour_waiting',
                        'players': [
                            player.get_nickname() for player in self.players.values()
                        ],
                    }
                })
                if cnt >= 10:
                    raise Exceptions.TimeoutException()
                await asyncio.sleep(0.5)
                cnt += 0.5
            await channel_layer.group_send(self.id, {
                'type': 'game_update',
                'data': {
                    'type': 'tour_waiting',
                    'players': [
                        player.get_nickname() for player in self.players.values()
                    ],
                }
            })
            logger.info('All players participate')

            # Quarter Final First Game
            self.games[0] = Game(self.id)
            self.games[0].add_player(self.players[0])
            self.games[0].add_player(self.players[1])
            self.players[0].reset()
            self.players[1].reset()
            await channel_layer.group_send(self.id, {
                'type': 'game_update',
                'data': {
                    'type': 'game1',
                    'playerL': self.players[0].get_nickname(),
                    'playerR': self.players[1].get_nickname(),
                }
            })
            await send_ready_msg(self.players[0], self.players[1])
            await self.games[0].start()
            quarter_final_fst_model = models.Game(
                left_user= await self.players[0].get_db_object(),
                right_user= await self.players[1].get_db_object(),
                left_win=self.players[0].get_score() == Game.max_score,
                right_win=self.players[1].get_score() == Game.max_score,
                type='pingpong'
            )
            await asyncio.sleep(3)

            # Quarter Final Second Game
            self.games[1] = Game(self.id)
            self.games[1].add_player(self.players[2])
            self.games[1].add_player(self.players[3])
            self.players[2].reset()
            self.players[3].reset()
            await channel_layer.group_send(self.id, {
                'type': 'game_update',
                'data': {
                    'type': 'game2',
                    'playerL': self.players[2].get_nickname(),
                    'playerR': self.players[3].get_nickname(),
                }
            })
            await send_ready_msg(self.players[2], self.players[3])
            await self.games[1].start()
            quarter_final_snd_model = models.Game(
                left_user= await self.players[2].get_db_object(),
                right_user= await self.players[3].get_db_object(),
                left_win=self.players[2].get_score() == Game.max_score,
                right_win=self.players[3].get_score() == Game.max_score,
                type='pingpong'
            )
            await asyncio.sleep(3)

            # FINAL GAME
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
                    'playerL': "" if not self.games[0].winner else self.games[0].winner.get_nickname(),
                    'playerR': "" if not self.games[1].winner else self.games[1].winner.get_nickname(),
                }
            })
            await send_ready_msg(self.games[0].winner, self.games[1].winner)
            await self.games[2].start()
            final_model = models.Game(
                left_user= await self.games[2].players[0].get_db_object(),
                right_user= await self.games[2].players[1].get_db_object(),
                left_win=self.games[2].players[0].get_score() == Game.max_score,
                right_win=self.games[2].players[1].get_score() == Game.max_score,
                type='pingpong'
            )
            await channel_layer.group_send(
                self.id,
                {
                    'type': 'game_done'
                }
            )

            # Save Game Model
            await sync_to_async(quarter_final_fst_model.save)(force_insert=False, force_update=False, using=None, update_fields=None)
            logger.info(f'Tournament Game Model Saved quarter 1 {quarter_final_fst_model.id}')
            await sync_to_async(quarter_final_snd_model.save)(force_insert=False, force_update=False, using=None, update_fields=None)
            logger.info(f'Tournament Game Model Saved quarter 2 {quarter_final_snd_model.id}')
            await sync_to_async(final_model.save)(force_insert=False, force_update=False, using=None, update_fields=None)
            logger.info(f'Tournament Game Model Saved final {final_model.id}')
            await sync_to_async(models.Tournament(
                game1=quarter_final_fst_model,
                game2=quarter_final_snd_model,
                game3=final_model,
            ).save)(force_insert=False, force_update=False, using=None, update_fields=None)
            logger.info(f'Tournament Model Saved {final_model.id}')
        except Exceptions.TimeoutException as e:
            await channel_layer.group_send(self.id, {
                'type': 'game_abnormal',
                'data': 'timeout'
            })
            logger.error(f'{e} Error in Tournament')
        except Exceptions.RemoteGameException as e:
            logger.error(f'{e} Error in Tournament')
        except Userdb.DoesNotExist as e:
            logger.error(f'{e} Error in Tournament')
        except Userdb.MultipleObjectsReturned as e:
            logger.error(f'{e} Error in Tournament')
        except IntegrityError as e:
            logger.error(f'{e} Error in Tournament')
        except Exception as e:
            logger.error(f'{e} Error in Tournament')

    def player_is_full(self):
        return len(self.players) >= 4