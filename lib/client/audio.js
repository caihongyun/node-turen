'use strict';

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
 */
function TurenAudio(type, connector) {
  this.type = type;
  this.connector = connector;
  this.connector.setPort(AudioOutputPorts[type]);
}

/**
 * @method readStart
 */
TurenAudio.prototype.readStart = function readStart() {
  return new Promise((resolve, reject) => {
    this.connector.connect(this.type, (err, socket) => {
      if (err) return reject(err);
      socket.write(cmdstr, () => {
        socket.end();
        resolve();
      });
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