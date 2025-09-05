import * as winston from 'winston';

export class Logger {
  private logger: winston.Logger;

  constructor(private context?: string) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const ctx = context || this.context || 'Application';
          return `${timestamp} [${ctx}] ${level}: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message, { context: this.context });
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { context: this.context, trace });
  }

  warn(message: string) {
    this.logger.warn(message, { context: this.context });
  }

  debug(message: string) {
    this.logger.debug(message, { context: this.context });
  }

  verbose(message: string) {
    this.logger.verbose(message, { context: this.context });
  }
}
