'use strict';

/******************************************************************************/

exports = module.exports = function ObjectGetAllPropertyNames(obj) {
    // From: http://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
    var props = [];

    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props;
}

/******************************************************************************/
