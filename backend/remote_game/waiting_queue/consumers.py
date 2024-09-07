import asyncio
import json
import urllib.parse

from channels.generic.websocket import AsyncWebsocketConsumer
from . import WaitingQueue

GameWaitingQueue = WaitingQueue.WaitingQueue(2)
TournamentWaitingQueue = WaitingQueue.WaitingQueue(4)

class WaitingQueueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode('utf-8')
        query_params = urllib.parse.parse_qs(query_string)

        self.que_type = query_params.get('type', [None])[0]
        if not GameWaitingQueue.is_running():  # Assuming you have a way to check if it's already running
            asyncio.create_task(GameWaitingQueue.start())
        if not TournamentWaitingQueue.is_running():
            asyncio.create_task(TournamentWaitingQueue.start())
        if self.que_type == '1vs1':
            await GameWaitingQueue.put(self.channel_name)
        elif self.que_type == 'tournament':
            await TournamentWaitingQueue.put(self.channel_name)
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def disconnect(self, code):
        if self.que_type == '1vs1':
            await GameWaitingQueue.delete_from_queue(self.channel_name)
        elif self.que_type == 'tournament':
            await TournamentWaitingQueue.delete_from_queue(self.channel_name)

    async def match_found(self, event):
        match_name = event['match_name']
        await self.send(text_data=match_name)
        await self.close(code=1000)