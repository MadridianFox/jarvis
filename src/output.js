const {createTerminal} = require('terminal-kit');

let terminal;

function getOutput() {
    if (!terminal) {
        terminal = createTerminal();
    }

    return terminal;
}

/**
 * @param {string} str
 * @param {Number} width
 */
function print(str, width) {
    getOutput().white(str.substr(0, width - 1).padEnd(width, ' '));
}

function toWidth(str, width) {
    return str.substr(0, width - 1).padEnd(width, ' ');
}

function column(width) {
    return {
        white: str => getOutput().white(toWidth(str, width)),
        red: str => getOutput().red(toWidth(str, width)),
        yellow: str => getOutput().yellow(toWidth(str, width)),
        green: str => getOutput().green(toWidth(str, width)),
    };
}

/**
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

async function line(callback) {
    let status = await callback();
    if (status) {
        endStatus(status);
    }
    console.log('');
}

module.exports = {
    print,
    endStatus,
    line,
    column
};