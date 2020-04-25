const {withFilter} = require("../middlewares/withFilter");
const {withLogger} = require("../middlewares/with-logger");
const {withConfig} = require("../middlewares/with-config");
const {column, line} = require('../output');
const git = require('../git');
const repository = require('../repository');

module.exports = (instance, options) => {
    return withLogger(async logger => {
        return withConfig(options, async config => {
            return withFilter(options, async filter => {
                let repositories = repository.byFilter(config, filter);
                for (let repo of repositories) {
                    await line(async () => {
                        logger().info(`Start cloning ${repo.name}`);
                        column(15).white(repo.name);
                        await git.clone(repo.url, repository.getPath(config, repo, instance));
                        logger().info(`Done`);
                        return 'OK';
                    });
                }
            });
        });
    })
};