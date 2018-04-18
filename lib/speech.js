'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var TurenRpc = require('./client/rpc').TurenRpc;
var TurenEvent = require('./client/event').TurenEvent;
var SocketConnector = require('./connector/socket').SocketConnector;

function defaultConnectorFn() {
  return new SocketConnector();
}

/**
 * @class TurenSpeech
 */
function TurenSpeech(connectorFn) {
  EventEmitter.call(this);
  connectorFn = connectorFn || defaultConnectorFn;
  this.speakId = -1;
  this.response = {};
  this.rpcClient = new TurenRpc(connectorFn, {
    autoConnects: true,
  });
  this.eventHandler = new TurenEvent(connectorFn);
  this.eventHandler.on('event', (data) => {
    if (data.type === 'asr begin') {
      var isNew = data.speakId !== this.speakId;
      this.speakId = data.speakId;
      this.response = { id: data.speakId };
      if (isNew) {
        this.emit('asr begin', data.asr, data);
      }
      this.emit('asr pending', data.asr, data);
    } else if (data.type === 'asr end') {
      this.response.asr = data.asr;
      this.emit('asr end', data.asr, data);
    } else if (data.type === 'nlp') {
      this.response.nlp = data.nlp;
      this.response.action = data.action;
      this.emit('nlp', this.response);
    } else {
      this.emit(data.type, data);
    }
    this.emit('raw event', data);
  });
}
inherits(TurenSpeech, EventEmitter);

/**
 * @method start
 * @param {Object} config
 */
TurenSpeech.prototype.start = function(config) {
  this.eventHandler.start();
  if (config)
    this.setConfig(config);
};

/**
 * @method pause
 */
TurenSpeech.prototype.pause = function() {
  return this.rpcClient.makeCall('OpenMic', [false]);
};

/**
 * @method resume
 */
TurenSpeech.prototype.resume = function() {
  return this.rpcClient.makeCall('OpenMic', [true]);
};

/**
 * @method setPickup
 * @param {Boolean} isPickup
 */
TurenSpeech.prototype.setPickup = function(isPickup) {
  return this.rpcClient.makeCall('Pickup', [isPickup]);
};

/**
 * @method setStack
 * @param {String} stackStr
 */
TurenSpeech.prototype.setStack = function(stackStr) {
  return this.rpcClient.makeCall('SetStack', [stackStr || '']);
};

/**
 * @method setSkillOpts
 * @param {String} opts
 */
TurenSpeech.prototype.setSkillOpts = function(opts) {
  return this.rpcClient.makeCall('SetSkillOpts', [opts || '']);
};

/**
 * @method setConfig
 * @param {Object} config
 * @param {String} config.key
 * @param {String} config.secret
 * @param {String} config.deviceTypeId
 * @param {String} config.deviceId
 */
TurenSpeech.prototype.setConfig = function(config) {
  if (!config.key)
    throw new TypeError('config.key is required');
  if (!config.secret)
    throw new TypeError('config.secret is required');
  if (!config.deviceTypeId)
    throw new TypeError('config.deviceTypeId is required');
  if (!config.deviceId)
    throw new TypeError('config.deviceId is required');

  this.rpcClient.makeCall('Restart', [
    config.host || 'apigwws.open.rokid.com',
    config.port || 443,
    '/api',
    config.key,
    config.secret,
    config.deviceTypeId,
    config.deviceId,
  ]);
};

/**
 * @method end
 */
TurenSpeech.prototype.end = function() {
  this.eventHandler.close();
  this.rpcClient.close();
};

exports.TurenSpeech = TurenSpeech;
