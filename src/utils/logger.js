const { createLogger, format, transports } = require('winston');
const path = require('path');

// Custom log formatting
const logFormat = format.printf(info => `${info.timestamp} - ${info.level} [${info.label}]: ${info.message}`);

/**
 * Create a new logger
 * @type {Logger}
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [ 
    // Logging to console
    new transports.Console({ 
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    // Logging info and up to file
    new transports.File({ 
      filename: path.join(__basedir, 'logs/full.log'), 
      level: 'info',
      format: logFormat,
      options: { flags: 'w' } 
    }),
    // Logging only errors to file
    new transports.File({ 
      filename: path.join(__basedir, 'logs/error.log'),
      level: 'error',
      format: logFormat,
      options: { flags: 'w' } 
    })
  ]
});

module.exports = logger;