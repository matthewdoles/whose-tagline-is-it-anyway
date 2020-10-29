'use strict';

var https = require('https');
var fetchData = function fetchData(options) {
  return new Promise(function (resolve, reject) {
    var request = https.request(options, function (response) {
      if (response.statusCode < 200 || response.stausCode >= 300) {
        return reject(new Error('statusCode= ' + response.statusCode));
      }

      var body = [];
      response.on('data', function (chunk) {
        body.push(chunk);
      });

      response.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (error) {
          reject(error);
        }
        resolve(body);
      });
    });
    request.on('error', function (error) {
      reject(error);
    });
    request.end();
  });
};

module.exports = {
  fetchData: fetchData
};