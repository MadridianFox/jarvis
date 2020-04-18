const {createLogger, transports, format} = require('winston');
const {combine, timestamp, printf, colorize} = format;

const colorizer = colorize({
    colors: {
        info: 'white',
        debug: 'gray',
        warn: 'yellow',
        error: 'red'
    }
});

let winstonLogger;

/**
 * @param {Boolean} verbose
 */
function configureLogger(verbose) {
    winstonLogger = createLogger({
        level: verbose ? 'debug' : 'info',
        transports: [
            new transports.Console({
                format: printf(({message, level}) => colorizer.colorize(level, message)),
            }),
            new transports.File({
                level: 'debug',
                filename: 'project.log',
                format: combine(
                    timestamp(),
                    printf(({level, message, timestamp}) => `${timestamp} [${level}] ${message}`)
                ),
            }),
        ]
    })
}

/**
 * @returns {Logger}
 */
function logger() {
    if (!winstonLogger) {
        throw new Error('Logger is not configured.');
    }
    return winstonLogger;
}

module.exports = {
    configureLogger,
    logger,
};