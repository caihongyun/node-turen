'use strict';

/**
 * @class TurenRequest
 * @param {TurenConnector} connector
 * @param {Number} magic
 */
function TurenRequest(connector, magic) {
  if (!magic)
    throw new TypeError('magic is required');

  this.connector = connector;
  this.chunks = [];
  this.magic = magic;
  this.length = 0;
}

/**
 * @method writeInt32
 * @param {Number} num
 */
TurenRequest.prototype.writeInt32 = function writeInt32(num) {
  var int32 = new Buffer(4);
  int32.writeInt32LE(num);
  this.chunks.push(int32);
  this.length += 4;
};

/**
 * @method writeShort
 * @param {Number} num
 */
TurenRequest.prototype.writeShort = function writeShort(num) {
  var short = new Buffer(2);
  short.writeInt16LE(num);
  this.chunks.push(short);
  this.length += 2;
};

/**
 * @method writeString
 * @param {String} str
 */
TurenRequest.prototype.writeString = function writeString(str) {
  var buf = new Buffer(`${str}\0`);
  this.writeShort(buf.byteLength);
  this.chunks.push(buf);
  this.length += buf.byteLength;
};

/**
 * @method getHeader
 */
TurenRequest.prototype.getHeader = function getHeader() {
  var len = this.length + 4;
  var buf = new Buffer(8);
  buf.writeInt32LE(len, 0);
  buf.writeInt32LE(this.magic, 4);
  return buf;
};

/**
 * @method getBuffer
 */
TurenRequest.prototype.getBuffer = function getBuffer() {
  var v = Buffer.concat([this.getHeader()].concat(this.chunks));
  return v;
};

/**
 * @method flush
 */
TurenRequest.prototype.flush = function flush() {
  var socket = this.connector.socket;
  return new Promise((resolve, reject) => {
    socket.write(this.getBuffer());
    var timer = setTimeout(() =>
      reject(new Error('connection timeout')), 5000);

    socket.on('data', (data) => {
      clearTimeout(timer);
      resolve(data);
    });
    socket.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    socket.on('close', () => {
      clearTimeout(timer);
      // reject(new Error('connection closed'));
    });
  }).catch((err) => {
    this.connector.destroy();
    throw err;
  });
};

exports.TurenRequest = TurenRequest;
