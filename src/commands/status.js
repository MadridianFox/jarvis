const {getFilterOption, getConfigOption, actionWrapper} = require("../cli");
const {configureLogger} = require('../logger');
const {readConfig} = require('../config');
const {column, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = actionWrapper(async (instance, options) => {
    configureLogger();
    const config = readConfig(getConfigOption(options));
    const filter = getFilterOption(options);

    let repositories = repository.byFilter(config, filter);
    for (let repo of repositories) {
        let path = repository.getPath(config, repo, instance),
            branch = await git.getBranch(path),
            changes = await git.changes(path);
        await line(() => {
            column(15).white(repo.name);
            column(15).white(branch);
            switch (true) {
                case changes.unTracked > 0:
                    column(10).red('untracked');
                    break;
                case changes.unStaged > 0:
                    column(10).red('unstaged');
                    break;
                case changes.staged > 0:
                    column(10).yellow('staged');
                    break;
                default:
                    column(10).green('commited');
            }
        });
    }
});