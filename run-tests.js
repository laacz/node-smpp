/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var sys = require('child_process');

var arg, help = true;
for (arg in process.argv) {
    if (process.argv[arg].substring(0, 2) === '--') {
        switch (process.argv[arg]) {
            case '--coverage':
                sys.exec('jscoverage lib/ lib-cov/', function(error, stdout, stderr) {
                    sys.exec('expresso -I lib-cov/ test/*', function(error, stdout, stderr) {
                        console.log(stdout);
                        console.log(stderr);
                    });
                });
                help = false;
                break;
            case '--tests':
                sys.exec('expresso -I lib/ test/*', function(error, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                });
                help = false;
                break;
        }
    }
}

if (help) {
    console.log('Tests runner for node-smpp.');
    console.log('Usage: node run-tests.js [params]');
    console.log('  --coverage: run tests and show code coverage');
    console.log('  --tests: run tests');
}
