import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SimilarImagesComponent} from './similar-images/similar-images.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'similar', component: SimilarImagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
