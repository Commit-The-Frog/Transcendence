from rest_framework import serializers
from .models import Game, Tournament, PixelGame, PixelTournament


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = ('type', 'left_user', 'left_win', 'right_user', 'right_win', 'pub_date')


class TournamentSerializer(serializers.ModelSerializer):
    game1 = GameSerializer()
    game2 = GameSerializer()
    game3 = GameSerializer()

    class Meta:
        model = Tournament
        fields = ('game1', 'game2', 'game3')


class PixelGameSerializer(serializers.ModelSerializer):

    class Meta:
        model = PixelGame
        fields = ('user_id', 'type', 'left_user', 'left_win', 'right_user', 'right_win', 'pub_date')


class PixelTournamentSerializer(serializers.ModelSerializer):
    game1 = PixelGameSerializer()
    game2 = PixelGameSerializer()
    game3 = PixelGameSerializer()

    class Meta:
        model = PixelTournament
        fields = ('game1', 'game2', 'game3')
