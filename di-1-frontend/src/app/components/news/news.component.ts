import { Component } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

import { NewsDataService } from './../../services/news-data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [
    SkeletonModule,
  ],
})

export class NewsComponent {

  constructor(
    public newsService: NewsDataService) { }
    
}
