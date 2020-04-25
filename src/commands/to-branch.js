const {withFilter} = require("../middlewares/with-filter");
const {withConfig} = require("../middlewares/with-config");
const {withLogger} = require("../middlewares/with-logger");
const {column, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = (instance, newBranch, options) => {
    return withLogger(async () => {
        return withConfig(options, async config => {
            return withFilter(options, async filter => {
                let repositories = repository.byFilter(config, filter);
                for (let repo of repositories) {
                    let path = repository.getPath(config, repo, instance),
                        branch = await git.getBranch(path);
                    await line(async () => {
                        column(15).white(repo.name);
                        if (branch === newBranch) {
                            return 'SKIP';
                        } else {
                            await git.checkout(path, newBranch);
                            return 'OK';
                        }
                    });
                }
            });
        });
    })
};