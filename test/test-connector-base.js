'use strict';

var assert = require('assert');
var turen = require('../');
var inherits = require('util').inherits;
var isTestFinished = false;

function MockSocket() {
  this._destroyed = null;
}
MockSocket.writeBuffer = null;
MockSocket.prototype.write = function(buf) {
  MockSocket.writeBuffer = buf;
};
MockSocket.prototype.end = function() {
  MockSocket.writeBuffer = null;
  this._destroyed = true;
};

function TestConnector() {
  turen.connector.Base.call(this);
}
inherits(TestConnector, turen.connector.Base);

TestConnector.prototype._connect = function(cb) {
  var socket = new MockSocket();
  cb(null, socket);
};

// start test
var connectorInstance = new TestConnector();
connectorInstance.connect('hello', (err, socket, connector) => {
  assert.equal(err, null);
  assert.equal(socket instanceof MockSocket, true);
  assert.equal(socket, connector.socket);

  // check the hello header
  assert.equal(Buffer.isBuffer(MockSocket.writeBuffer), true);
  assert.equal(MockSocket.writeBuffer.byteLength, 1024);
  assert.equal(MockSocket.writeBuffer.slice(0, 5).toString('utf8'), 'hello');

  // check the write buffer
  connector.write('foobar');
  assert.equal(MockSocket.writeBuffer, 'foobar');

  // check the destroy
  connector.destroy();
  assert.equal(MockSocket.writeBuffer, null);
  assert.equal(connector.socket, null);
  assert.equal(socket._destroyed, true);
  isTestFinished = true;
});

process.on('exit', () => {
  assert.equal(isTestFinished, true);
});