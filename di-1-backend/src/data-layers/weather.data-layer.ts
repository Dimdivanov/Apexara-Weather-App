import CustomError from './../util/custom-error.util';

import { WeatherDashboardModel, RawWeatherUpdate, WeatherDashboard } from './../models/weather.model';

export default class WeatherDataLayer {

  public async get(location: string): Promise<WeatherDashboard | null>{
    const weatherData = await WeatherDashboardModel.findOne({ locationName: location })
      .catch(err => {
        throw new CustomError(500, err.message);
      });
    
    return weatherData;
  }
  
  public async update(location: string, formattedWeatherData: RawWeatherUpdate): Promise<WeatherDashboard> {
    const updatedWeather = await WeatherDashboardModel.findOneAndUpdate({ locationName: location }, formattedWeatherData, { new: true, upsert: true }) 
      .catch(err => {
        throw new CustomError(500, err.message);
      });
      
    return updatedWeather;
  }

  public async getAll(): Promise<string[]> {
    const cities = await WeatherDashboardModel.distinct('locationName')
      .catch(err => {
        throw new CustomError(500, err.message);
      });
    
    if (!cities) {
      throw new CustomError(404, 'No weather locations found!');
    }

    return cities;
  }

  private static instance: WeatherDataLayer;

  public static getInstance(): WeatherDataLayer {
    if (!WeatherDataLayer.instance) {
      WeatherDataLayer.instance = new WeatherDataLayer();
    }

    return WeatherDataLayer.instance;
  }

}
