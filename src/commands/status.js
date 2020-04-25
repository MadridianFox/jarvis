const {withFilter} = require("../middlewares/withFilter");
const {withConfig} = require("../middlewares/with-config");
const {withLogger} = require("../middlewares/with-logger");
const {column, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = (instance, options) => {
    return withLogger(async () => {
        return withConfig(options, async config => {
            return withFilter(options, async filter => {
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
        });
    })
};