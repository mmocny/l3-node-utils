#!/usr/bin/env babel-node

'use strict';

// Usage:
// require('l3-node-utils/global')

/******************************************************************************/

require('shelljs/global');

/******************************************************************************/

function exportNodeModule(varName, pkg) {
    if (!pkg)
        pkg = varName;
    if (varName.startsWith('./'))
        varName = varName.slice(2);
    if (typeof pkg === 'string')
        pkg = require(pkg);
    if (varName.includes('/'))
        throw new Error('Cannot export a module with a slash.  Provide a custom name');
    exports[varName] = pkg;
}

/******************************************************************************/

//exportNodeModule('child_process');
//exportNodeModule('fs');
//exportNodeModule('path');

exportNodeModule('co');
exportNodeModule('FormData', 'form-data');
exportNodeModule('_', 'lodash');
exportNodeModule('fetch', 'node-fetch');
exportNodeModule('Q', 'q');
exportNodeModule('XMLHttpRequest', require("xmlhttprequest").XMLHttpRequest);

exportNodeModule('./xhr');
exportNodeModule('./pSpawn');
exportNodeModule('./pRun');
exportNodeModule('ObjectFrom', './object-from');
exportNodeModule('ObjectGetAllPropertyNames', './object-get-all-property-names');

exportNodeModule('git', exports.pRun.bind(null, 'git'));
exportNodeModule('hub', exports.pRun.bind(null, 'hub'));

/******************************************************************************/

let runTests = () => {
    require('../global');

    let spawnRunTests = [
            () => pRun('ls', '/', '~'),
            () => pRun('ls', '/ ~'),
            () => pRun('ls', ['/', '~']),
            () => pSpawn('ls', '/', '/Users/mmocny'),
            () => pSpawn('ls', ['/', '/Users/mmocny']),
            () => git('remote -v'),
            () => hub('remote -v'),
        ].map(pf => () =>
            pf().then(output => {
                if (_.isUndefined(output))
                    return;
                if (!_.isUndefined(output.stdout))
                    console.log(output.stdout)
                if (!_.isUndefined(output.stderr))
                    console.error(output.stderr)
            })
            .catch(console.error)
            .then(() => console.log())
        );

    let moduleTests = [
            Q,
            _,
            co,
            fetch,
        ].map(pkg => () => console.log(Object.getOwnPropertyNames(pkg)));

    [].concat(spawnRunTests, moduleTests)
        .reduce(Q.when, Q.when())
        .catch(console.error);
}

if (require.main === module) {
    runTests();
}
