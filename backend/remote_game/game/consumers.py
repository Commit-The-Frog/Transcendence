import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async
from .Game import Game
from .Versus import Versus
from .Tournament import Tournament
from remote_game.game_objects.Player import Player
from remote_game import Exceptions
import logging
import urllib.parse

versus_dict: dict[str, Versus] = {}
tournament_dict: dict[str, Tournament] = {}

logger = logging.getLogger('transcendence')

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # 쿼리 문자열을 파싱하여 match_name과 id를 가져오기
            query_string = self.scope['query_string'].decode('utf-8')
            query_params = urllib.parse.parse_qs(query_string)

            # match_name과 id 추출
            match_name = query_params.get('match_name', [None])[0]
            user_id = self.scope['session'].get('api_id')
            session = self.scope['session']
            session['previous_url'] = '/pingpong/remote' # 정확한 previous_url 설정 필요
            await database_sync_to_async(session.save)()
            cookies = self.scope.get('cookies', {})
            access_token = cookies.get('access_token')
            if not access_token:
                raise InvalidToken()
            UntypedToken(access_token)
            self.player = None
            await self.accept()
            if match_name and user_id:
                self.match_group_name = f'versus_{match_name}'
                self.player = Player(user_id, self.channel_name)
                if not await self.player.get_db_object():
                    await self.close()
                    return
                await self.channel_layer.group_add(
                    self.match_group_name, self.channel_name
                )
            else:
                await self.close()
                return
            logger.debug(f'{self.player.get_id()} connected to {self.match_group_name}')
            if self.match_group_name not in versus_dict: # 게임에 먼저 참가한다면,
                logger.debug("Versus Created")
                versus_dict[self.match_group_name] = Versus(self.match_group_name)
                self.versus = versus_dict[self.match_group_name]
                self.versus.add_player(self.player)
                asyncio.create_task(self.versus.start())
            elif not versus_dict[self.match_group_name].player_is_full(): # 이미 게임에 한명이 들어가있다면,
                logger.debug("Versus Joined")
                self.versus = versus_dict[self.match_group_name]
                self.versus.add_player(self.player)
            else: # 게임에 이미 두명이 들어갔다면,
                await self.close(1000)
        except (TokenError, InvalidToken) as e:
            logger.error(f'{e} exception in game consumer connect')
            await self.send(text_data=json.dumps({
                'type': 'redirect',
                'url': 'api/login/refresh',
            }))
            await self.close()
        except Exceptions.RemoteGameException as e:
            logger.error(f'{e} exception in game consumer connect')
            await self.send(f'{e}')
            await self.send('Socket Connection Closed')
            await self.close()
        except Exception as e:
            logger.error(f'{e} exception in game consumer connect')
            await self.send('UNEXPECTED EXCEPTION')
            await self.send('Socket Connection Closed')
            await self.close()

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
        try:
            text_data_json = json.loads(text_data)
            msg_type = text_data_json['type']
            if msg_type == 'ready':
                self.player.set_is_ready(True)
            elif msg_type == 'update':
                self.player.set_input(text_data_json['key'])
        except Exception as e:
            logger.error(f'{e} exception in game consumer receive')


    # Send game update to all players
    async def game_update(self, event):
        event_json = json.dumps(event['data'])
        await self.send(text_data=event_json)

    # Delete game from gamedict when game is done
    async def game_done(self, event):
        logger.debug(f'{self.match_group_name} game done')
        if self.match_group_name in versus_dict.keys():
            versus_dict.pop(self.match_group_name)

    async def game_abnormal(self, msg):
        logger.debug(f'{self.match_group_name} game abnormal exit')
        if self.match_group_name in versus_dict.keys():
            versus_dict.pop(self.match_group_name)
        message_json = json.dumps({
            'status': 'error',
            'message': msg
        })
        await self.send(text_data=message_json)
        await self.close()

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # 쿼리 문자열을 파싱하여 match_name과 id를 가져오기
            query_string = self.scope['query_string'].decode('utf-8')
            query_params = urllib.parse.parse_qs(query_string)

            # match_name과 id 추출
            tournament_name = query_params.get('match_name', [None])[0]
            user_id = self.scope['session'].get('api_id')
            session = self.scope['session']
            session['previous_url'] = '/pingpong/remote' # 정확한 previous_url 설정 필요
            await database_sync_to_async(session.save)()
            cookies = self.scope.get('cookies', {})
            access_token = cookies.get('access_token')
            if not access_token:
                raise InvalidToken()
            UntypedToken(access_token)
            self.player = None
            if tournament_name and user_id:
                self.tournament_group_name = f'tournament_{tournament_name}'
                self.player = Player(user_id, self.channel_name)
                if not await self.player.get_db_object():
                    await self.close()
                await self.channel_layer.group_add(
                    self.tournament_group_name, self.channel_name
                )
                await self.accept()
            else:
                await self.close()
                return
            logger.debug(f'TOURNAMENT: {self.player.get_id()} connected to {self.tournament_group_name}')
            if self.tournament_group_name not in tournament_dict.keys(): # 게임에 먼저 참가한다면,
                logger.debug("Tournament Created")
                tournament_dict[self.tournament_group_name] = Tournament(self.tournament_group_name)
                self.tournament = tournament_dict[self.tournament_group_name]
                self.tournament.add_player(self.player)
                asyncio.create_task(self.tournament.start())
            elif not tournament_dict[self.tournament_group_name].player_is_full():
                logger.debug("Tournament Joined")
                self.tournament = tournament_dict[self.tournament_group_name]
                self.tournament.add_player(self.player)
            else:
                await self.close(1000)
        except (TokenError, InvalidToken) as e:
            logger.error(f'{e} exception in game consumer connect')
            await self.send(text_data=json.dumps({
                'type': 'redirect',
                'url': 'api/login/refresh',
            }))
            await self.close()
        except Exception as e:
            await self.send('UNEXPECTED EXCEPTION')
            await self.send('Socket Connection Closed')
            await self.close()
            logger.error(f'{e} exception in tournament consumer connect')

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
        try:
            text_data_json = json.loads(text_data)
            msg_type = text_data_json['type']
            # logger.info(f'{self.player.get_id()} >> {text_data_json}')
            if msg_type == 'ready':
                self.player.set_is_ready(True)
            elif msg_type == 'update':
                self.player.set_input(text_data_json['key'])
        except KeyError:
            await self.send('Not Valid Json Format')
            logger.error(f'Not Valid Json Format from {self.player.get_id()}')

    # Send game update to all players
    async def game_update(self, event):
        event_json = json.dumps(event['data'])
        await self.send(text_data=event_json)

    # Delete game from tournament_dict when game is done
    async def game_done(self, event):
        logger.debug(f'{self.tournament_group_name} game done')
        if self.tournament_group_name in tournament_dict.keys():
            tournament_dict.pop(self.tournament_group_name)

    async def game_abnormal(self, msg):
        logger.debug(f'{self.tournament_group_name} game abnormal exit')
        if self.tournament_group_name in versus_dict.keys():
            versus_dict.pop(self.tournament_group_name)
        message_json = json.dumps({
            'status': 'error',
            'message': msg
        })
        await self.send(text_data=message_json)
        await self.close()