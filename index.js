#!/usr/bin/env node

const program = require('commander');
const {parseFilter} = require("./src/cli");

program.version('0.0.1')
    .option('-c, --config <file>', 'path to project config file')
    .option('-l, --label <filter>', 'filter repositories by labels', parseFilter, {})
    .option('-v, --verbose', 'verbose output to console');

program.command('deploy <instance>')
    .description('clone selected repositories to instance')
    .action(require('./src/commands/deploy'));

program.command('update <instance>')
    .description('update selected repositories in instance')
    .action(require('./src/commands/update'));

program.command('debug')
    .action(require('./src/commands/debug'));

program.parse(process.argv);
