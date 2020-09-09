from django.db import models
from tagging.registry import register


class Author(models.Model):
    author_name = models.CharField(max_length=200, unique=True)
    class Meta:
        ordering = ['author_name']

class Image(models.Model):
    image_id = models.IntegerField()
    file_name = models.CharField(max_length=200, unique=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

register(Image)
