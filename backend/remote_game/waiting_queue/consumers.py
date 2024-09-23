import asyncio
import json
import urllib.parse

from channels.generic.websocket import AsyncWebsocketConsumer
from . import WaitingQueue
from remote_game import Exceptions
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async

import logging

logger = logging.getLogger('transcendence')
GameWaitingQueue = WaitingQueue.WaitingQueue(2)
TournamentWaitingQueue = WaitingQueue.WaitingQueue(4)

class WaitingQueueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            query_string = self.scope['query_string'].decode('utf-8')
            query_params = urllib.parse.parse_qs(query_string)
            self.que_type = query_params.get('type', [None])[0]
            self.user_id = self.scope['session'].get('api_id')
            cookies = self.scope.get('cookies', {})
            access_token = cookies.get('access_token')
            await self.accept()
            if not access_token:
                raise InvalidToken()
            UntypedToken(access_token)
            if not GameWaitingQueue.is_running():  # Assuming you have a way to check if it's already running
                asyncio.create_task(GameWaitingQueue.start())
            if not TournamentWaitingQueue.is_running():
                asyncio.create_task(TournamentWaitingQueue.start())
            if self.que_type == '1vs1':
                await GameWaitingQueue.put(self.user_id, self.channel_name)
            elif self.que_type == 'tournament':
                await TournamentWaitingQueue.put(self.user_id, self.channel_name)
        except Exceptions.RemoteGameException as e:
            logger.error(f'{e} exception in waiting queue consumer connect')
            await self.send(f'{e}')
            await self.send('Socket Connection Closed')
            await self.close()
        except (TokenError, InvalidToken) as e:
            logger.error(f'{e} exception in game consumer connect')
            await self.send(text_data=json.dumps({
                'type': 'refresh'
            }))
            await self.close()
        except Exception as e:
            logger.error(f'UNEXPECTED EXCEPTION >> {e} exception in waiting queue consumer connect <<')
            await self.send('UNEXPECTED ERROR')
            await self.send('Socket Connection Closed')
            await self.close()


    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def disconnect(self, code):
        try:
            if self.que_type == '1vs1':
                await GameWaitingQueue.delete_from_queue(self.user_id)
            elif self.que_type == 'tournament':
                await TournamentWaitingQueue.delete_from_queue(self.user_id)
        except Exceptions.RemoteGameException as e:
            logger.error(f'{e} exception in waiting queue consumer disconnect')
        except Exception as e:
            logger.error(f'UNEXPECTED EXCEPTION >> {e} exception in waiting queue consumer disconnect <<')

    async def match_found(self, event):
        try:
            match_name = event['match_name']
            await self.send(text_data=match_name)
            await self.close(code=1000)
        except Exception as e:
            logger.error(f'{e} exception in waiting queue consumer match found')

    async def queue_error(self, event):
        await self.send(text_data=json.dumps(event))
        await self.close()
