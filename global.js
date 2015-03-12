#!/usr/bin/env node

'use strict';

try {
  // TODO: can set arguments to babel/register by calling it explicitly.
  // Including ignore / targets / whitelist
  require("babel/register");
} catch(e) {
}

// TODO: can we replace this with something that is less hacky?
var utils = require(require('./package.json').main);

for (var key in utils)
  global[key] = utils[key];
