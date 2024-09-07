import asyncio, uuid
from channels.layers import get_channel_layer
import logging

logger = logging.getLogger('transcendence')

class WaitingQueue:
    def __init__(self, size):
        self.users = set()
        self.running = False
        self.lock = asyncio.Lock()
        self.size = size

    async def put(self, user):
        async with self.lock:
            if user in self.users:
                logger.debug(f'WAITING QUEUE: {user} is already waiting')
                self.users.remove(user)
            self.users.add(user)

    def is_running(self):
        return self.running

    async def start(self):
        self.running = True
        channel_layer = get_channel_layer()
        while True:
            async with self.lock:
                user_group = set()
                if len(self.users) >= self.size:
                    for _ in range(self.size):
                        user_group.add(self.users.pop())
                    if len(user_group) < self.size:
                        logger.debug(f'WAITING QUEUE: user duplicated error {user_group}')
                        for user in user_group:
                            self.users.add(user)
                        continue
                    match_name = uuid.uuid4()
                    for user in user_group:
                        await channel_layer.send(
                            user,
                            {
                                "type": "match_found",
                                "match_name": f'{match_name}'
                            }
                        )
                await asyncio.sleep(1)

    async def delete_from_queue(self, user):
        async with self.lock:
            self.users.discard(user)
