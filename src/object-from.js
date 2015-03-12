'use strict';

/******************************************************************************/

exports = module.exports = function ObjectFrom(keyValues) {
  let o = {}; // new Map?
  for (let [k,v] of keyValues) {
    o[k] = v;
  }
  return o;
}

/******************************************************************************/
