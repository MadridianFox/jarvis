const fs = require('fs');
const {exec} = require('./shell');

async function clone(url, path) {
    if (fs.existsSync(path)) {
        return;
    }

    return await exec('/tmp', `git clone ${url} ${path}`);
}

async function getBranch(path) {
    let {stdout: rawBranch} = await exec(path, "git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \\( *\\)/\\1/'");
    return rawBranch.trim();
}

async function pull(path, branch) {
    let {stdout: status} = await exec(path, `git pull origin ${branch}`);
    if (status.trim() === 'Already up to date.') {
        return 0;
    }
    return 1;
}

async function reset(path) {
    await exec(path, 'git add . && git reset --hard');
}

module.exports = {
    getBranch,
    clone,
    pull,
    reset,
};