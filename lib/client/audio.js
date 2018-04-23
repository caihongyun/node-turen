'use strict';

var SocketConnector = require('../connector/socket').SocketConnector;
var AudioOutputPorts = {
  mic_in: 30002,
  bf_out: 30003,
  vad: 30004,
  speech_in: 30006,
  codec_in: 30007,
  aec_out: 30010,
};

/**
 * @class TurenAudio
 * @param {String} type
 * @param {String} connectorFn
 */
function TurenAudio(type, connectorFn) {
  connectorFn = connectorFn || () => new SocketConnector();
  this.type = type;
  this.connector = connectorFn();
  this.connector.setPort(AudioOutputPorts[type]);
}

/**
 * @method readStart
 */
TurenAudio.prototype.readStart = function readStart() {
  return new Promise((resolve, reject) => {
    this.connector.connect(this.type, (err, socket) => {
      if (err) return reject(err);
      resolve(socket);
    });
  });
};

/**
 * @method readStop
 */
TurenAudio.prototype.readStop = function readStop() {
  this.connector.destroy();
};

exports.TurenAudio = TurenAudio;
