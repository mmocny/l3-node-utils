'use strict';

/******************************************************************************/

let XMLHttpRequest = exports.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/******************************************************************************/

function xhrRAW(type, url, data) {
  return new Promise(function(resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          var response = xmlhttp.responseText;
          if (!response.length) {
            resolve(response);
            return;
          }
          if (response.indexOf(")]}'") == 0) {
            response = response.substring(")]}'".length);
          }
          resolve(response);
        } else {
          reject(xmlhttp.status);
        }
      }
    };
    xmlhttp.open(type, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.responseType = "application/json";
    xmlhttp.send(data);
  });
}
/******************************************************************************/

function xhrJSON(type, url, data) {
  data = data && JSON.stringify(data);
  return xhrRAW(type, url, data)
    .then(function(response) {
      return JSON.parse(response);
    });
}

/******************************************************************************/

module.exports = xhrRAW;

module.exports.get = xhrRAW.bind(null, "GET");
module.exports.post = xhrRAW.bind(null, "POST");
module.exports.put = xhrRAW.bind(null, "PUT");

module.exports.getJSON = xhrJSON.bind(null, "GET");
module.exports.postJSON = xhrJSON.bind(null, "POST");
module.exports.putJSON = xhrJSON.bind(null, "PUT");

/******************************************************************************/

