from django.db import models


class Userdb(models.Model):
    user_id = models.CharField(max_length=10)
    nickname = models.CharField(max_length=10)
    profile_image = models.ImageField(default='profile_images/default.png')
    status = models.BooleanField(default=False)


class Friends(models.Model):
    user = models.ForeignKey(Userdb, related_name='friend1', on_delete=models.CASCADE, null=True)
    friend = models.ForeignKey(Userdb, related_name='friend2', on_delete=models.CASCADE, null=True)

    # def save(self, *args, **kwargs):
    #     if self.profile_image and not self._state.adding:
    #         self.profile_image.storage.delete(self.profile_image.name)
    #
    #     if self.profile_image:
    #         file_extension = self.profile_image.name.split('.')[-1]
    #         new_filename = f"profile_images/user_{self.user_id}.{file_extension}"
    #         self.profile_image.name = new_filename
    #         # self.profile_image.storage.save(new_filename, self.profile_image)
    #
    #     super().save(*args, **kwargs)
