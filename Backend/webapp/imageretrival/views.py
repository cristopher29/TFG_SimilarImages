from django.shortcuts import render
from django.http import HttpResponse
from annoy import AnnoyIndex
import numpy as np
import pandas as pd
from rest_framework.decorators import action
from rest_framework.response import Response
from imageretrival.models import Author, Image
from django.shortcuts import render
from django.core.paginator import Paginator
from scipy import spatial
from rest_framework import viewsets, status

from imageretrival.serializers import ImageSerializer, AuthorSerializer

df = pd.read_pickle('./imageretrival/db_init.pkl')
t_all = AnnoyIndex(1024, metric='euclidean')
t_all.load('./imageretrival/index.annoy')



class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    @action(methods=['POST'], detail=False, url_path="similar", url_name="similar")
    def similar(self, request):
        try:
            image_id = request.data.get('id')
            num = request.data.get('num')

            if image_id is None or num is None:
                raise ValueError

            similar_img_ids_all = t_all.get_nns_by_item(int(image_id), int(num) + 1)

            similars_all = similar_img_ids_all[1:]

            print(similars_all)

            #images_ids = list(similars_all.index)

            q = self.queryset.filter(image_id__in=similars_all)
            objects = dict([(obj.image_id, obj) for obj in q])
            sorted_objects = [objects[id] for id in similars_all]

            serialized_images = ImageSerializer(sorted_objects, many=True)
            return Response(serialized_images.data)

        except ValueError:
            return Response({'error': 'bad format'}, status.HTTP_400_BAD_REQUEST)


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    @action(detail=False, url_path="search", url_name="search", methods=['POST', 'GET'])
    def search(self, request):
        try:
            name = request.data.get('name')
            q = self.queryset.filter(author_name__contains=name)
            page = self.paginate_queryset(q)
            serialized = AuthorSerializer(page, many=True)
            return self.get_paginated_response(serialized.data)
        except ValueError:
            return Response({'error': 'bad format'}, status.HTTP_400_BAD_REQUEST)

def index(request):
    autor_list = Author.objects.all()
    paginator = Paginator(autor_list, 40)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'index.html', {'page_obj': page_obj})


def show_autor(request, author_pk):
    author = Author.objects.get(pk=author_pk)
    images = Image.objects.filter(author=author)
    context = {
        'author': author,
        'images': images
    }
    return render(request, 'author.html', context)

def similar(request, img_index, num):
    similar_img_ids_all = t_all.get_nns_by_item(int(img_index), int(num) + 1)
    orinal_img = df.iloc[similar_img_ids_all[0]].copy()
    similars_all = df.iloc[similar_img_ids_all[1:]].copy()

    col_names = ['similarity']
    result_df = pd.DataFrame(columns=col_names)

    for index, row in similars_all.iterrows():
        similarity = 1 - spatial.distance.cosine(orinal_img['img'], row['img'])
        result_df.loc[index, 'similarity'] = similarity

    print(result_df.index)

    result_df = result_df.sort_values(by=['similarity'], ascending=False)

    images_ids = list(result_df.index)
    result = []
    for id in images_ids:
        image = Image.objects.get(image_id=id)
        result.append(image)

    original = Image.objects.get(file_name=orinal_img['filepath'])
    context = {'similar_imgs': result, 'orignal': original}
    return render(request, 'similar.html', context)

def setup(request):

    for index, row in df.iterrows():
        sc = Author.objects.filter(author_name=row['author'])
        if sc.count() == 0:
            author = Author.objects.create(author_name=row['author'])
            author.save()
        else:
            author = sc.first()
        sc2 = Image.objects.filter(image_id=index)
        if sc2.count() == 0:
            image = Image.objects.create(image_id=index, file_name=row['filename'], author=author)
            tags = ','.join(tag for tag in row['tag'])
            image.tags = tags
            image.save()
        else:
            image = sc2.first()

    return HttpResponse('done')




