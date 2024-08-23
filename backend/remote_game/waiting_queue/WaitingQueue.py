import asyncio, uuid
from channels.layers import get_channel_layer

class WaitingQueue:
    def __init__(self, size):
        self.users = set()
        self.running = False
        self.lock = asyncio.Lock()
        self.size = size

    async def put(self, user):
        async with self.lock:
            self.users.add(user)

    def is_running(self):
        return self.running

    async def start(self):
        self.running = True
        channel_layer = get_channel_layer()
        while True:
            async with self.lock:
                user_group = []
                if len(self.users) >= self.size:
                    for _ in range(self.size):
                        user_group.append(self.users.pop())
                    match_name = uuid.uuid4()
                    for user in user_group:
                        await channel_layer.send(
                            user,
                            {
                                "type": "match_found",
                                "match_name": f'{match_name}'
                            }
                        )
                else:
                    await asyncio.sleep(1)
                    continue

    async def delete_from_queue(self, user):
        async with self.lock:
            self.users.discard(user)
