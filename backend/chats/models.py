from django.db import models
from django.contrib.auth.models import AbstractUser
from .Managers import UserManager

# Create your models here.


class User(AbstractUser):
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=250, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=10, unique=True, null=True, blank=True)

    objects = UserManager()

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender', null=True, blank=True)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reciever',null=True, blank=True)
    thread_name = models.CharField(max_length=200, null=True, blank=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}-{self.thread_name}' if self.sender else f'{self.message}-{self.thread_name}'
