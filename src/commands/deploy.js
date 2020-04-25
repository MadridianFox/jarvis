const {getOption, getFilterOption, getConfigOption, actionWrapper} = require("../cli");
const {configureLogger, logger} = require('../logger');
const {readConfig} = require('../config');
const {print, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = actionWrapper(async (instance, options) => {
    configureLogger(getOption('verbose', options, false));
    const config = readConfig(getConfigOption(options));
    const filter = getFilterOption(options);

    let repositories = repository.byFilter(config, filter);
    for (let repo of repositories) {
        await line(async () => {
            logger().info(`Start cloning ${repo.name}`);
            print(repo.name, 20);
            await git.clone(repo.url, repository.getPath(config, repo, instance));
            logger().info(`Done`);
            return 'OK';
        });
    }
});