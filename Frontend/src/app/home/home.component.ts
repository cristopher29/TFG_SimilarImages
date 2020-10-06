import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  authors: any = [];
  authorImages: any = [];
  authorSearch = '';
  currentAuthor = '';
  totalAuthors = 0;
  itemsPerPage = 10;
  page = null;
  selectedIndex: number = null;
  isBack = false;

  constructor(private apiService: ApiService, private router: Router) { }

  public ngOnInit(): void {
    this.page = 1;
    if (history.state.page){
      this.page = history.state.page;
      this.isBack = true;
    }
    this.apiService.authorsPage(this.page, '').subscribe(value => {
      this.authors = value.results;
      this.totalAuthors = value.total;
      this.page = value.page;
      this.selectedIndex = history.state.index ? history.state.index : 0;
      this.showImages(this.authors[this.selectedIndex], this.selectedIndex);
    });
  }

  onKey(event: any) {
    this.selectedIndex = null;
    this.authorSearch = event.target.value;
    if (this.authorSearch === '') {
      this.apiService.authorsPage(1, '').subscribe(value => {
        this.authors = value.results;
        this.totalAuthors = value.total;
        this.page = value.page;
      });
    }else{
      this.apiService.searchAuthor(this.authorSearch).subscribe(value => {
        this.authors = value.results;
        this.totalAuthors = value.total;
        this.page = value.page;
      });
    }
  }

  public showImages(author, index): void {
    this.currentAuthor = author.author_name;
    this.authorImages = author.image;
    this.selectedIndex = index;
    console.log(this.currentAuthor, this.authorImages, this.selectedIndex);
  }


  loadPage(page: number) {
    if (this.isBack){
      this.isBack = false;
    }else{
      this.selectedIndex = null;
      if (this.authorSearch === '') {
        this.apiService.authorsPage(page, '').subscribe(value => {
          this.authors = value.results;
          this.totalAuthors = value.total;
          this.page = page;
        });
      } else {
        this.apiService.authorsPage(page, this.authorSearch).subscribe(value => {
          this.authors = value.results;
          this.totalAuthors = value.total;
          this.page = page;
        });
      }
    }

  }

}
