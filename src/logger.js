const {createLogger, transports, format} = require('winston');
const {combine, timestamp, printf} = format;

let winstonLogger;

function configureLogger() {
    winstonLogger = createLogger({
        level: 'debug',
        transports: [
            new transports.File({
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