from django.db import models
from django.contrib.auth.models import User

class UploadFile(models.Model):
    user = models.ForeignKey(User)
    file = models.FileField(upload_to='files/')