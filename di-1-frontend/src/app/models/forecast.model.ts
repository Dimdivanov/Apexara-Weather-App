export interface WeatherDashboardData {
  locationName: string;        
  country: string;             
  currentWeather: CurrentWeather;
  dailyWeather: ForecastDetails[];
  hourlyWeather: HourlyWeather[];
  lat: number;
  lon: number;
  timezone: string;
  airPollution: AirPollution;
}

interface AirPollution {
  aqi: number;
}

interface Weather {
  id: number;
  icon: string;
  main: string;
  description: string;
}

interface FeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

interface Temperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface CurrentWeather {
  dt: number;           
  temp: number;           
  feelsLike: number;         
  min: number;               
  max: number;               
  humidity: number;
  dewPoint: number;
  uvi: number;            
  pressure: number;            
  visibility: number;          
  windSpeed: number;
  windDeg: number;
  windGust: number;           
  clouds: number;              
  sunrise: number;             
  sunset: number;              
  weather: Weather;
  rain1h: {
    '1h': number;
  };
}

export interface HourlyWeather {
  dt: string;
  temp: number;
  pressure: number;
  uvi: number;
  dewPoint: number;
  clouds: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
  windSpeed: number;
  windDeg: number;
  windGust: number;
  visibility: number;
  pop: number;
  humidity: number;
  rain1h: number;
  weather: Weather;
}

export interface ForecastDetails {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moonPhase: number;
  temp: Temperature;
  tempCurrent: number;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windDeg: number;
  windGust: number;
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
  weather: Weather;
  hourlyDetails: HourlyWeather[];
}

export interface FavoriteCity {
  name: string;
  icon: string;
  temp: number;
  description: string;
}

export interface GeoLocationCoordinates {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
}

export interface GeoLocationPosition {
  coords: GeoLocationCoordinates;
  timestamp: number;
}

export interface GeolocationPositionError {
  code: number;
  message: string;
}
