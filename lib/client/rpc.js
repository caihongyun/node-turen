'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var TurenRequest = require('../request').TurenRequest;
var TurenResponse = require('../response').TurenResponse;
var SocketConnector = require('../connector/socket').SocketConnector;

var RpcMethodIds = {
  Restart: 2,
  RestartWithoutArgs: 3,
  AddWord: 4,
  AddWordv2: 5,
  RemoveWord: 6,
  ListWords: 7,
  GetWordInfo: 8,
  Pickup: 9,
  IsPickup: 10,
  OpenMic: 11,
  IsMicOpened: 12,
  SetStack: 13,
  SetSkillOption: 14,
  GetVoiceEnergy: 15,
};

/**
 * @class TurenRpc
 * @param {Function} connectorFn - the function to create connector
 * @param {Object} options
 * @param {Boolean} options.autoConnects - auto connect to the service
 * @param {Number} options.reconnectTimeout - reconnect to the service timeout
 */
function TurenRpc(connectorFn, options) {
  EventEmitter.call(this);
  this.magic = 0x12345678;
  this.connector = connectorFn();
  this.connector.setPort(30300);
  this._preQueue = [];
  this._preHandle = Promise.resolve();
  this._state = 'wait';
  this._reconnectTimeout = false;

  if (options) {
    if (options.reconnectTimeout) {
      this._reconnectTimeout = options.reconnectTimeout;
    }
    if (options.autoConnects) {
      this.connect();
    }
  }
}
inherits(TurenRpc, EventEmitter);

/**
 * @method connect
 */
TurenRpc.prototype.connect = function() {
  this.connector.connect('rpc.client', (err, socket) => {
    if (err || !socket) {
      this._state = 'error';
      this.reconnect();
    } else {
      socket.on('end', this.reconnect.bind(this));
      this._clearQueue();
    }
  });
};

/**
 * @method reconnect
 */
TurenRpc.prototype.reconnect = function() {
  this._state = 'error';
  if (this._reconnectTimeout > 0) {
    setTimeout(this.connect.bind(this), this._reconnectTimeout);
  }
};

/**
 * @method _clearQueue
 * @private
 */
TurenRpc.prototype._clearQueue = function() {
  this._state = 'ready';
  this._preHandle = this._preQueue.reduce((handle, info) => {
    return handle.then(() => this._makeCall(info.method, info.args));
  }, this._preHandle);

  this._preHandle.then(() => {
    this.emit('prequeue clean');
  }, (err) => {
    this.emit('prequeue clean', err);
  });
};

/**
 * @method _makeCall
 * @private
 */
TurenRpc.prototype._makeCall = function(method, args) {
  var methodId = RpcMethodIds[method];
  if (!methodId)
    throw new TypeError(`Unknown method call at ${method}`);

  var request = new TurenRequest(this.connector, this.magic);
  request.writeInt32(methodId);

  for (var i = 0; i < args.length; i += 1) {
    var arg = args[i];
    var type = typeof arg;
    if (type === 'number' || type === 'boolean') {
      request.writeInt32(Number(arg));
    } else if (type === 'string') {
      request.writeString(arg);
    } else {
      throw new TypeError(`Unsupport arg type "${type}", value is "${arg}"`);
    }
  }

  return request.flush().then((data) => {
    if (!data) return null;
    return new TurenResponse(data, this.magic);
  });
};

/**
 * @method makeCall
 * @param {String} method
 * @param {Array} args
 */
TurenRpc.prototype.makeCall = function(method, args) {
  if (this._state === 'wait') {
    this._preQueue.push({
      method: method,
      args: args,
    });
    return new Promise((resolve, reject) => {
      this.once('prequeue clean', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  } else {
    return this._makeCall(method, args);
  }
};

/**
 * @method getVoiceEnergy
 */
TurenRpc.prototype.getVoiceEnergy = function() {
  if (this._state === 'error') {
    return Promise.reject(new Error('connect not ready'));
  }
  return this.makeCall('GetVoiceEnergy', []).then((response) => {
    return response.readFloat();
  });
};

/**
 * @method close
 */
TurenRpc.prototype.close = function() {
  this._reconnectTimeout = false;
  this.connector.destroy();
};

exports.TurenRpc = TurenRpc;
