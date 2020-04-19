const fs = require('fs');
const yaml = require('yaml');
const {Validator} = require('jsonschema');

/**
 * @typedef ProjectConfig
 * @type {Object}
 * @property {string} path
 * @property {Array<Repository>} repositories
 */

const schema = {
    type: 'object',
    properties: {
        path: {type: 'string', required: true},
        repositories: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {type: 'string', required: true},
                    url: {type: 'string', required: true},
                    path: {type: 'string', required: true},
                    labels: {type: 'object'}
                }
            }
        }
    },
};

class ConfigError extends Error {}

/**
 * Read config file, validate and return object
 * @param {string} filename
 * @returns {ProjectConfig}
 */
function readConfig(filename) {
    let configString = fs.readFileSync(filename);
    let config = yaml.parse(configString.toString());
    try {
        new Validator().validate(config, schema, {throwError: true});
    } catch (e) {
        throw new ConfigError(e.stack.replace('instance.', ''));
    }
    return config;
}

/**
 * Evaluate regular string as template
 * @param {string} template
 * @param {Object} params
 * @returns {*}
 */
function runTemplate(template, params) {
    let keys = Object.keys(params);
    let values = Object.values(params);
    try {
        return new Function(...keys, `return \`${template}\`;`)(...values);
    } catch (e) {
        throw new ConfigError(e.message);
    }
}

module.exports = {
    readConfig,
    runTemplate,
    ConfigError,
};