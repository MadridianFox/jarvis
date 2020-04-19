const path = require('path');
const {runTemplate} = require('./config');

/**
 * @typedef Repository
 * @type {Object}
 * @property {string} name
 * @property {string} url
 * @property {string} path
 * @property {?Object} labels
 */

/**
 * Get list of repositories by filter
 * @param {ProjectConfig} config
 * @param {Object} filter
 * @returns {Array<Repository>}
 */
function byFilter(config, filter) {
    if (filter.all) {
        return config.repositories;
    }
    let filterEntries = Object.entries(filter);
    return config.repositories.filter(repository => {
        if (filter.name) {
            return filter.name.indexOf(repository.name) !== -1;
        } else {
            if (!repository.labels) return false;
            for (let [label, values] of filterEntries) {
                if (values.indexOf(repository.labels[label]) === -1) return false;
            }
            return true;
        }
    });
}

/**
 * Get full path of repository
 * @param {ProjectConfig} config
 * @param {Repository} repository
 * @param {string} instanceName
 * @return {string}
 */
function getPath(config, repository, instanceName) {
    let relativePath = runTemplate(repository.path, {
        INSTANCE: instanceName,
        NAME: repository.name
    });
    return path.normalize(path.join(config.path, relativePath));
}

module.exports = {
    byFilter,
    getPath,
};