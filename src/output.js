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
};