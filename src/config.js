const fs = require('fs');
const yaml = require('yaml');
const {Validator} = require('jsonschema');

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

/**
 * Read config file, validate and return object
 * @param {string} filename
 * @returns {Object}
 */
function readConfig(filename) {
    let configString = fs.readFileSync(filename);
    let config = yaml.parse(configString.toString());
    new Validator().validate(config, schema, {throwError: true});
    return config;
}

function runTemplate(template, params) {
    let keys = Object.keys(params);
    let values = Object.values(params);
    return new Function(...keys, `return \`${template}\`;`)(...values);
}

module.exports = {
    readConfig,
    runTemplate,
};