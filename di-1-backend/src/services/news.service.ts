import { NewsDataModel } from "./../models/news.model";

import Config from "./../config";


export default class NewsDataService {

  private config = Config.getInstance();
  
  public async getNewsData() {
    const newsUrl = `${this.config.newsData}category=general&apiKey=${this.config.apiKeyNews}`;
    
    const newsResponse = await fetch(newsUrl);

    if (!newsResponse.ok) {
      throw new Error(`News API request failed with status ${newsResponse.status}`);
    }
    
    const newsData = (await newsResponse.json()) as NewsDataModel;

    if (!newsData.articles || !newsData.articles.length) {
      throw new Error(`No articles found!`);
    }
    
    return newsData;
  }

  private static instance: NewsDataService;

  public static getInstance(): NewsDataService {
    if (!NewsDataService.instance) {
      NewsDataService.instance = new NewsDataService();
    }

    return NewsDataService.instance;
  }

}
