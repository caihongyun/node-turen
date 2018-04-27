'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var TurenResponse = require('../response').TurenResponse;

/**
 * @class TurenEvent
 * @param {TurenConnector} connectorFn
 * @param {Object} options
 */
function TurenEvent(connectorFn) {
  EventEmitter.call(this);
  this._connected = false;
  this.connector = connectorFn();
  this.connector.setPort(30200);
}
inherits(TurenEvent, EventEmitter);

/**
 * @method start
 */
TurenEvent.prototype.start = function() {
  if (this._connected)
    return;
  this._connected = true;
  this.connector.connect('event', (err, socket) => {
    if (err || !socket) {
      return this.onend();
    } else {
      this.emit('connect', socket);
    }
    socket.on('data', this.onevent.bind(this));
    socket.on('end', this.onend.bind(this));
    socket.on('close', this.onclose.bind(this));
    socket.on('error', this.onerror.bind(this));
  });
};

/**
 * @method onevent
 * @param {Buffer} chunk
 */
TurenEvent.prototype.onevent = function(chunk) {
  try {
    var response = new TurenResponse(chunk, 0x76543210);
    var data = {
      turenId: response.readInt32(),
      speakId: response.readInt32(),
      type: response.readType(),
      sl: response.readFloat(),
      engry: response.readFloat(),
      asr: response.readString(),
      nlp: response.readJson(),
      action: response.readJson(),
    };
    this.emit('event', data);
  } catch (err) {
    console.error('detected some parse error');
    this.emit('error', err);
  }
};

/**
 * @method onend
 */
TurenEvent.prototype.onend = function() {
  this._connected = false;
  this.emit('end');
};

/**
 * @method onclose
 */
TurenEvent.prototype.onclose = function() {
  this._connected = false;
  this.emit('close');
};

/**
 * @method onerror
 * @param {Error} err
 */
TurenEvent.prototype.onerror = function(err) {
  this.emit('error', err);
};

/**
 * @method disconnect
 */
TurenEvent.prototype.disconnect = function() {
  this._connected = false;
  this.connector.destroy();
};

exports.TurenEvent = TurenEvent;
