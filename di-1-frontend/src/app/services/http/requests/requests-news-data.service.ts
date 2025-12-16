import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NewsDataModel } from './../../../models/news.model';

import { env } from './../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})

export class RequestsNewsDataService {

  constructor(
    private http: HttpClient) { }

  public fetchNewsData(onSuccess: (data: NewsDataModel) => void, onError: () => void): void {
    const newsApiUrl = `${env.apiUrl}${env.endpoints.news.all}`;
    
    this.http.get<NewsDataModel>(newsApiUrl).subscribe({
      next: data => {
        onSuccess(data);
      },
      error: err => {
        console.error('Error fetching news data', err);
        onError();
      }
    });
  }

}
