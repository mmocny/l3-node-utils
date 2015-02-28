#!/usr/bin/env rnode

'use strict';

try {
  require("babel/register");
} catch(e) {
}

// TODO: can we replace this with something that is less hacky?
var utils = require(require('./package.json').main);
for (var key in utils)
  global[key] = utils[key];
