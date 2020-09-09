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
  itemsPerPage = 5;
  page = 1;
  selectedIndex: number = null;


  constructor(private apiService: ApiService, private router: Router) { }

  public ngOnInit(): void {
    let tempAuthor = null;
    this.apiService.authorsPage(this.page, '').subscribe(value => {
      this.authors = value.results;
      this.totalAuthors = value.total;
      this.page = value.page;
      tempAuthor = this.showImages(this.authors[0], 0);
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
  }


  loadPage(page: number) {
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
