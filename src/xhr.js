'use strict';

/******************************************************************************/

let XMLHttpRequest = exports.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/******************************************************************************/

function xhrJSON(type, url, data) {
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
          resolve(JSON.parse(response));
        } else {
          reject(xmlhttp.status);
        }
      }
    };
    xmlhttp.open(type, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.responseType = "application/json";
    data = data && JSON.stringify(data);
    xmlhttp.send(data);
  });
}

/******************************************************************************/

function getJSON(url) {
  return xhrJSON("GET", url);
}

function postJSON(url, data) {
  return xhrJSON("POST", url, data);
}

function putJSON(url, data) {
  return xhrJSON("PUT", url, data);
}

/******************************************************************************/

module.exports = exports = {
  getJSON: getJSON,
  postJSON: postJSON,
};
