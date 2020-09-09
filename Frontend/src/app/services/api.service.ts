import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authorsEndpoint = 'https://frozen-plains-74809.herokuapp.com/authors/';
  private imagesEndpoint = 'https://frozen-plains-74809.herokuapp.com/images/';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private httpClient: HttpClient) { }

  similarImages(data){
    return this.httpClient.post<any>(`${this.imagesEndpoint}similar/`, data, {headers : this.httpHeaders});
  }

  getAuthors(limit: number, offset: number) {
    return this.httpClient.get<any>(`${this.authorsEndpoint}?limit=${limit}&offset=${offset}`, {headers : this.httpHeaders});
  }

  authorsPage(page: number,  author: string) {
    if (author !== '') {
      return this.httpClient.post<any>(`${this.authorsEndpoint}search/?page=${page}`, {name: author},{headers : this.httpHeaders});
    }else{
      return this.httpClient.get<any>(`${this.authorsEndpoint}?page=${page}`, {headers : this.httpHeaders});
    }
  }

  nextAuthors(url: string, author: string) {
    if (author !== '') {
      return this.httpClient.post<any>(url, {name: author}, {headers : this.httpHeaders});
    }else{
      return this.httpClient.get<any>(url, {headers : this.httpHeaders});
    }
  }

  prevAuthors(url: string, author: string) {
    if (author !== '') {
      return this.httpClient.post<any>(url, {name: author}, {headers : this.httpHeaders});
    }else{
      return this.httpClient.get<any>(url, {headers : this.httpHeaders});
    }
  }

  searchAuthor(author: string) {
    return this.httpClient.post<any>(`${this.authorsEndpoint}search/`, {name: author},{headers : this.httpHeaders});
  }

}
