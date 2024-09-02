import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .Game import Game
from .Tournament import Tournament
from remote_game.game_objects.Player import Player
import logging
import urllib.parse

game_dict = {}
tournament_dict = {}

logger = logging.getLogger('transcendence')

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 쿼리 문자열을 파싱하여 match_name과 id를 가져오기
        query_string = self.scope['query_string'].decode('utf-8')
        query_params = urllib.parse.parse_qs(query_string)

        # match_name과 id 추출
        match_name = query_params.get('match_name', [None])[0]
        user_id = query_params.get('id', [None])[0]
        self.player = None
        if match_name and user_id:
            self.match_group_name = f'game_{match_name}'
            self.player = Player(user_id)
            await self.channel_layer.group_add(
                self.match_group_name, self.channel_name
            )
            await self.accept()
        else:
            await self.close()
            return
        logger.debug(f'{self.player.get_id()} connected to {self.match_group_name}')
        if self.match_group_name not in game_dict: # 게임에 먼저 참가한다면,
            logger.debug("GameDict Created")
            game_dict[self.match_group_name] = Game(self.match_group_name)
            self.game = game_dict[self.match_group_name]
            self.game.add_player(self.player)
            asyncio.create_task(self.game.start())
        elif not game_dict[self.match_group_name].player_is_full(): # 이미 게임에 한명이 들어가있다면,
            logger.debug("GameDict Joined")
            self.game = game_dict[self.match_group_name]
            self.game.add_player(self.player)
        else: # 게임에 이미 두명이 들어갔다면,
            await self.close(1000)

    async def disconnect(self, close_code):
        # 게임 방에서 나가기
        if self.player:
            self.player.set_disconnect()
            await self.channel_layer.group_discard(
                self.match_group_name,
                self.channel_name
            )
            logger.debug(f'Player {self.player.get_id()} Disconnected')

    # Receive ready or key info
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        msg_type = text_data_json['type']
        if msg_type == 'ready':
            self.player.set_is_ready(True)
        elif msg_type == 'update':
            self.player.set_input(text_data_json['key'])

    # Send game update to all players
    async def game_update(self, event):
        event_json = json.dumps(event['data'])
        await self.send(text_data=event_json)

    # Delete game from gamedict when game is done
    async def game_done(self, event):
        logger.debug(f'{self.match_group_name} game done')
        if self.match_group_name in game_dict.keys():
            game_dict.pop(self.match_group_name)

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 쿼리 문자열을 파싱하여 match_name과 id를 가져오기
        query_string = self.scope['query_string'].decode('utf-8')
        query_params = urllib.parse.parse_qs(query_string)

        # match_name과 id 추출
        tournament_name = query_params.get('tournament_name', [None])[0]
        user_id = query_params.get('id', [None])[0]
        self.player = None
        if tournament_name and user_id:
            self.tournament_group_name = f'game_{tournament_name}'
            self.player = Player(user_id)
            await self.channel_layer.group_add(
                self.tournament_group_name, self.channel_name
            )
            await self.accept()
        else:
            await self.close()
            return
        logger.debug(f'TOURNAMENT: {self.player.get_id()} connected to {self.tournament_group_name}')
        if self.tournament_group_name not in tournament_dict.keys(): # 게임에 먼저 참가한다면,
            logger.debug("TournamentDict Created")
            tournament_dict[self.tournament_group_name] = Tournament(self.tournament_group_name)
            self.tournament = tournament_dict[self.tournament_group_name]
            self.tournament.add_player(self.player)
            asyncio.create_task(self.tournament.start())
        elif not tournament_dict[self.tournament_group_name].player_is_full():
            logger.debug("TournamentDict Joined")
            self.tournament = tournament_dict[self.tournament_group_name]
            self.tournament.add_player(self.player)
        else:
            await self.close(1000)

    async def disconnect(self, close_code):
        # 게임 방에서 나가기
        if self.player:
            self.player.set_disconnect()
            await self.channel_layer.group_discard(
                self.tournament_group_name,
                self.channel_name
            )
            logger.debug(f'Player {self.player.get_id()} Disconnected')

    # Receive ready or key info
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        msg_type = text_data_json['type']
        if msg_type == 'ready':
            self.player.set_is_ready(True)
        elif msg_type == 'update':
            self.player.set_input(text_data_json['key'])

    # Send game update to all players
    async def game_update(self, event):
        event_json = json.dumps(event['data'])
        await self.send(text_data=event_json)

    # Delete game from gamedict when game is done
    async def game_done(self, event):
        logger.debug(f'{self.tournament_group_name} game done')
        tournament_dict.pop(self.tournament_group_name)
