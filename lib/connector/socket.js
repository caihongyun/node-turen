'use strict';

var net = require('net');
var TurenConnector = require('./base').TurenConnector;
var inherits = require('util').inherits;

function SocketConnector() {
  TurenConnector.call(this);
}
inherits(SocketConnector, TurenConnector);

SocketConnector.prototype.connect = function(hello, onconnect) {
  var socket = net.connect(this.port, '0.0.0.0', () => {
    this.socket = socket;
    this.writeHeader(hello);
    if (typeof onconnect === 'function')
      onconnect(null, this.socket);
  });
  socket.on('error', (err) => {
    if (typeof onconnect === 'function')
      onconnect(err);
    else
      throw err;
  });
};

exports.SocketConnector = SocketConnector;