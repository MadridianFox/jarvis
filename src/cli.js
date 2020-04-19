const {logger} = require('./logger');
const {ConfigError} = require('./config');

/**
 * Get option value from "commander object"
 * @param {string} name
 * @param {Object} options
 * @param {Boolean} require
 * @returns {*}
 */
function getOption(name, options, require = true) {
    let level = options;
    do {
        if (level[name]) {
            return level[name];
        }
        level = level.parent;
    } while (level);

    if (require) throw new Error(`Option ${name} is required`);
}

/**
 * Filter option parser for commander
 * @param {string} term
 * @param {Object} previous
 */
function parseFilter(term, previous) {
    if (term === 'all') {
        previous.all = true;
    } else {
        let [key, value] = term.split('=');
        if (!value) {
            value = key;
            key = 'name';
        }
        if (!previous[key]) previous[key] = [];
        previous[key].push(value);
    }

    return previous;
}

/**
 * Get repository filter from "commander object"
 * @param {Object} options
 * @returns {Object}
 */
function getFilterOption(options) {
    const filter = getOption('label', options, false);
    if (Object.entries(filter).length < 1) {
        throw new Error('At least one condition needed. For work on all repositories use "-l all" option.');
    }
    return filter;
}

/**
 * Get project file path
 * @param {Object} options
 * @returns {string}
 */
function getConfigOption(options) {
    let filename = getOption('config', options, false);
    if (!filename) {
        filename = process.env.JARVIS_FILE;
    }
    if (!filename) {
        throw new Error('Project file needed. You can provide path to file via "-c <file>" option or in JARVIS_FILE env variable.')
    }
    return filename;
}

function actionWrapper(callback) {
    return async function (...args) {
        try {
            await callback(...args);
            logger().info('Finished', () => process.exit());
        } catch (e) {
            if (e instanceof ConfigError) {
                logger().error(`Config error: ${e.message}`, () => process.exit(1));
            } else {
                logger().error(e, () => process.exit(1));
            }
        }
    };
}

module.exports = {
    parseFilter,
    getOption,
    getFilterOption,
    getConfigOption,
    actionWrapper,
};