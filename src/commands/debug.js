const {getOption, getFilterOption, getConfigOption, actionWrapper} = require("../cli");
const {configureLogger} = require('../logger');
const {readConfig} = require('../config');
const repository = require('../repository');

module.exports = actionWrapper(async options => {
    configureLogger(getOption('verbose', options, false));

    const configFile = getConfigOption(options);
    const config = readConfig(configFile);
    const filter = getFilterOption(options);

    let repositories = repository.byFilter(config, filter);
    for (let repo of repositories) {
        console.log(repository.getPath(config, repo, 'ananas'));
    }
});