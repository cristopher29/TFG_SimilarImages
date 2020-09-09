from flask import Flask
from flask_restful import Resource, Api
from annoy import AnnoyIndex
import numpy as np
import pandas as pd
import json

app = Flask(__name__)
api = Api(app)

t_all = AnnoyIndex(4096+599, metric='euclidean')
t_all.load('db.annoy')

df = pd.read_pickle('vgg_sift_exposure_sobel.pkl')
df.head()


class GetSilimar(Resource):
    def get(self, img_index, num):

        similar_img_ids_all = t_all.get_nns_by_item(int(img_index), int(num) + 1)
        orinal_img = df.iloc[similar_img_ids_all[0]].copy()
        similars_all = df.iloc[similar_img_ids_all[1:]].copy()
        similar = similars_all.sort_values(by=['similarity'], ascending=False)
        col_names = ['id', 'autor', 'filename', 'tag']
        result_df = pd.DataFrame(columns=col_names)
        i = 0
        for index, row in similar.iterrows():
            result_df.loc[i, 'id'] = index
            result_df.loc[i, 'tag'] = row['tag']
            result_df.loc[i, 'autor'] = row['autor']
            result_df.loc[i, 'filename'] = row['filepath']
            i += 1

        out = result_df.to_dict('index')
        return out

api.add_resource(GetSilimar, '/similar/<img_index>/<num>')

if __name__ == '__main__':
 app.run(debug=True)