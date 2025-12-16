import { RequestHandler } from 'express';

import CustomError from './../util/custom-error.util';

import logger from './../util/logger.util';
import IsValidLocation from './../util/location-validation.util';

import WeatherService from './../services/weather.service';

export default class WeatherController {
  
  private weatherService = WeatherService.getInstance();
  private isValidLocation = IsValidLocation.getInstance();

  public getWeatherData: RequestHandler = async (req, res) => {
    const location = req.params.location;
  
    if (!this.isValidLocation.validateLocation(location)) {      
      throw new CustomError(404, 'Invalid location name!');
    }

    const { fromCache, data } = await this.weatherService.getWeather(location);

    if (fromCache) {
      logger.info(`Returning cached weather data for: ${location}`);
    } else {
      logger.info(`Fetched new weather data for: ${location}`);
    }

    res.status(200).json(data);
  }

  public getWeatherByCoords: RequestHandler = async (req, res) => {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    
    if (isNaN(lat) || isNaN(lon)) {
      throw new CustomError(400, 'Latitude and longitude must be valid numbers');
    }

    const { fromCache, data } = await this.weatherService.getWeatherByCoordinates(lat, lon);

    if (fromCache) {
      logger.info(`Returning cached weather data for coordinates: ${lat}, ${lon}`);
    } else {
      logger.info(`Fetched new weather data for coordinates: ${lat}, ${lon}`);
    } 
    
    res.status(200).json(data);
  }

}
