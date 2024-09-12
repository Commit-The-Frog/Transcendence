from django.db.models import Q
from django.http import JsonResponse
from django.views import View
from login.views import CheckValidAT
from .models import Userdb
from .serializers import TournamentSerializer, GameSerializer, PixelTournamentSerializer, PixelGameSerializer
from user.serializers import UserdbSerializer
from datetime import datetime
import json
import sys

from .models import Game, Tournament, PixelGame, PixelTournament

# @CheckValidAT
class MatchListView(View):
    def get_pixel_game_data(self, pixelgame):
        return_val = {}
        return_val['playerL'] = {
            'nickname': pixelgame['left_user'],
            'win': pixelgame['left_win'],
        }
        return_val['playerR'] = {
            'nickname': pixelgame['right_user'],
            'win': pixelgame['right_win'],
        }
        return return_val

    def get_game_data(self, game):
        l_player_serialize = UserdbSerializer(Userdb.objects.get(id=game['left_user'])).data
        r_player_serialize = UserdbSerializer(Userdb.objects.get(id=game['right_user'])).data
        return_val = {}
        return_val['playerL'] = {
            'nickname': l_player_serialize['nickname'],
            'win': game['left_win'],
        }
        return_val['playerR'] = {
            'nickname': r_player_serialize['nickname'],
            'win': game['right_win'],
        }
        return return_val

    def get_pixel_tournament_dataset(self, tournament_list):
        data_list = []
        for t_instance in tournament_list:
            tournament_data = {}
            t_game_data = PixelTournamentSerializer(t_instance).data
            tournament_data['sort_date'] = str(t_game_data['game1']['pub_date'])
            tournament_data['date'] = str(t_game_data['game1']['pub_date'].split('T')[0])
            tournament_data['istournament'] = True
            tournament_data['game'] = t_game_data['game1']['type']
            for game_number in range(1, 4):  # game1, game2, game3에 대한 반복
                game_key = f'game{game_number}'  # 'game1', 'game2', 'game3' 생성
                game = t_game_data[game_key]
                tournament_data[f'round{game_number}'] = self.get_pixel_game_data(game)
            data_list.append(tournament_data)
        return data_list;

    def get_pixel_pvp_dataset(self, pixel_pvp_list):
        data_list = []
        for instance in pixel_pvp_list:
            pvp_data = {}
            p_game_data = PixelGameSerializer(instance).data
            pvp_data['sort_date'] = str(p_game_data['pub_date'])
            pvp_data['date'] = str(p_game_data['pub_date'].split('T')[0])
            pvp_data['istournament'] = False
            pvp_data['game'] = p_game_data['type']
            pvp_data.update(self.get_pixel_game_data(p_game_data))
            data_list.append(pvp_data)
        return data_list;

    def get_tournament_dataset(self, tournament_list):
        data_list = []
        for t_instance in tournament_list:
            tournament_data = {}
            t_game_data = TournamentSerializer(t_instance).data
            tournament_data['sort_date'] = str(t_game_data['game1']['pub_date'])
            tournament_data['date'] = str(t_game_data['game1']['pub_date'].split('T')[0])
            tournament_data['istournament'] = True
            tournament_data['game'] = t_game_data['game1']['type']
            for game_number in range(1, 4):  # game1, game2, game3에 대한 반복
                game_key = f'game{game_number}'  # 'game1', 'game2', 'game3' 생성
                game = t_game_data[game_key]
                tournament_data[f'round{game_number}'] = self.get_game_data(game)
            data_list.append(tournament_data)
        return data_list;

    def get_pvp_dataset(self, pvp_list):
        data_list = []
        for instance in pvp_list:
            pvp_data = {}
            p_game_data = GameSerializer(instance).data
            pvp_data['sort_date'] = str(p_game_data['pub_date'])
            pvp_data['date'] = str(p_game_data['pub_date'].split('T')[0])
            pvp_data['istournament'] = False
            pvp_data['game'] = p_game_data['type']
            pvp_data.update(self.get_game_data(p_game_data))
            data_list.append(pvp_data)
        return data_list;

    def get(self, request, *args, **kwargs):
        try:
            target_id = request.GET.get('id')
            if target_id is None or not target_id.isdigit():
                return JsonResponse({'error': 'Invalid id'}, status=404)
            target_instance_id = Userdb.objects.get(user_id=target_id).id
            game_list = Game.objects.filter(Q(left_user=target_instance_id) | Q(right_user=target_instance_id))
            pixel_game_list = PixelGame.objects.filter(user_id=target_instance_id)
            tournament_list = Tournament.objects.filter(Q(game1__in=game_list.values_list('id', flat=True)) | Q(
                game2__in=game_list.values_list('id', flat=True)))
            pixel_tournament_list = PixelTournament.objects.filter(
                Q(game1__in=pixel_game_list.values_list('id', flat=True)) | Q(
                    game2__in=pixel_game_list.values_list('id', flat=True)))
            tournament_game_ids = set(tournament_list.values_list('game1', flat=True)) | set(
                tournament_list.values_list('game2', flat=True)) | set(
                tournament_list.values_list('game3', flat=True))
            pixel_tournament_game_ids = set(pixel_tournament_list.values_list('game1', flat=True)) | set(
                pixel_tournament_list.values_list('game2', flat=True)) | set(
                pixel_tournament_list.values_list('game3', flat=True))
            pvp_list = game_list.exclude(id__in=tournament_game_ids)
            pixel_pvp_list = pixel_game_list.exclude(id__in=pixel_tournament_game_ids)
            # tournament_list 순회하면서 데이터 적재 이떄 시간은 game1을 기준으로 작성
            # 시간을 넣어놔야 나중에 PVP와 비교 가능~
            data_list = self.get_tournament_dataset(tournament_list)
            data_list = data_list + self.get_pixel_tournament_dataset(pixel_tournament_list)
            data_list = data_list + self.get_pvp_dataset(pvp_list)
            data_list = data_list + self.get_pixel_pvp_dataset(pixel_pvp_list)
            sorted_data = sorted(data_list, key=lambda x: datetime.strptime(x['sort_date'], '%Y-%m-%dT%H:%M:%S.%f%z'), reverse=True)
            for item in sorted_data:
                del item['sort_date']
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'Host not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        return JsonResponse(sorted_data, safe=False, status=200)
