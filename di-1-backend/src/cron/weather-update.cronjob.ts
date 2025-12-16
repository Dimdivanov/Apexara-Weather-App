import cron from 'node-cron';
import mongoose from 'mongoose';

import logger from './../util/logger.util';

import WeatherDataLayer from './../data-layers/weather.data-layer';

import Config from '../config';
 
export default class WeatherCronJob {

  private static instance: WeatherCronJob;
  private weatherDataLayer = WeatherDataLayer.getInstance();

  private constructor() {
    const config = Config.getInstance();
    
    mongoose.connect(config.mongoUri);

    cron.schedule('0 * * * *', this.fetchingData.bind(this), {scheduled: true, timezone: 'Europe/London'}); 
  }

  private async fetchingData(): Promise<void> {
    try {
      const locations: string[] = await this.weatherDataLayer.getAll();

      if (locations.length <= 0) {
        return logger.info('No data to update');
      }

      for (const location of locations) {
        try {
          await this.weatherDataLayer.get(location);
        } catch (err) {
          logger.error(`Failed to update weather for ${location}: ${err}`);
        }
      }
    } catch (err) {
      logger.error(`This is the cron Error: ${err}`);
    }
  }

  public static getInstance(): WeatherCronJob {
    if (!WeatherCronJob.instance) {
      WeatherCronJob.instance = new WeatherCronJob();
    }
    
    return WeatherCronJob.instance;
  }

}
