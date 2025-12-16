import { Router } from 'express';

import AuthRouter from './auth.router';
import UserRouter from './user.router';
import WeatherRouter from './weather.router';
import NewsRouter from './news.router';

const MainRouter = Router();

MainRouter.use('/api/auth', AuthRouter);

MainRouter.use('/api/user', UserRouter);

MainRouter.use('/api/weather', WeatherRouter);

MainRouter.use('/api/news', NewsRouter);

export default MainRouter;
