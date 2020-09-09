from rest_framework import serializers

from imageretrival.models import Image, Author
from tagging.models import Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']


class AuthorInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['pk', 'author_name']

class ImageSerializer(serializers.ModelSerializer):
    author = AuthorInfoSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Image
        fields = ['pk', 'image_id', 'file_name', 'author', 'tags']


class ImageInfoSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Image
        fields = ['pk', 'image_id', 'file_name', 'tags']

class AuthorSerializer(serializers.ModelSerializer):
    image = ImageInfoSerializer(many=True, read_only=True, source='image_set')
    class Meta:
        model = Author
        fields = ['pk','author_name', 'image']
