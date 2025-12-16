import { GeoData, RawWeatherApiResponse, RawWeatherUpdate, Current, Hour, Day, GeoDataLocation, AirPollution, AirPollutionDataModel } from './../models/weather.model';

import WeatherDataLayer from './../data-layers/weather.data-layer';

import Config from './../config';

export default class WeatherService {
  
  private config = Config.getInstance();
  private weatherDataLayer = WeatherDataLayer.getInstance();

  public async getWeather(location: string) {
    const now = Date.now();
    
    const cachedData = await this.weatherDataLayer.get(location);
    
    if (cachedData && (now - cachedData.updatedAt.getTime())< this.config.database.CACHE_DURATION_MS) {
      return { fromCache: true, data: cachedData };
    }

    const formattedWeather = await this.getFormattedWeather(location);

    const updateData = await this.weatherDataLayer.update(location, formattedWeather);

    return { fromCache: false, data: updateData };
  }

  public async getWeatherByCoordinates (lat: number, lon: number) {
    const geoUrl = `${this.config.apiGeoReverse}lat=${lat}&lon=${lon}&limit=1&appid=${this.config.apiKey}`;
    
    const geoRes = await fetch(geoUrl);

    if (!geoRes.ok) { 
      throw new Error (`Geo API failed with status: ${geoRes.status}`);
    }

    const geoData = (await geoRes.json()) as GeoDataLocation[];

    if (!geoData.length ) {
      throw new Error (`No city found for coordinates: ${lat}, ${lon}`);
    }

    const city = geoData[0].name;
      
    return this.getWeather(city);
  }

  public async getFormattedWeather(location: string) {
    const geoUrl = `${this.config.apiGeo}q=${encodeURIComponent(location)}&limit=1&appid=${this.config.apiKey}`;

    const geoRes = await fetch(geoUrl);
    
    if (!geoRes.ok) {
      throw new Error(`Geo API request failed with status: ${geoRes.status}`);
    }
  
    const geoData = (await geoRes.json()) as GeoData[];
    
    if (!geoData.length) {
      throw new Error(`City '${location}' not found`);
    }
    
    const { lat, lon } = geoData[0];
  
    const apiUrl = `${this.config.apiUrlCurrent}lat=${lat}&lon=${lon}&units=metric&appid=${this.config.apiKey}`;

    const currentRes = await fetch(apiUrl);
  
    if (!currentRes.ok) {
      throw new Error(`API request failed with status: ${currentRes.status}!`);
    }
    
    const airPollution_apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.config.apiKey}`

    const airPollutionRes = await fetch(airPollution_apiUrl);

    if (!airPollutionRes.ok) {
      throw new Error(`API Air Pollution request failed with status: ${currentRes.status}!`);
    }

    const airPollutionApiData = await airPollutionRes.json() as AirPollutionDataModel;

    const airPollutionData: AirPollution = {
      aqi: airPollutionApiData.list[0].main.aqi
    };

    const newDataWeather = await currentRes.json() as RawWeatherApiResponse;
    
    const weatherUpdate: RawWeatherUpdate = {
      locationName: location,
      lat,
      lon,
      timezone: newDataWeather.timezone,
      country: geoData[0].country,
      currentWeather: {
        dt: newDataWeather.current.dt * 1000,
        sunrise: newDataWeather.current.sunrise,
        sunset: newDataWeather.current.sunset,
        temp: newDataWeather.current.temp,
        feels_like: newDataWeather.current.feels_like,
        pressure: newDataWeather.current.pressure,
        humidity: newDataWeather.current.humidity,
        dewPoint: newDataWeather.current.dew_point,
        uvi: Math.round(newDataWeather.current.uvi),
        clouds: newDataWeather.current.clouds,
        visibility: newDataWeather.current.visibility / 1000,
        windSpeed: newDataWeather.current.wind_speed,
        windDeg: newDataWeather.current.wind_deg,
        windGust: newDataWeather.current.wind_gust ?? 0,
        weather: newDataWeather.current.weather[0],
      } as Current,
      hourlyWeather: newDataWeather.hourly.map((hour): Hour => ({
        dt: hour.dt * 1000,
        temp: hour.temp,
        feels_like: hour.feels_like,
        pressure: hour.pressure,
        humidity: hour.humidity,
        dewPoint: hour.dew_point,
        uvi: Math.round(hour.uvi),
        clouds: hour.clouds,
        visibility: hour.visibility,
        windSpeed: hour.wind_speed,
        windDeg: hour.wind_deg,
        windGust: hour.wind_gust ?? 0,
        weather: hour.weather[0],
        pop: hour.pop ?? 0,
        rain1h: hour.rain?.['1h'] ?? 0,
      })),
      dailyWeather: newDataWeather.daily.map((day): Day => ({
        dt: day.dt * 1000,
        sunrise: day.sunrise,
        sunset: day.sunset,
        moonrise: day.moonrise,
        moonset: day.moonset,
        moonPhase: day.moon_phase,
        temp: day.temp,
        feels_like: day.feels_like,
        pressure: day.pressure,
        humidity: day.humidity,
        dewPoint: day.dew_point,
        windSpeed: day.wind_speed,
        windDeg: day.wind_deg,
        windGust: day.wind_gust ?? 0,
        clouds: day.clouds,
        visibility: day.visibility,
        pop: day.pop,
        rain: day.rain ?? 0,
        uvi: Math.round(day.uvi),
        weather: day.weather[0],
      })),
      airPollution: airPollutionData,
    };
    
    return weatherUpdate;
  }

  private static instance: WeatherService;

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }

    return WeatherService.instance;
  }

}
