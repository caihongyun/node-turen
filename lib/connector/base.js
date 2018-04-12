'use strict';

/**
 * @class TurenConnector
 */
function TurenConnector() {
  this.socket = null;
  this.port = null;
  this.host = null;
}

/**
 * @method setPort
 * @param {Number} port
 * @param {String} host
 */
TurenConnector.prototype.setPort = function(port, host) {
  this.port = port;
  this.host = host;
};

/**
 * @method connect
 * @virtual
 */
TurenConnector.prototype.connect = function() {
  throw new Error('not implemented');
};

/**
 * @method writeHeader
 * @param {String} text
 */
TurenConnector.prototype.writeHeader = function(text) {
  var buf = new Buffer(1024);
  buf.fill(0);
  buf.write(text || 'turen.client');
  this.socket.write(buf);
};

/**
 * @method destroy
 */
TurenConnector.prototype.destroy = function() {
  if (this.socket)
    this.socket.end();
};

exports.TurenConnector = TurenConnector;
