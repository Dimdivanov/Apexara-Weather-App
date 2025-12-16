import mongoose, { Document }  from 'mongoose';
//global types 
export interface AirPollutionDataModel {
  list: {
    main: { aqi: number }
  }[]
}
export interface AirPollution {
  aqi: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Temperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

interface FeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

interface BaseWeather {
  dt: number;
  temp: Temperature;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  dewPoint: number;
  uvi: number;
  clouds: number;
  windSpeed: number;
  windDeg: number;
  windGust: number;
  weather: WeatherCondition;
}

export interface GeoData {
  locationName: string;
  country: string;
  lat: number;
  lon: number;
}

export interface GeoDataLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface RawWeatherApiResponse extends GeoData{
  timezone: string;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: Temperature;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    rain: number;
    weather: WeatherCondition[];
  };
  hourly: {
    dt: number;
    temp: Temperature;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    pop: number;
    rain?: {
      '1h'?: number;
    };
    weather: WeatherCondition[];
    airPollution: AirPollution;
  }[];
  daily: {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: Temperature;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    visibility: number;
    clouds: number;
    pop: number;
    rain: number;
    uvi: number;
    weather: WeatherCondition[];
  }[];
}

export interface RawWeatherUpdate extends GeoData {
  timezone: string;
  currentWeather: Current;
  hourlyWeather: Hour[];
  dailyWeather: DailyWeather[];
  airPollution: AirPollution;
}

export interface Current extends BaseWeather {
  sunrise: number;
  sunset: number;
  visibility: number;
  rain1h: number;
}

export interface Hour extends BaseWeather {
  visibility: number;
  pop: number;
  rain1h: number;
}

export interface Day extends BaseWeather {
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moonPhase: number;
  visibility: number;
  pop: number;
  rain: number;
}
//types for mongoose schemas
export interface CurrentWeather extends BaseWeather {
  locationName: string;
  country: string;
  sunrise: number;
  sunset: number;
  visibility: number;
  rain1h: number;
}

export interface HourlyWeather extends BaseWeather{
  visibility: number;
  pop: number;
  rain1h: number;
}

export interface DailyWeather extends BaseWeather{
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moonPhase: number;
  pop: number;
  rain: number;
}

export interface WeatherDashboard extends Document, GeoData {
  timestamp: number;
  timezone: string;
  currentWeather: CurrentWeather;
  hourlyWeather: HourlyWeather[];
  dailyWeather: DailyWeather[];
  airPollution: AirPollution;
  createdAt: Date;
  updatedAt: Date;
}
//schema models
const TempSchema = new mongoose.Schema({
  day: Number,
  min: Number,
  max: Number,
  night: Number,
  eve: Number,
  morn: Number,
},
{ 
  _id: false,
});

const FeelsLikeSchema = new mongoose.Schema({
  day: Number,
  night: Number,
  eve: Number,
  morn: Number,
},
{ 
  _id: false,
});

const WeatherConditionSchema = new mongoose.Schema<WeatherCondition>({
  id: { 
    type: Number, 
    required: true, 
  },
  main: { 
    type: String, 
    required: true,
  },
  description: { 
    type: String, 
    required: true,
  },
  icon: { 
    type: String, 
    required: true,
  },
}, 
{ 
  _id: false,
});

const CommonWeatherData = {
  dt: {
    type: Number,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  feels_like: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  dewPoint: {
    type: Number,
    required: true,
  },
  uvi: {
    type: Number,
    required: true,
  },
  clouds: {
    type: Number,
    required: true,
  },
  visibility: {
    type: Number,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
  windDeg: {
    type: Number,
    required: true,
  },
  windGust: {
    type: Number,
    required: true,
    default: 0,
  },
};

const CommonSunData = {
  sunrise: {
    type: Number,
    required: true,
  },
  sunset: {
    type: Number,
    required: true,
  },
};

const CurrentWeatherSchema = new mongoose.Schema<CurrentWeather>({
  ...CommonWeatherData,
  ...CommonSunData,
  rain1h: { 
    type: Number, 
    required: true,
    default: 0,
  },
  weather: {
    type: WeatherConditionSchema,
    required: true,
  },
},
{ 
  _id: false,
});

const HourlyWeatherSchema = new mongoose.Schema<HourlyWeather>({
  ...CommonWeatherData,
  pop: { 
    type: Number, 
    required: true,
  },
  rain1h: { 
    type: Number, 
    required: true,
    default: 0,
  },
  weather: {
    type: WeatherConditionSchema,
    required: true,
  },
},
{ 
  _id: false, 
});

const DailyWeatherSchema = new mongoose.Schema<DailyWeather>({
  ...CommonSunData,
  dt: { 
    type: Number, 
    required: true, 
  },
  moonrise: { 
    type: Number, 
    required: true,
  },
  moonset: { 
    type: Number, 
    required: true, 
  },
  moonPhase: { 
    type: Number, 
    required: true, 
  },
  temp: { 
    type: TempSchema, 
    required: true, 
  },
  feels_like: { 
    type: FeelsLikeSchema, 
    required: true,
  },
  pressure: { 
    type: Number, 
    required: true,
  },
  humidity: { 
    type: Number, 
    required: true,
  },
  dewPoint: { 
    type: Number, 
    required: true,
  },
  windSpeed: { 
    type: Number, 
    required: true,
  },
  windDeg: { 
    type: Number, 
    required: true,
  },
  windGust: { 
    type: Number, 
    required: true,
  },
  clouds: { 
    type: Number, 
    required: true,
  },
  pop: { 
    type: Number, 
    required: true,
  },
  rain: { 
    type: Number, 
    required: true,
  },
  uvi: { 
    type: Number, 
    required: true,
  },
  weather: {
    type: WeatherConditionSchema,
    required: true,
  },
}, 
{ 
  _id: false, 
});

const AirPollutionSchema = new mongoose.Schema<AirPollution>({
  aqi: {
    type: Number,
    required: true, 
  },
}, 
{ 
  _id: false, 
});

const WeatherDashboardSchema = new mongoose.Schema<WeatherDashboard>({
  timestamp: {
    type: Number,
    required: true,
  },
  locationName: { 
    type: String, 
    trim: true,
    lowercase: true,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  lat: { 
    type: Number, 
    required: true,
  },
  lon: { 
    type: Number, 
    required: true,
  },
  timezone: { 
    type: String, 
    required: true,
  },
  currentWeather: { 
    type: CurrentWeatherSchema, 
    required: true,
  },
  hourlyWeather: { 
    type: [HourlyWeatherSchema], 
    required: true,
  },
  dailyWeather: { 
    type: [DailyWeatherSchema], 
    required: true,
  },
  airPollution: {
    type: AirPollutionSchema,
    required: true,
  },
}, 
{ 
  timestamps: true,
});

WeatherDashboardSchema.index({ locationName: 1 });

export const WeatherDashboardModel = mongoose.model('WeatherDashboard', WeatherDashboardSchema, 'weather-data');
