#!/usr/bin/env rnode

'use strict';

// Usage:
// require('l3-node-utils/global')

/******************************************************************************/

require('shelljs/global');

/******************************************************************************/

let Q = exports.Q = require('q');
let _ = exports._ = require('lodash');
let child_process = exports.child_process = require('child_process');
let fs = exports.fs = require('fs');
let path = exports.path = require('path');
let co = exports.co = require('co');

/******************************************************************************/

let xhr = exports.xhr = require('./xhr');
let pSpawn = exports.pSpawn = require('./pSpawn');
let pRun = exports.pRun = require('./pRun');

let git = exports.git = pRun.bind(null, 'git');
let hub = exports.hub = pRun.bind(null, 'hub');

/******************************************************************************/

let runTests = () => {
  var tests = [
    () => pRun('ls', '/', '~'),
    () => pRun('ls', '/ ~'),
    () => pRun('ls', ['/', '~']),
    () => pSpawn('ls', '/', '/Users/mmocny'),
    () => pSpawn('ls', ['/', '/Users/mmocny']),
    () => git('remote -v'),
    () => hub('remote -v'),
    ]
    .map((pf) => {
      return () =>
        pf()
          .then((output) => {
            if (_.isUndefined(output))
              return;
            if (!_.isUndefined(output.stdout))
              console.log(output.stdout)
            if (!_.isUndefined(output.stderr))
              console.error(output.stderr)
          })
          .catch(console.error)
          .then(() => console.log())
    });

  tests.reduce(Q.when, Q.when()).done();
}

if (require.main === module) {
  runTests();
}
