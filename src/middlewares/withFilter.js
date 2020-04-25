const {getOption} = require('../cli');

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
 *
 * @param {Object} options
 * @param {function(Object)} callback
 * @returns {Promise<*>}
 */
async function withFilter(options, callback) {
    const filter = getFilterOption(options);
    return await callback(filter);
}

module.exports = {
    withFilter
};