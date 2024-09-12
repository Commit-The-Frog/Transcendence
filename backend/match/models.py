from django.db import models
from user.models import Userdb


class Game(models.Model):
    type = models.CharField(max_length=10)
    left_user = models.ForeignKey(Userdb, on_delete=models.CASCADE, related_name='left_user')
    left_win = models.BooleanField()
    right_user = models.ForeignKey(Userdb, on_delete=models.CASCADE, related_name='right_user')
    right_win = models.BooleanField()
    pub_date = models.DateTimeField(auto_now=False, auto_now_add=True)


class Tournament(models.Model):
    game1 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='tournament_game1')
    game2 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='tournament_game2')
    game3 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='tournament_game3')


class PixelGame(models.Model):
    user_id = models.ForeignKey(Userdb, on_delete=models.CASCADE)
    type = models.CharField(max_length=10)
    left_user = models.CharField(max_length=10)
    left_win = models.BooleanField()
    right_user = models.CharField(max_length=10)
    right_win = models.BooleanField()
    pub_date = models.DateTimeField(auto_now=False, auto_now_add=True)


class PixelTournament(models.Model):
    game1 = models.ForeignKey(PixelGame, on_delete=models.CASCADE, related_name='pixel_tournament_game1')
    game2 = models.ForeignKey(PixelGame, on_delete=models.CASCADE, related_name='pixel_tournament_game2')
    game3 = models.ForeignKey(PixelGame, on_delete=models.CASCADE, related_name='pixel_tournament_game3')
