export default class Config {

  public server = {
    port: process.env.PORT,
  };

  public database = {
    CACHE_DURATION_MS: 60 * 60 * 1000,
  };
  
  public jwt = {
    accessExpireTime: 60 * 60 * 24 * 7,
    accessSecret: process.env.JWT_ACCESS_SECRET || 'notSoSecret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'notSoRefreshed',
  }
  
  public apiKey = process.env.API_KEY || '';
  public mongoUri = process.env.MONGO_URI || '';
  public apiKeyNews = process.env.API_KEY_NEWS || '';
  public apiGeo = process.env.API_GEO || 'https://api.openweathermap.org/geo/1.0/direct?';
  public apiGeoReverse = process.env.API_GEO_REVERSE || 'https://api.openweathermap.org/geo/1.0/reverse?';
  public apiUrlCurrent = process.env.API_URL_CURRENT || 'https://api.openweathermap.org/data/3.0/onecall?';
  public airPollution = process.env.API_AIR_POLLUTION || 'http://api.openweathermap.org/data/2.5/air_pollution?';
  public newsData = process.env.API_NEWS_URL || 'https://newsapi.org/v2/top-headlines?';

  private static instance: Config;
  
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    
    return Config.instance;
  };

}
