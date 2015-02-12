'use strict';

// TODO: can we replace this with something that auto-imports our package.json's `main`?
var utils = require('./l3-node-utils');
for (var key in utils)
  global[key] = utils[key];
