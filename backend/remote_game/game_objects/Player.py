import logging

from channels.layers import get_channel_layer
from user.models import Userdb
from asgiref.sync import sync_to_async

logger = logging.getLogger('transendense')

class Player:
    def __init__(self, userid, socket_id):
        self.__id = userid
        self.socket_id = socket_id
        self.__nickname = None
        self.__db_object = None
        self.__is_ready = False
        self.__score = 0
        self.__is_winner = False
        self.__input = {
            'upPressed' : False,
            'downPressed' : False,
        }
        self.__connected = True


    def get_id(self):
        return self.__id

    def get_is_ready(self):
        return self.__is_ready

    def get_score(self):
        return self.__score

    def get_is_winner(self):
        return self.__is_winner

    def get_input(self):
        return self.__input

    def is_connected(self):
        return self.__connected

    def set_is_ready(self, is_ready):
        self.__is_ready = is_ready

    def increment_score(self):
        self.__score += 1

    def set_score(self, score):
        self.__score = score

    def set_winner(self, is_winner):
        self.__is_winner = is_winner

    def set_losser(self, is_winner):
        self.__is_winner = is_winner

    def set_input(self, key_input):
        self.__input = key_input

    def set_disconnect(self):
        self.__connected = False

    def reset(self):
        self.__score = 0
        self.__is_ready = False
        self.__is_winner = False
        self.__input['upPressed'] = False
        self.__input['downPressed'] = False

    def get_nickname(self):
        return self.__nickname

    async def get_db_object(self):
        if not self.__db_object:
            self.__db_object = await sync_to_async(Userdb.objects.get)(user_id=self.__id)
            logger.info(f'{self.__id} saved as {self.__db_object.id}')
            self.__nickname = self.__db_object.nickname
        return self.__db_object

    async def privmsg(self, message):
        channel_layer = get_channel_layer()
        await channel_layer.send(
            self.socket_id,
            {
                'type': 'game_update',
                'data': message,
            }
        )