const {configureLogger, logger} = require('../logger');
const {ConfigError} = require('../config');

/**
 * @param {function(logger: Logger)} callback
 * @returns {Promise<void>}
 */
async function withLogger(callback) {
    configureLogger();
    try {
        let result = await callback(logger);
        logger().info('Finished', () => process.exit());
        return result;
    } catch (e) {
        if (e instanceof ConfigError) {
            logger().error(`Config error: ${e.message}`, () => process.exit(1));
        } else {
            logger().error(e, () => process.exit(1));
        }
    }
}

module.exports = {
    withLogger
};