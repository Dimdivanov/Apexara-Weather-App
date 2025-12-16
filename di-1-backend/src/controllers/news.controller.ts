import { RequestHandler } from 'express';

import CustomError from './../util/custom-error.util';

import NewsDataService from "./../services/news.service";

export default class NewsController {

  private newsService = NewsDataService.getInstance();

  public getNewsData: RequestHandler = async (req, res) => {    
    const newsData = await this.newsService.getNewsData();

    if (!newsData) {
      throw new CustomError(404, 'No data available!')
    } 

    res.status(200).json(newsData);
  };

}