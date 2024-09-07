# from django.core.files.storage import FileSystemStorage
#
#
# class OverwriteStorage(FileSystemStorage):
#     def get_available_name(self, name, max_length=None):
#         # 같은 이름의 파일이 있을 경우 기존 파일을 삭제
#         if self.exists(name):
#             self.delete(name)
#         return name
