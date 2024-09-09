from django.db.models import Q
from django.http import JsonResponse
from django.views import View
from login.views import CheckValidAT
from .models import Userdb
from django.db.models import OuterRef, Subquery
import json
import sys

from .models import Game, Tournament, PvP

@CheckValidAT
class MatchListView(View):
    def get(self, request, *args, **kwargs):
        try:
            target_id = request.GET.get('id')
            if target_id is None or not target_id.isdigit():
                return JsonResponse({'error': 'Invalid id'}, status=404)
            target_instance_id = Userdb.objects.get(user_id=target_id).id
            game_list = PvP.objects.filter(game=)
            #game_list = Game.objects.filter(Q(left_user=target_instance_id) | Q(right_user=target_instance_id))
            for game_instance in game_list:
                match_list = Tournament.objects.filter(game1=target_instance.id)
                serialize = FriendsSerializer(match_list, many=True)
                data_list = []
                for target in serialize.data:
                    user_data = {
                        'user_id': target['friend'].get('user_id'),
                        'nickname': target['friend'].get('nickname'),
                        'status': True,
                    }
                    data_list.append(user_data)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'Host not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse(data_list, safe=False, status=200)
