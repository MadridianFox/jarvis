const {createTerminal} = require('terminal-kit');

/**
 * @typedef Printer
 * @type {Object}
 * @property {function (str: string)} white
 * @property {function (str: string)} red
 * @property {function (str: string)} yellow
 * @property {function (str: string)} green
 */


let terminal;

function getOutput() {
    if (!terminal) {
        terminal = createTerminal();
    }

    return terminal;
}

/**
 * Cut string if it too big and add spaces on right if it too small
 * @param {string} str
 * @param {Number} width
 * @returns {string}
 */
function toWidth(str, width) {
    return str.substr(0, width - 1).padEnd(width, ' ');
}

/**
 * Get printer for column with width
 * @param {Number} width
 * @returns {Printer}
 */
function column(width) {
    return {
        white: str => getOutput().white(toWidth(str, width)),
        red: str => getOutput().red(toWidth(str, width)),
        yellow: str => getOutput().yellow(toWidth(str, width)),
        green: str => getOutput().green(toWidth(str, width)),
    };
}

/**
 * Print status on right end of line
 * @param {string} msg
 */
function endStatus(msg) {
    let term = getOutput();
    term.column(terminal.width - (msg.length + 1)).white('[');
    switch (msg) {
        case 'OK':
            term.green(msg);
            break;
        case 'ERROR':
            term.red(msg);
            break;
        default:
            term.yellow(msg);
    }
    term.white(']');
}

/**
 * Print status and add line end after callback execution
 * @param {function()} callback
 * @returns {Promise<void>}
 */
async function line(callback) {
    let status = await callback();
    if (status) {
        endStatus(status);
    }
    console.log('');
}

module.exports = {
    column,
    line
};