from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'images', views.ImageViewSet, basename='images')
router.register(r'authors', views.AuthorViewSet, basename='authors')

urlpatterns = [
    path('', include(router.urls)),
    path('', views.index, name='index'),
    path('setup', views.setup, name='setup'),
    path('similar/<int:img_index>/<int:num>/', views.similar, name='similar'),
    path('author/<int:author_pk>', views.show_autor, name='show_author'),
]