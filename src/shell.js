const nativeExec = require('child_process').exec;
const {logger} = require('./logger');

/**
 * @typedef ExecResult
 * @type {Object}
 * @property {string} stdout
 * @property {string} stderr
 * @property {Object} error
 */

function logShellData(data) {
    logger().debug(data.trim());
}

/**
 * Execute shell command
 * @param {string} cwd
 * @param {string} shellCommand
 * @returns {Promise<ExecResult>}
 */
async function exec(cwd, shellCommand) {
    return new Promise(function (resolve, reject) {
        const shellProcess = nativeExec(shellCommand, {cwd}, (error, stdout, stderr) => {
            if (error) {
                reject({error, stdout, stderr});
            } else {
                resolve({stdout, stderr});
            }
        });
        shellProcess.stdout.on('data', logShellData);
        shellProcess.stderr.on('data', logShellData);
    });
}

module.exports = {
    exec
};