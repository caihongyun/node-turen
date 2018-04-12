'use strict';

const VoiceEvents = require('./events.json');

/**
 * @class TurenResponse
 * @param {Buffer} data
 * @param {Number} magic
 */
function TurenResponse(data, magic) {
  this.offset = 0;
  this.buffer = data;
  this.length = this.readInt32();
  this.magic = this.readInt32();
  if (this.magic !== magic)
    throw new TypeError('invalid response');
}

/**
 * @method readInt32
 */
TurenResponse.prototype.readInt32 = function readInt32() {
  var v = this.buffer.readInt32LE(this.offset);
  this.offset += 4;
  return v;
};

/**
 * @method readFloat
 */
TurenResponse.prototype.readFloat = function readFloat() {
  var v = this.buffer.readFloatLE(this.offset);
  this.offset += 4;
  return v;
};

/**
 * @method readInt8
 */
TurenResponse.prototype.readInt8 = function readInt8() {
  var v = this.buffer.readInt8(this.offset);
  this.offset += 1;
  return v;
};

/**
 * @method readShort
 */
TurenResponse.prototype.readShort = function readShort() {
  var v = this.buffer.readInt16LE(this.offset);
  this.offset += 2;
  return v;
};

/**
 * @method readType
 */
TurenResponse.prototype.readType = function readType() {
  var v = this.readInt8();
  return VoiceEvents[v];
};

/**
 * @method readString
 */
TurenResponse.prototype.readString = function readString() {
  var len = this.readShort();
  if (len <= 0) {
    return '';
  }
  var v = this.buffer.toString(
    'utf8', this.offset, this.offset + len);
  this.offset += len;

  if (v.length > 0) {
    v = v.slice(0, -1);
  }
  return v;
};

/**
 * @method readJson
 */
TurenResponse.prototype.readJson = function readJson() {
  var json;
  var raw = this.readString();
  try {
    json = JSON.parse(raw);
  } catch (err) {
    if (raw === '') {
      json = {};
    } else {
      json = new Error('invalid JSON string: ' + raw);
    }
  }
  return json;
}

exports.TurenResponse = TurenResponse;
