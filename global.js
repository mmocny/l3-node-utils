'use strict';

require("babel/register");

// TODO: can we replace this with something that is less hacky?
var utils = require(require('./package.json').main);
for (var key in utils)
  global[key] = utils[key];
