'use strict';

var SocketConnector = require('../connector/socket').SocketConnector;

function defaultConnector() {
  return new SocketConnector();
}

/**
 * @class TurenLogger
 * @param {String} connectorFn
 */
function TurenLogger(connectorFn) {
  connectorFn = connectorFn || defaultConnector;
  this.connector = connectorFn();
  this.connector.setPort(30100);
}

/**
 * @method readStart
 */
TurenLogger.prototype.readStart = function readStart() {
  return new Promise((resolve, reject) => {
    this.connector.connect('node-turen', (err, socket) => {
      if (err) return reject(err);
      resolve(socket);
    });
  });
};

/**
 * @method readStop
 */
TurenLogger.prototype.readStop = function readStop() {
  this.connector.destroy();
};

exports.TurenLogger = TurenLogger;
