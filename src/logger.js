const {createLogger, transports, format} = require('winston');
const {combine, timestamp, printf} = format;

let winstonLogger;

/**
 * @param {Boolean} verbose
 */
function configureLogger(verbose) {
    winstonLogger = createLogger({
        level: verbose ? 'debug' : 'info',
        transports: [
            new transports.File({
                level: 'debug',
                filename: 'project.log',
                format: combine(
                    timestamp(),
                    printf(({level, message, timestamp}) => `${timestamp} [${level}] ${message}`)
                ),
            }),
        ]
    });

    process.on('uncaughtException', function (err) {
        winstonLogger.error(`Uncaught exception: ${err.message}`, err, () => {
            process.exit(1);
        });
    });
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