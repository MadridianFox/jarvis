const {getFilterOption, getConfigOption, actionWrapper} = require("../cli");
const {configureLogger} = require('../logger');
const {readConfig} = require('../config');
const {print, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = actionWrapper(async (instance, options) => {
    configureLogger();
    const config = readConfig(getConfigOption(options));
    const filter = getFilterOption(options);

    let repositories = repository.byFilter(config, filter);
    for (let repo of repositories) {
        let path = repository.getPath(config, repo, instance),
            branch = await git.getBranch(path);
        line(() => {
            print(repo.name, 20);
            print(branch, 20);
        });
    }
});