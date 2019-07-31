import winston, { createLogger } from 'winston'
import path from 'path'

const options = {
  file: {
    level: 'info',
    filename: path.join(__dirname, "/../../logs/app.log"),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: String(process.env.NODE_ENV) === 'production' ? 'error' : 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: () => new Date().toLocaleTimeString(),
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
}

const logger = createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false,
})

logger.info(`Enviroment -> ${process.env.NODE_ENV}`)
if (String(process.env.NODE_ENV) !== 'production') {
  logger.debug('Logging initialized at debug level');
}


logger.stream = <any>{
  write: function (message: string, encoding: any) {
    logger.info(message);
  }
}

export default logger