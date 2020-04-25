const {withFilter} = require("../middlewares/with-filter");
const {withConfig} = require("../middlewares/with-config");
const {withLogger} = require("../middlewares/with-logger");
const {column, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = (instance, options) => {
    return withLogger(async logger => {
        return withConfig(options, async config => {
            return withFilter(options, async filter => {
                let repositories = repository.byFilter(config, filter);
                for (let repo of repositories) {
                    let path = repository.getPath(config, repo, instance),
                        branch = await git.getBranch(path);
                    await line(async () => {
                        logger().info(`Start updating ${repo.name}`);
                        column(15).white(repo.name);
                        column(15).white(branch);
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
        });
    })
};