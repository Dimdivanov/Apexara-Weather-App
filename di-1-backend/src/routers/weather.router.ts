import { Router } from 'express';

import CatchUntil from './../util/catch.util';

import WeatherController from './../controllers/weather.controller';

const useCatch = CatchUntil.getUseCatch();
const weatherController = new WeatherController();

const WeatherRouter = Router();

WeatherRouter.get('/coords', useCatch(weatherController.getWeatherByCoords));

WeatherRouter.get('/:location', useCatch(weatherController.getWeatherData));

export default WeatherRouter;
