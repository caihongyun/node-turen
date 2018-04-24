'use strict';

/**
 * @class TurenCommand
 * @param {TurenConnector} connector
 */
function TurenCommand(connector) {
  this.connector = connector;
  this.connector.setPort(30005);
}

/**
 * @method makeCall
 * @param {String} cmdstr - the command string
 */
TurenCommand.prototype.makeCall = function makeCall(cmdstr) {
  return new Promise((resolve, reject) => {
    this.connector.connect('sender', (err, socket) => {
      if (err) return reject(err);
      socket.write(cmdstr, () => {
        socket.end();
        resolve();
      });
    });
  });
};

/**
 * @method openMic
 */
TurenCommand.prototype.openMic = function openMic() {
  return this.makeCall('cutoffmicdata=true');
};

/**
 * @method closeMic
 */
TurenCommand.prototype.closeMic = function closeMic() {
  return this.makeCall('cutoffmicdata=false');
};

/**
 * @method pickup
 * @param {Boolean} val - if pickup
 */
TurenCommand.prototype.pickup = function pickup(val) {
  var str = val ? 'true' : 'false';
  return this.makeCall(`pickup=${str}`);
};

/**
 * @method reset
 */
TurenCommand.prototype.reset = function reset() {
  return this.makeCall('resetrdc');
};

/**
 * @method readyForAsr
 */
TurenCommand.prototype.readyForAsr = function readyForAsr() {
  return this.makeCall('resetbfvad');
};

/**
 * @method setAngle
 * @param {Number} deg - the degree
 */
TurenCommand.prototype.setAngle = function setAngle(deg) {
  return this.makeCall(`angle=${deg}`);
};

exports.TurenCommand = TurenCommand;
