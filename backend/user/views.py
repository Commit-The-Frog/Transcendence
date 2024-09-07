from django.http import JsonResponse
from django.views import View
from login.views import CheckValidAT
from .serializers import UserdbSerializer, FriendsSerializer
from .models import Userdb, Friends
from PIL import Image, UnidentifiedImageError
import json

import sys


class UserView(View):
    @CheckValidAT
    def get(self, request, *args, **kwargs):
        try:
            host_id = request.session.get('api_id')
            if host_id is None:
                return JsonResponse({'error': 'Host not found'}, status=404)
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
            target_dict = target_db.__dict__
            user_data = {
                'user_id': target_dict['user_id'],
                'nickname': target_dict['nickname'],
                'status': target_dict['status'],
                # 'profile_image': f'login/{target_db.profile_image.url}',
                'profile_image': target_dict['profile_image'],
                'host': is_host,
                'friend': is_friend,
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
            new_nickname = request.POST.get('nickname')
            new_profile_image = request.FILES.get('profile_image')
            target_data = {}
            if new_nickname != request.session.get('api_nick'):
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
            host_db.save()
            if new_nickname:
                request.session['api_nick'] = new_nickname
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
                    'status': True,
                }
                data_list.append(user_data)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'Host not found'}, status=404)
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
            insert_data = Friends(user=host_instance, friend=friend_instance)
            insert_data.save()
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'User updated successfully'}, status=200)

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
                        'status': True,
                    }
                    data_list.append(user_data)
        except Userdb.DoesNotExist:
            return JsonResponse({'error': 'Host not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse(data_list, safe=False, status=200)
