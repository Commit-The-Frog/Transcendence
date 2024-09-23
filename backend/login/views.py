from django.shortcuts import redirect
from django.core.mail import send_mail
from django.http import JsonResponse
from django.conf import settings
from django.views import View
from functools import wraps
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken, AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from user.serializers import UserdbSerializer
from user.models import Userdb
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import os
import sys
import requests


def CheckValidAT(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        try:
            access_token = request.COOKIES.get('access_token')
            # request.session['previous_url'] = request.META.get('PATH_INFO')
            if not access_token:
                return JsonResponse({'message': 'No Token'}, status=401) # 401로 보내고 refresh는 at rt 갱신한 토큰만 보내기
            UntypedToken(access_token)
            response = view_func(self, request, *args, **kwargs)
        except (InvalidToken, TokenError) as e:
            return JsonResponse({'message': 'Invalid Token'}, status=401) # 401로 보내고 refresh는 at rt 갱신한 토큰만 보내기
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        return response

    return _wrapped_view


def is_token_valid(token):
    try:
        UntypedToken(token)
        return True  # 유효한 토큰
    except (InvalidToken, TokenError):
        return False  # 유효하지 않은 토큰


def UpdateToken(request, refresh_token):
    UntypedToken(refresh_token)
    refresh = RefreshToken(refresh_token)
    refresh.blacklist()
    username = request.session.get('api_id')
    user, created = User.objects.get_or_create(username=username)
    if created:
        user.save()
    new_refresh_token = RefreshToken.for_user(user)
    new_access_token = str(new_refresh_token.access_token)
    refresh_token = str(new_refresh_token)
    return new_access_token, refresh_token


class LoginCheckView(View):
    def get(self, request):
        try:
            access_token = request.COOKIES.get('access_token')
            if not access_token:
                return JsonResponse({'status': 'No tokens'}, status=401)
            UntypedToken(access_token)
            return JsonResponse({'status': 'Fine'}, status=200)
        except (InvalidToken, TokenError) as e:
            return JsonResponse({'status': 'Token expired'}, status=401)
        except Exception as e:
            return JsonResponse({'status': 'Unknown error'}, status=401)


class LogoutView(View):
    def get(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return redirect(settings.API_URL)
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
            response = redirect(settings.HOME_URL)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token', path='/api/login')
            response.delete_cookie('sessionid')
            request.session.delete()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        return response


class RefreshView(View):
    def get(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return redirect(settings.API_URL)
            new_access_token, new_refresh_token = UpdateToken(request, refresh_token)
            # prev = request.session.get('previous_url')
            # response = redirect(prev)
            response = JsonResponse({'message': 'Fine'}, status=200)
            response.set_cookie('access_token', new_access_token, httponly=True, samesite='Lax')
            response.set_cookie('refresh_token', new_refresh_token, httponly=True, samesite='Lax', path='/api/login')
        except (InvalidToken, TokenError) as e:
            # return redirect(settings.API_URL)
            return JsonResponse({'message': 'Invalid Token'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return response


class ApiLoginView(View):
    def get(self, request):
        return redirect(settings.API_URL)


class CallbackView(View):
    def send_test_email(self, recipient, request):
        random_number = int.from_bytes(os.urandom(3), 'big') % 1000000
        html_content = render_to_string('mailform.html', {
            'user_name': request.session.get('api_nick'),
            'verification_code': f'{random_number:06}',
            'app_name': '민지 하니 다니엘 해린 혜인 and 럭키성윤',
        })
        send_mail(
            '[민지 하니 다니엘 해린 혜인 and 럭키성윤] 인증번호 안내',
            strip_tags(html_content),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient]
        )
        request.session['OTP'] = f'{random_number:06}'

    def get_api_data(self, client_id, client_secret, code, redirect_uri):
        token_url = "https://api.intra.42.fr/oauth/token"
        data = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': redirect_uri
        }
        token_response = requests.post(token_url, data=data)
        if token_response.status_code == 200:
            data_url = settings.API_HOST + '/v2/me'
            headers = {
                "Authorization": f"Bearer {token_response.json()['access_token']}"
            }
            data_response = requests.get(data_url, headers=headers)
            if data_response.status_code == 200:
                return data_response.json()
            else:
                raise Exception(f"Failed to get data: {data_response.status_code} - {data_response.text}")
        else:
            raise Exception(f"Failed to get access token: {token_response.status_code} - {token_response.text}")

    def get(self, request):
        try:
            code = request.GET.get('code')
            client_id = settings.CLIENT_ID
            client_secret = settings.CLIENT_SECRET
            redirect_uri = settings.REDIRECT_URL
            data_response = self.get_api_data(client_id, client_secret, code, redirect_uri)
            request.session['api_id'] = data_response['id']
            request.session['api_nick'] = data_response['login']
            user_list = Userdb.objects.filter(user_id=data_response['id'])
            if user_list.count():
                user_instance = user_list[0]
                print(user_instance, file=sys.stderr)
                if not user_instance.use_2fa:
                    user, created = User.objects.get_or_create(username=data_response['login'])
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    refresh_token = str(refresh)
                    response = redirect(f'https://{settings.SERVER_IP}/user/{data_response["id"]}')
                    response.set_cookie('access_token', access_token, httponly=True, samesite='Lax')
                    response.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Lax', path='/api/login')
                    return response
            self.send_test_email(data_response['email'], request)
            response = redirect(f'https://{settings.SERVER_IP}/twofa')
            session_id = request.COOKIES.get('sessionid')
            response.set_cookie('sessionid', session_id, max_age=1209600, path='/', httponly=True, samesite='Lax')
            return response
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class SecondAuthView(View):
    def get(self, request):
        try:
            code = request.GET.get('code')
            user_id = request.session.get('api_id')
            user_nickname = request.session.get('api_nick')
            ans = request.session.get('OTP')
            if str(code) == str(ans):
                user, created = User.objects.get_or_create(username=user_nickname)
                if created:
                    user.save()
                if Userdb.objects.filter(user_id=user_id).count() == 0:
                    with open('user/profile_images/default.png', 'rb') as file:
                        file_data = file.read()
                    sub_nick = 0
                    tmp_str = user_nickname
                    while Userdb.objects.filter(nickname=tmp_str).count() != 0:
                        sub_nick += 1
                        tmp_str = user_nickname + '_' + str(sub_nick)
                    user_nickname = tmp_str
                    uploaded_file = SimpleUploadedFile('default.png', file_data, content_type='image/jpeg')
                    target_data = {
                        'user_id': user_id,
                        'nickname': user_nickname,
                        'profile_image': uploaded_file,
                        'status': True,
                    }
                    serializer = UserdbSerializer(data=target_data)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        raise ValueError('Serializer data is not valid.')
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                response = JsonResponse({'id': user_id}, status=200)
                response.set_cookie('access_token', access_token, httponly=True, samesite='Lax')
                response.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Lax', path='/api/login')
            else:
                response = JsonResponse({'error': '2fa auth failed'}, status=401)
            return response
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
