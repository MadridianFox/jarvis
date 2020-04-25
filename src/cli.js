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



module.exports = {
    parseFilter,
    getOption,
};