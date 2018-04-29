'use strict';

var net = require('net');
var TurenConnector = require('./base').TurenConnector;
var inherits = require('util').inherits;

/**
 * @class SocketConnector
 * @extends TurenConnector
 */
function SocketConnector() {
  TurenConnector.call(this);
}
inherits(SocketConnector, TurenConnector);

/**
 * @method _connect
 * @implement
 */
SocketConnector.prototype._connect = function(cb) {
  var host = this.host || '0.0.0.0';
  var called = false;
  var socket = net.connect(this.port, host, () => {
    cb(null, socket);
  });
  socket.once('error', cb);
};

exports.SocketConnector = SocketConnector;