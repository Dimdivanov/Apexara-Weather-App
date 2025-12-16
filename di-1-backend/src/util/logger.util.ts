import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty(
  {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname,level',
    messageFormat: '{msg}',
  },
);

const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  stream
);

export default logger;
