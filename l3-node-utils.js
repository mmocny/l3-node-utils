#!/usr/bin/env rnode

'use strict';

// Usage:
// require('l3-node-utils/global')

/******************************************************************************/

// TODO: right now, rnode runs 6to5 automatically, but perhaps we can use the following to replace require instead?
//require("6to5/register");
require('shelljs/global');

/******************************************************************************/

let Q = exports.Q = require('q');
let _ = exports._ = require('lodash');
let child_process = exports.child_process = require('child_process');
let fs = exports.fs = require('fs');
let path = exports.path = require('path');

/******************************************************************************/

// Usage:
// run('git', ['arg1', 'arg2', 'arg3'])
// run('git', 'arg1', 'arg2', 'arg3')
// run('git', 'arg1 arg2 arg3')
// run('git', { silent: true }, ['arg1', 'arg2', 'arg3'])
// run('git', { silent: true }, 'arg1', 'arg2', 'arg3')
// run('git', { silent: true }, 'arg1 arg2 arg3')
let run = exports.run = (cmd, opts = {}, ...args) => {
  if (!_.isPlainObject(opts)) {
    args.unshift(opts);
    opts = {};
  }
  opts.silent ?= true;
  opts.echoCommand ?= true;
  let command = `${cmd} ${_.flatten(args).join(' ')}`;

  return Q.Promise(function(resolve, reject) {
    if (opts.echoCommand) {
      console.info('[Running]:', command);
    }

    exec(command, opts, function(code, output) {
      if (code !== 0)
        return reject(code);
      resolve(output);
    });
  });
}

let spawn = exports.spawn = (cmd, opts = {}, ...args) => {
  if (!_.isPlainObject(opts)) {
    args.unshift(opts);
    opts = {};
  }
  opts.stdio ?= 'inherit';
  opts.echoCommand ?= true;
  args = _.flatten(args);

  return Q.Promise(function(resolve, reject) {
    if (opts.echoCommand) {
      console.info('[Spawning]:', cmd, args);
    }

    let child = child_process.spawn(cmd, args, opts);
    var didReturn = false;
    child.on('error', function(e) {
      if (!didReturn) {
        didReturn = true;
        reject(e);
      }
    });
    child.on('close', function(code) {
      if (!didReturn) {
        didReturn = true;
        if (code) {
          reject(new Error(code));
        } else {
          resolve();
        }
      }
    });
  });
}

let git = exports.git = run.bind(null, 'git');
let hub = exports.hub = run.bind(null, 'hub');

/******************************************************************************/

let runTests = () => {
  var tests = [
    () => run('ls', '/'),
    () => run('ls', ['/']),
    () => git('remote -v'),
    () => spawn('ls', '/'),
    () => spawn('ls', ['/']),
    ]
    .map((pf) => {
      return () =>
        pf()
          .then((output) => {
            if (output !== undefined)
              console.log(output)
          })
          .catch(console#error)
          .then(() => console.log())
    });

  tests.reduce(Q.when, Q.when()).done();
}

if (require.main === module) {
  runTests();
}
