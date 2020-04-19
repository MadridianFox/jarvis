const {getOption, getFilterOption, getConfigOption, actionWrapper} = require("../cli");
const {configureLogger, logger} = require('../logger');
const {exec} = require('../shell');
const {readConfig} = require('../config');

module.exports = actionWrapper(async options => {
    configureLogger(getOption('verbose', options, false));

    const filter = getFilterOption(options);

    const configFile = getConfigOption(options);
    const config = readConfig(configFile);

    logger().info('info message');
    logger().debug('debug message');
    logger().warn('warn message');
    logger().error('error message');

    console.log(filter, config);

    let {stdout} = await exec('/tmp','echo "no error"');
    logger().info(stdout.trim());

    try {
        await exec('/tmp','echo "error"; exit 1');
    } catch (e) {
        logger().error(e.stdout.trim());
    }
});