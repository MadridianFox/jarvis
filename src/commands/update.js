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
        let path = repository.getPath(config, repo, instance),
            branch = await git.getBranch();
        await line(async () => {
            logger().info(`Start updating ${repo.name}`);
            print(repo.name, 20);
            print(branch, 10);
            await git.reset(path);
            let status;
            switch (await git.pull(path, branch)) {
                case 0:
                    status = 'SKIP';
                    break;
                case 1:
                    status = 'OK';
                    break;
                case -1:
                    status = 'ERROR';
                    break;
            }
            logger().info(`Done`);
            return status;
        });
    }
});