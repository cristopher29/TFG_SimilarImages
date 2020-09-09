import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {ActivatedRoute, Route, Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-similar-images',
  templateUrl: './similar-images.component.html',
  styleUrls: ['./similar-images.component.css']
})
export class SimilarImagesComponent implements OnInit, AfterViewInit {

  tagsList: any = [];
  similarImagesBk: any = [];
  numImages = 5;
  threshold = 1;
  similarImages: any = [];
  currentImageId = 0;
  $grid = null;
  grid = false;
  originalFilename = null;

  constructor(private apiService: ApiService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isotopeApply();
    }, 1000);

  }

  ngOnInit(): void {
    this.tagsList = [];
    // tslint:disable-next-line:radix
    this.originalFilename = history.state.data.file_name;
    this.currentImageId = history.state.data.image_id;
    this.apiService.similarImages({
      id: this.currentImageId,
      threshold: this.threshold / 100,
      num: this.numImages
    }).toPromise().then(value => {
      console.log(value);
      this.similarImages =  value;
      this.similarImagesBk = value;
      this.similarImages.forEach(i => {
        i.tags.forEach(t => {
          this.tagsList.push(t.name);
        });
      });
      this.tagsList = [...new Set(this.tagsList)];
      console.log(this.tagsList);

    });
  }

  public imageTag(image){
    let res = ' ';
    image.tags.forEach(tag => {
      res = res + tag.name + ' ';
    });
    return res;
  }

  public isotopeApply(): void{
      const $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        masonry: {
          columnWidth: 100
        },
      });
      this.$grid = $grid;
      if (!this.grid){
        $('.filter-button-group').on( 'click', 'button', function() {
          const filterValue = $(this).attr('data-filter');
          console.log(filterValue);
          $grid.isotope({
            // item element provided as argument
            filter: filterValue
          });
        });
        this.grid = true;
      }else{
        this.$grid.isotope( 'reloadItems' );
        $('#all-filter').click();
      }
  }

  public applySetting(): void {
    console.log(this.currentImageId);
    this.tagsList = [];
    // tslint:disable-next-line:radix
    this.numImages = parseInt($('#num_images').val());
    this.apiService.similarImages({
      id: this.currentImageId,
      threshold: this.threshold / 100,
      num: this.numImages
    }).subscribe(value => {
      this.similarImagesBk = value;
      this.similarImages = value;
      this.similarImages.forEach(i => {
        i.tags.forEach(t => {
          this.tagsList.push(t.name);
        });
      });
      this.tagsList = [...new Set(this.tagsList)];
      console.log(this.tagsList);
      setTimeout(() => {
        this.isotopeApply();
      }, 1000);
    });
  }


}
