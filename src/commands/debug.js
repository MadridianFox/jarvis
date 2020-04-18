const {getOption, getFilterOption, getConfigOption} = require("../cli");
const {configureLogger, logger} = require('../logger');

module.exports = options => {
    const filter = getFilterOption(options);
    const config = getConfigOption(options);
    configureLogger(getOption('verbose', options, false));

    logger().info('info message');
    logger().debug('debug message');
    logger().warn('warn message');
    logger().error('error message');

    console.log(filter, config);
};