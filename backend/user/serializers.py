from rest_framework import serializers
from .models import Userdb, Friends


class UserdbSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(use_url=True)

    class Meta:
        model = Userdb
        fields = ('user_id', 'nickname', 'profile_image', 'status')

class FriendsSerializer(serializers.ModelSerializer):
    user = UserdbSerializer()
    friend = UserdbSerializer()

    class Meta:
        model = Friends
        fields = ('user', 'friend')
