const {readConfig} = require('../config');
const {getOption} = require('../cli');

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

/**
 *
 * @param {Object} options
 * @param {function(ProjectConfig)} callback
 * @returns {Promise<*>}
 */
async function withConfig(options, callback) {
    const config = readConfig(getConfigOption(options));
    return await callback(config);
}

module.exports = {
    withConfig
};