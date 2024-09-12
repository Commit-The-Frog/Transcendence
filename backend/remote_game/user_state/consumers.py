import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from backend.user.models import Userdb
from asgiref.sync import sync_to_async
import logging
from collections import defaultdict

logger = logging.getLogger('transcendence')

user_dict = defaultdict(int)

class UserStateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.user_id = self.scope['session'].get('api_id')
            user = await sync_to_async(Userdb.objects.get)(user_id=self.user_id)
            user.status = True
            user_dict[self.user_id] += 1
            await sync_to_async(user.save)()
        except Exception as e:
            logger.error(f'{e} Error!!')
            await self.close()

    async def disconnect(self, code):
        try:
            if user_dict[self.user_id] > 0:
                user_dict[self.user_id] -= 1
            if user_dict[self.user_id] == 0:
                user = await sync_to_async(Userdb.objects.get)(user_id=self.user_id)
                user.status = False
                await sync_to_async(user.save)()
        except Exception as e:
            logger.error(f'{e} Error!!')

    async def receive(self, text_data=None, bytes_data=None):
        pass