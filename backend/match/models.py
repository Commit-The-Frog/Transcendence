from django.db import models
from user.models import Userdb


class Game(models.Model):
    left_user = models.ForeignKey(Userdb, on_delete=models.CASCADE, related_name='left_user')
    left_score = models.IntegerField()
    right_user = models.ForeignKey(Userdb, on_delete=models.CASCADE, related_name='right_user')
    right_score = models.IntegerField()
    pub_date = models.DateTimeField(auto_now=False, auto_now_add=True)


class Tournament(models.Model):
    game1 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='tournament_game1')
    game2 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='tournament_game2')
    game3 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='tournament_game3')


class PvP(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
