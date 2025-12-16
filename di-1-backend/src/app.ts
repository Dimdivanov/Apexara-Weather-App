import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

import logger from './util/logger.util';

import MainRouter from './routers/main.router';

import WeatherCronJob from './cron/weather-update.cronjob';

import ErrorMiddleware from './middleware/error.middleware';

import Config from './config';

const app = express();
const config = Config.getInstance();

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));
app.use(json());
app.use(cookieParser());
app.use(MainRouter);
app.use(new ErrorMiddleware().init);

app.listen(config.server.port, () => {
  logger.info(`My app listening on port ${config.server.port}`);
});

mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('Db connected');
    
    WeatherCronJob.getInstance();
  })
  .catch(err => { logger.error(err, `Db connection Error: ${err}`) });

mongoose.connection.on('error', err => logger.error(err, `DB Connection Error: ${err}`));
