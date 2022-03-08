#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

let path = require('path');
let fs = require('fs');
let program = require('commander');
let npm = require('npm');
let ini = require('ini');
let echo = require('node-echo');
let extend = require('extend');
let open = require('open');
let async = require('async');
let request = require('request');
let only = require('only');

let registries = require('./registries.json');
let PKG = require('./package.json');
let BYRMRC = path.join(process.env.HOME, '.byrmrc');
let YARNRC = path.join(process.env.HOME, '.yarnrc');


program
    .version(PKG.version);

program
    .command('ls')
    .description('List all the registries')
    .action(onList);

program
    .command('current')
    .description('Show current registry name')
    .action(showCurrent);

program
    .command('use <registry>')
    .description('Change registry to registry')
    .action(onUse);

program
    .command('test [registry]')
    .description('Show response time for specific or all registries')
    .action(onTest);

program
    .command('help')
    .description('Print this help')
    .action(program.help);

program
    .parse(process.argv);


if (process.argv.length === 2) {
    program.outputHelp();
}

/*/ /////////////// cmd methods ///////////////// */

function onList() {
    getCurrentRegistry((cur) => {
        let info = [''];
        let allRegistries = getAllRegistry();

        Object.keys(allRegistries).forEach((key) => {
            let item = allRegistries[key];
            let prefix = item.registry === cur ? '* ' : '  ';
            info.push(prefix + key + line(key, 8) + item.registry);
        });

        info.push('');
        printMsg(info);
    });
}

function showCurrent() {
    getCurrentRegistry((cur) => {
        let allRegistries = getAllRegistry();
        Object.keys(allRegistries).forEach((key) => {
            let item = allRegistries[key];
            if (item.registry === cur) {
                printMsg([key]);
                return;
            }
        });
    });
}

function onUse(name) {
    let allRegistries = getAllRegistry();
    if (allRegistries.hasOwnProperty(name)) {
        let registry = allRegistries[name];

        fs.writeFile(YARNRC, 'registry "' + registry.registry + '"', (err) => {
            if (err) throw err;
            // console.log('It\'s saved!');

            printMsg([
                '', '   YARN Registry has been set to: ' + registry.registry, ''
            ]);
        });

        // 同时更改npm的源
        npm.load((err) => {
            if (err) return exit(err);

            npm.commands.config(['set', 'registry', registry.registry], (err, data) => {
                if (err) return exit(err);
                console.log('                        ');
                let newR = npm.config.get('registry');
                printMsg([
                    '', '   NPM Registry has been set to: ' + newR, ''
                ]);
            })
        });
    } else {
        printMsg([
            '', '   Not find registry: ' + name, ''
        ]);
    }
}

function onTest(registry) {
    let allRegistries = getAllRegistry();

    let toTest;

    if (registry) {
        if (!allRegistries.hasOwnProperty(registry)) {
            return;
        }
        toTest = only(allRegistries, registry);
    } else {
        toTest = allRegistries;
    }

    async.map(Object.keys(toTest), (name, cbk) => {
        let registry = toTest[name];
        let start = Number(new Date());
        request(registry.registry + 'pedding', (error) => {
            cbk(null, {
                name: name,
                registry: registry.registry,
                time: (Number(new Date()) - start),
                error: error ? true : false
            });
        });
    }, (err, results) => {
        getCurrentRegistry((cur) => {
            let msg = [''];
            results.forEach((result) => {
                let prefix = result.registry === cur ? '* ' : '  ';
                let suffix = result.error ? 'Fetch Error' : result.time + 'ms';
                msg.push(prefix + result.name + line(result.name, 8) + suffix);
            });
            msg.push('');
            printMsg(msg);
        });
    });
}



/*/ /////////////// helper methods ///////////////// */

/*
 * get current registry
 */
function getCurrentRegistry(cbk) {
    npm.load((err, conf) => {
        if (err) return exit(err);
        cbk(npm.config.get('registry'));
    });
}

function getCustomRegistry() {
    return fs.existsSync(BYRMRC) ? ini.parse(fs.readFileSync(BYRMRC, 'utf-8')) : {};
}

function setCustomRegistry(config, cbk) {
    echo(ini.stringify(config), '>', BYRMRC, cbk);
}

function getAllRegistry() {
    return extend({}, registries, getCustomRegistry());
}

function printErr(err) {
    console.error('an error occured: ' + err);
}

function printMsg(infos) {
    infos.forEach((info) => {
        console.log(info);
    });
}

/*
 * print message & exit
 */
function exit(err) {
    printErr(err);
    process.exit(1);
}

function line(str, len) {
    let line = new Array(Math.max(1, len - str.length)).join('-');
    return ' ' + line + ' ';
}

module.exports = {
    getCurrentRegistry: getCurrentRegistry,
    getCustomRegistry: getCustomRegistry,
    getAllRegistry: getAllRegistry
}