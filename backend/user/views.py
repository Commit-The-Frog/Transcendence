from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import redirect
from django.views import View
from login.views import CheckValidAT
from match.serializers import GameSerializer
from .serializers import UserdbSerializer, FriendsSerializer
from .models import Userdb, Friends
from match.models import Game
from PIL import Image, UnidentifiedImageError
from django.conf import settings
import json

import sys


class UserView(View):
    def get_win_rate(self, target_db):
        game_list = Game.objects.filter(Q(left_user=target_db.id) | Q(right_user=target_db.id))
        total = 0
        win = 0
        for game in game_list:
            data = GameSerializer(game).data
            total += 1
            if data['left_user'] == target_db.id:
                win += data['left_win']
            else:
                win += data['right_win']
        if total == 0:
            win_rate = 0
        else:
            win_rate = win / total * 100
        int_part = int(win_rate)
        dec_part = win_rate - int_part
        if dec_part >= 0.5:
            int_part += 1
        return int_part

    @CheckValidAT
    def get(self, request, *args, **kwargs):
        try:
            host_id = request.session.get('api_id')
            if host_id is None:
                return redirect(settings.HOME_URL)
            target_id = request.GET.get('id')
            if target_id is not None and not target_id.isdigit():
                return JsonResponse({'error': 'Invalid id'}, status=404)
            if target_id is None:
                target_id = host_id
            is_host = (str(target_id) == str(host_id))
            target_db = Userdb.objects.get(user_id=target_id)
            is_friend = True
            if is_host is False and Friends.objects.filter(user=Userdb.objects.get(user_id=host_id),
                                    friend=Userdb.objects.get(user_id=target_id)).count() == 0:
                is_friend = False
            win_rate = self.get_win_rate(target_db)
            target_dict = target_db.__dict__
            user_data = {
                'user_id': target_dict['user_id'],
                'nickname': target_dict['nickname'],
                'status': target_dict['status'],
                'profile_image': target_dict['profile_image'],
                'host': is_host,
                'friend': is_friend,
                'use_2fa': target_dict['use_2fa'],
                'win_rate': win_rate,
            }
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse(user_data, safe=False, status=200)

    @CheckValidAT
    def post(self, request, *args, **kwargs):
        try:
            host_id = request.session.get('api_id')
            host_db = Userdb.objects.get(user_id=host_id)
            new_nickname = request.POST.get('nickname', '').strip()
            new_profile_image = request.FILES.get('profile_image')
            new_use_2fa = request.POST.get('use_2fa')
            target_data = {}
            if new_use_2fa:
                target_data['use_2fa'] = new_use_2fa;
            if new_nickname != host_db.nickname:
                if Userdb.objects.filter(nickname=new_nickname).count() == 0:
                    target_data['nickname'] = new_nickname
                else:
                    return JsonResponse({'error': 'Nickname duplication'}, status=406)
            if new_profile_image:
                img = Image.open(new_profile_image)
                img.verify()
                new_profile_image.seek(0)
                host_db.profile_image.delete(save=False)
                target_data['profile_image'] = new_profile_image
            serializer = UserdbSerializer(instance=host_db, data=target_data, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return JsonResponse({'error': serializer.errors}, status=404)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except UnidentifiedImageError:
            return JsonResponse({'error': 'Wrong image type'}, status=406)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'User updated successfully'}, status=200)

class FriendView(View):
    @CheckValidAT
    def get(self, request, *args, **kwargs):
        try:
            host_id = request.GET.get('id')
            if host_id is not None and not host_id.isdigit():
                return JsonResponse({'error': 'Invalid id'}, status=404)
            if host_id is None:
                host_id = request.session.get('api_id')
            target_object = Userdb.objects.get(user_id=host_id)
            friend_list = Friends.objects.filter(user=target_object.id)
            serialize = FriendsSerializer(friend_list, many=True)
            data_list = []
            for target in serialize.data:
                user_data = {
                    'user_id': target['friend'].get('user_id'),
                    'nickname': target['friend'].get('nickname'),
                    'status': target['friend'].get('status'),
                }
                data_list.append(user_data)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse(data_list, safe=False, status=200)

    @CheckValidAT
    def post(self, request, *args, **kwargs):
        try:
            host_id = request.session.get('api_id')
            host_instance = Userdb.objects.get(user_id=host_id)
            if Friends.objects.filter(user=host_instance).count() == 10:
                return JsonResponse({'notice': 'Super insider'}, status=406)
            json_data = json.loads(request.body)
            friend_id = json_data.get('user_id')
            friend_instance = Userdb.objects.get(user_id=friend_id)
            if Friends.objects.filter(user=host_instance, friend=friend_instance).count() != 0:
                return JsonResponse({'notice': 'Already friend'}, status=406)
            insert_data = Friends(user=host_instance, friend=friend_instance)
            insert_data.save()
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'User updated successfully'}, status=200)

    @CheckValidAT
    def delete(self, request, *args, **kwars):
        try:
            host_id = request.session.get('api_id')
            json_data = json.loads(request.body)
            friend_id = json_data.get('user_id')
            host_instance = Userdb.objects.get(user_id=host_id)
            friend_instance = Userdb.objects.get(user_id=friend_id)
            friend_data = Friends.objects.get(user=host_instance, friend=friend_instance)
            friend_data.delete()
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Friends.DoesNotExist:
            return JsonResponse({'error': 'Friend not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'User updated successfully'}, status=200)

class SearchView(View):
    @CheckValidAT
    def get(self, request, *args, **kwargs):
        try:
            host_nickname = request.session.get('api_nick')
            fixed_char = request.GET.get('nick')
            data_list = []
            if len(fixed_char) == 0:
                return JsonResponse(data_list, safe=False, status=200)
            user_list = Userdb.objects.filter(nickname__startswith=fixed_char)
            for target in user_list:
                if target.nickname != host_nickname:
                    user_data = {
                        'id': target.user_id,
                        'nick': target.nickname,
                        'status': target.status,
                    }
                    data_list.append(user_data)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse(data_list, safe=False, status=200)
