'use strict';

/**
 * @class TurenConnector
 */
function TurenConnector() {
  this.socket = null;
  this.port = null;
  this.host = null;
  this._connected = null;
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
 */
TurenConnector.prototype.connect = function(hello, onconnect) {
  if (typeof hello !== 'string')
    throw new TypeError('The 1st argument must be a string.');
  if (typeof onconnect !== 'function')
    throw new TypeError('The 2nd argument must be a function.');

  this._connect((err, socket) => {
    if (this._connected !== null)
      return;

    if (!err) {
      if (socket && socket.write) {
        this.socket = socket;
        this.writeHeader(hello);
        this._connected = true;
      } else {
        err = new Error('socket is not returned after connect');
        this._connected = true;
      }
    }
    onconnect(err, socket, this);
  });
};

/**
 * @method _connect
 * @param {Function} cb - the onconnect callback
 * @virtual
 */
TurenConnector.prototype._connect = function(onconnect) {
  throw new Error('connector._connect() not implemented');
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
 * @method write
 * @param {String} buf
 */
TurenConnector.prototype.write = function(buf) {
  return this.socket.write(buf);
};

/**
 * @method destroy
 */
TurenConnector.prototype.destroy = function() {
  if (this.socket) {
    this.socket.end();
    this.socket = null;
  }
};

exports.TurenConnector = TurenConnector;
