import asyncio
from channels.layers import get_channel_layer
from remote_game.game_objects.Ball import Ball
from remote_game.game_objects.Paddle import Paddle
from remote_game.game_objects.Player import Player
# import time

import logging

logger = logging.getLogger('transcendence')

class Game:
    canvas_width = 800
    canvas_height = 600
    game_status = {
        0 : 'waiting',
        1 : 'in progress',
        2 : 'game over',
        3 : 'error'
    }
    def __init__(self, game_id, tournament_id:str=None):
        self.id = game_id
        self.tournament_id = tournament_id
        self.status = 0
        self.players: dict[int, Player] = {}
        self.__ball = Ball((Game.canvas_width - 15) / 2, (Game.canvas_height - 15) / 2)
        self.__left_paddle = Paddle(50, (Game.canvas_height - 100) / 2)
        self.__right_paddle = Paddle(Game.canvas_width - 50 - 10, (Game.canvas_height - 100) / 2)
        self.winner = None

    async def start(self):
        channel_layer = get_channel_layer()
        while len(self.players) < 2:
            await asyncio.sleep(0.5)
        while len(self.players) >= 2 and (not self.players[0].get_is_ready() or not self.players[1].get_is_ready()): #waiting
            if not self.players[0].is_connected() or not self.players[1].is_connected():
                break
            await self.__send_message(channel_layer)
            await asyncio.sleep(1)
        if len(self.players) >= 2 and self.players[0].is_connected() and self.players[1].is_connected():
            logger.info(f'{self.id} Game Now Start')
            self.status = 1
        else:
            self.status = 3
        while self.status == 1: # game is in progress
            await self.__send_message(channel_layer)
            self.__calculate()
            await asyncio.sleep(1/100)
        if self.status == 2:
            logger.info(f'{self.id} Game End')
            await self.__send_message(channel_layer)
        else: # game over by connection lost
            logger.info(f'{self.id} Game Error End')
            if self.players[0].is_connected():
                self.winner = self.players[0]
            elif self.players[1].is_connected():
                self.winner = self.players[1]
            else:
                self.winner = self.players[0]
            await self.__send_message(channel_layer)

    def add_player(self, player):
        idx = len(self.players)
        self.players[idx] = player

    def __calculate(self):
        if not self.players[0].is_connected() or not self.players[1].is_connected():
            self.status = 3
            return
        if self.players[0].get_input()['upPressed']:
            self.__left_paddle.dy = min(-Paddle.vInit, self.__left_paddle.dy - self.__left_paddle.accel)
        if self.players[0].get_input()['downPressed']:
            self.__left_paddle.dy = max(Paddle.vInit, self.__left_paddle.dy + self.__left_paddle.accel)
        if not self.players[0].get_input()['upPressed'] and not self.players[0].get_input()['downPressed']:
            self.__left_paddle.dy = 0
        if self.players[1].get_input()['upPressed']:
            self.__right_paddle.dy = min(-Paddle.vInit, self.__right_paddle.dy - self.__right_paddle.accel)
        if self.players[1].get_input()['downPressed']:
            self.__right_paddle.dy = max(Paddle.vInit, self.__right_paddle.dy + self.__right_paddle.accel)
        if not self.players[1].get_input()['upPressed'] and not self.players[1].get_input()['downPressed']:
            self.__right_paddle.dy = 0

        self.__left_paddle.move(self.canvas_height)
        self.__right_paddle.move(self.canvas_height)

        self.__ball.x += self.__ball.dx
        self.__ball.y += self.__ball.dy
        if self.__ball.dy > 0 and self.__ball.y + self.__ball.radius > self.canvas_height:
            self.__ball.dy *= -1
        elif self.__ball.dy < 0 and self.__ball.y - self.__ball.radius < 0:
            self.__ball.dy *= -1
        if self.__ball.dx > 0:
            if self.__ball.x - self.__ball.radius > Game.canvas_width:
                self.players[0].increment_score()
                self.__ball.reset((Game.canvas_width - 15) / 2, (Game.canvas_height - 15) / 2, 'L')
            elif -self.__ball.radius <= self.__ball.x - self.__right_paddle.x <= self.__ball.radius:
                if (self.__ball.y - self.__ball.radius <= self.__right_paddle.y + self.__right_paddle.height and
                    self.__ball.y + self.__ball.radius >= self.__right_paddle.y):
                    self.__ball.dx *= -1
                    self.__ball.dx *= Ball.em + 1
                    self.__ball.dx = min(Ball.ball_speed_max, self.__ball.dx)
                    self.__ball.dy += self.__right_paddle.dy * Ball.cof
                    self.__ball.dy = min(Ball.ball_speed_max, self.__ball.dy)
        elif self.__ball.dx < 0:
            if self.__ball.x + self.__ball.radius < 0:
                self.players[1].increment_score()
                self.__ball.reset((Game.canvas_width - 15) / 2, (Game.canvas_height - 15) / 2, 'R')
            elif -self.__ball.radius <= self.__ball.x - (self.__left_paddle.x + self.__left_paddle.width) <= self.__ball.radius:
                if (self.__ball.y - self.__ball.radius <= self.__left_paddle.y + self.__left_paddle.height and
                        self.__ball.y + self.__ball.radius >= self.__left_paddle.y):
                    self.__ball.dx *= -1
                    self.__ball.dx *= Ball.em + 1
                    self.__ball.dx = min(Ball.ball_speed_max, self.__ball.dx)
                    self.__ball.dy += self.__left_paddle.dy * Ball.cof
                    self.__ball.dy = min(Ball.ball_speed_max, self.__ball.dy)

        if self.players[0].get_score() >= 5:
            self.winner = self.players[0]
            self.status = 2
        if self.players[1].get_score() >= 5:
            self.winner = self.players[1]
            self.status = 2

    async def __send_message(self, channel_layer):
        message = None
        if self.status == 0:
            message = {
                'type': 'game_update',
                'data': {
                    'status': Game.game_status[self.status],
                    'playerL': {
                        'nickname': self.players[0].get_id(),
                        'is_ready': self.players[0].get_is_ready()
                    },
                    'playerR': {
                        'nickname': self.players[1].get_id(),
                        'is_ready': self.players[1].get_is_ready()
                    },
                }
            }
        elif self.status == 1:
            message = {
                'type': 'game_update',
                'data': {
                    'status': Game.game_status[self.status],
                    'playerL': {
                        'nickname': self.players[0].get_id(),
                        'score': self.players[0].get_score(),
                    },
                    'playerR': {
                        'nickname': self.players[1].get_id(),
                        'score': self.players[1].get_score(),
                    },
                    'ball': {
                        'x': self.__ball.x,
                        'y': self.__ball.y,
                        'radius': self.__ball.radius,
                    },
                    'paddleL': {
                        'x': self.__left_paddle.x,
                        'y': self.__left_paddle.y,
                        'width': self.__left_paddle.width,
                        'height': self.__left_paddle.height,
                    },
                    'paddleR': {
                        'x': self.__right_paddle.x,
                        'y': self.__right_paddle.y,
                        'width': self.__right_paddle.width,
                        'height': self.__right_paddle.height,
                    },
                    'winner': self.winner.get_id() if self.winner else ""
                }
            }
        elif self.status == 2:
            message = {
                'type': 'game_update',
                'data' : {
                    'status': Game.game_status[self.status],
                    'playerL': {
                        'nickname': self.players[0].get_id(),
                        'score': self.players[0].get_score(),
                    },
                    'playerR': {
                        'nickname': self.players[1].get_id(),
                        'score': self.players[1].get_score(),
                    },
                    'ball': {
                        'x': self.__ball.x,
                        'y': self.__ball.y,
                        'radius': self.__ball.radius,
                    },
                    'paddleL': {
                        'x': self.__left_paddle.x,
                        'y': self.__left_paddle.y,
                        'width': self.__left_paddle.width,
                        'height': self.__left_paddle.height,
                    },
                    'paddleR': {
                        'x': self.__right_paddle.x,
                        'y': self.__right_paddle.y,
                        'width': self.__right_paddle.width,
                        'height': self.__right_paddle.height,
                    },
                    'winner': self.winner.get_id() if self.winner else ""
                }
            }
        else:
            message = {
                'type': 'game_update',
                'data' : {
                    'status': Game.game_status[self.status],
                    'winner': self.winner.get_id() if self.winner else "",
                }
            }
        await channel_layer.group_send(self.id, message)