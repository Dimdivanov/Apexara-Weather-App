import { Router } from "express";

import CatchUntil from './../util/catch.util';

import NewsController from "./../controllers/news.controller";

const useCatch = CatchUntil.getUseCatch();
const newsController = new NewsController();

const NewsRouter = Router();

NewsRouter.get('/', useCatch(newsController.getNewsData));

export default NewsRouter;
