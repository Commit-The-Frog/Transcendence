import asyncio

from channels.layers import get_channel_layer
from django.db import IntegrityError

from remote_game.game.Game import Game
from remote_game.game_objects.Player import Player
from match import models
from asgiref.sync import sync_to_async
import logging
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
                    player.get_nickname() for player in self.players.values()
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
                'playerL': self.players[0].get_nickname(),
                'playerR': self.players[1].get_nickname(),
            }
        })
        await send_ready_msg(self.players[0], self.players[1])
        quarter_final_fst = asyncio.create_task(self.games[0].start())
        await quarter_final_fst
        quarter_final_fst_model = models.Game(
            left_user= await self.players[0].get_db_object(),
            right_user= await self.players[1].get_db_object(),
            left_score=self.players[0].get_score(),
            right_score=self.players[1].get_score(),
        )
        await asyncio.sleep(3)
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
        quarter_final_snd = asyncio.create_task(self.games[1].start())
        await quarter_final_snd
        quarter_final_snd_model = models.Game(
            left_user= await self.players[2].get_db_object(),
            right_user= await self.players[3].get_db_object(),
            left_score=self.players[2].get_score(),
            right_score=self.players[3].get_score(),
        )
        await asyncio.sleep(3)
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
        final = asyncio.create_task(self.games[2].start())
        await final
        final_model = models.Game(
            left_user= await self.games[2].players[0].get_db_object(),
            right_user= await self.games[2].players[1].get_db_object(),
            left_score=self.games[2].players[0].get_score(),
            right_score=self.games[2].players[1].get_score(),
        )
        await channel_layer.group_send(
            self.id,
            {
                'type': 'game_done'
            }
        )
        try:
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
        except IntegrityError:
            logger.info('ForeignKey Error While Saving PvP model')

    def player_is_full(self):
        return len(self.players) >= 4