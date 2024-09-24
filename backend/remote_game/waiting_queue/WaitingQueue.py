import asyncio, uuid
from collections import OrderedDict
from channels.layers import get_channel_layer
import logging

logger = logging.getLogger('transcendence')

class WaitingQueue:
    def __init__(self, size):
        self.users = OrderedDict()
        self.running = False
        self.size = size

    async def put(self, user_id, channel_name):
        if user_id in self.users:
            logger.debug(f'WAITING QUEUE: {channel_name} is already waiting')
            self.users.move_to_end(user_id, last=True)
            channel_layer = get_channel_layer()
            await channel_layer.send(
                self.users[user_id],
                {
                    'type': 'queue_error',
                    'data': {
                        'status':'error',
                        'message': 'duplicated register'
                    }
                }
            )
        self.users[user_id] = channel_name

    def is_running(self):
        return self.running

    async def start(self):
        self.running = True
        channel_layer = get_channel_layer()
        while True:
            if len(self.users) >= self.size:
                match_name = uuid.uuid4()
                for _ in range(self.size):
                    user_id, channel_name = self.users.popitem(last=False)
                    await channel_layer.send(
                        channel_name,
                        {
                            "type": "match_found",
                            'data': {
                                'type':'match_name',
                                'match_name':f'{match_name}'
                            },
                            # "match_name": f'{match_name}',
                        }
                    )
            await asyncio.sleep(1)

    async def delete_from_queue(self, user, channel_name):
        if user in self.users:
            if self.users[user] == channel_name:
                self.users.pop(user)
                logger.info(f'WAITING QUEUE: {user} has been deleted')
