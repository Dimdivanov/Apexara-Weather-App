import { effect, Injectable, signal } from '@angular/core';

import { NewsDataModel } from './../models/news.model';

import { RequestsNewsDataService } from '././http/requests/requests-news-data.service';

@Injectable({
  providedIn: 'root'
})

export class NewsDataService {

  constructor(
    private requestNewsData: RequestsNewsDataService) {

    effect(() => {
      this.getNewsData();
    });
  }

  public newsData = signal<NewsDataModel | null>(null);
  
  public getNewsData(): void {
    this.requestNewsData.fetchNewsData(
      this.handleNewsDataSuccess,
      
      this.handleNewsDataError,
    );
  }

  private handleNewsDataSuccess = (data: NewsDataModel): void => {
    this.newsData.set(data);
  };

  private handleNewsDataError = (): void => {
    this.newsData.set(null);
  };

}
