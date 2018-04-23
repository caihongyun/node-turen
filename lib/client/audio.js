'use strict';

var SocketConnector = require('../connector/socket').SocketConnector;
var AudioOutputPorts = {
  mic_in: 30002,
  bf_out: 30003,
  vad: 30004,
  speech_in: 30006,
  codec_in: 30007,
  aec_out: 30010,
  // output
  mic_out: 30008,
};

function defaultConnector() {
  return new SocketConnector();
}

/**
 * @class TurenAudio
 * @param {String} type
 * @param {String} connectorFn
 */
function TurenAudio(type, connectorFn) {
  connectorFn = connectorFn || defaultConnector;
  this.type = type;
  this.connector = connectorFn();
  this.connector.setPort(AudioOutputPorts[type]);
  this.socket = null;
}

/**
 * @method connect
 */
TurenAudio.prototype.connect = function readStart() {
  return new Promise((resolve, reject) => {
    this.connector.connect(this.type, (err, socket) => {
      if (err) return reject(err);

      this.socket = socket;
      resolve(socket);
    });
  });
};

/**
 * @method disconnect
 */
TurenAudio.prototype.disconnect = function readStop() {
  if (this.type === 'mic_out')
    throw new Error('mic_out should not call readStart()');
  this.connector.destroy();
};

/**
 * @method send
 */
TurenAudio.prototype.send = function send(source) {
  if (this.type !== 'mic_out')
    throw new Error('send() should be called by mic_out');
  if (!this.socket)
    throw new Error('start() is required');

  if (Buffer.isBuffer(source)) {
    this.socket.write(source);
  } else if (source && source.pipe) {
    source.pipe(this.socket);
  }
};

exports.TurenAudio = TurenAudio;
