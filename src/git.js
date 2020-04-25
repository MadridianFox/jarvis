const fs = require('fs');
const {exec} = require('./shell');

/**
 * @typedef Changes
 * @type {Object}
 * @property {Number} staged
 * @property {Number} unTracked
 * @property {Number} unStaged
 */

/**
 * Clone repository to path
 * @param {string} url
 * @param {string} path
 * @returns {Promise<ExecResult|undefined>}
 */
async function clone(url, path) {
    if (fs.existsSync(path)) {
        return;
    }

    return await exec('/tmp', `git clone ${url} ${path}`);
}

/**
 * Get branch of repository in path
 * @param {string} path
 * @returns {Promise<string>}
 */
async function getBranch(path) {
    let {stdout: rawBranch} = await exec(path, "git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \\( *\\)/\\1/'");
    return rawBranch.trim();
}

/**
 * Pull branch from origin
 * @param {string} path
 * @param {string} branch
 * @returns {Promise<number>}
 */
async function pull(path, branch) {
    let {stdout: status} = await exec(path, `git pull origin ${branch}`);
    if (status.trim() === 'Already up to date.') {
        return 0;
    }
    return 1;
}

/**
 * Count changed files in repository
 * @param {string} path
 * @returns {Promise<Changes>}
 */
async function changes(path) {
    let {stdout} = await exec(path, 'git status --porcelain');
    let result = {
        unTracked: 0,
        staged: 0,
        unStaged: 0
    };
    for (let line of stdout.split("\n")) {
        if (!line) continue;
        let X = line.substr(0, 1),
            Y = line.substr(1, 1);
        switch (true) {
            case (X === '?' && Y === '?'):
                result.unTracked++;
                break;
            case (X !== ' ' && Y === ' '):
                result.staged++;
                break;
            default:
                result.unStaged++;
        }
    }
    return result;
}

/**
 * Do git reset --hard in repository
 * @param path
 * @returns {Promise<ExecResult>}
 */
async function reset(path) {
    return await exec(path, 'git add . && git reset --hard');
}

/**
 * Checkout repository to branch. If branch doesn't exists, create it
 * @param {string} path
 * @param {string} branch
 * @returns {Promise<ExecResult>}
 */
async function checkout(path, branch) {
    return await exec(path, `git checkout -B ${branch}`);
}

module.exports = {
    getBranch,
    clone,
    pull,
    reset,
    changes,
    checkout,
};