'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var TurenResponse = require('../response').TurenResponse;
var SocketConnector = require('../connector/socket').SocketConnector;

/**
 * @class TurenEvent
 * @param {TurenConnector} connector
 */
function TurenEvent(connector) {
  EventEmitter.call(this);
  this.connector = connector || new SocketConnector();
  this.connector.setPort(30200);
}
inherits(TurenEvent, EventEmitter);

/**
 * @method start
 */
TurenEvent.prototype.start = function() {
  this.connector.connect('event', (err, socket) => {
    socket.on('data', this.onevent.bind(this));
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
 * @method onclose
 */
TurenEvent.prototype.onclose = function() {
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
 * @method onerror
 * @param {Error} err
 */
TurenEvent.prototype.close = function() {
  this.connector.destroy();
};

exports.TurenEvent = TurenEvent;
