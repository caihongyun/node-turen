'use strict';

module.exports = {
  connector: {
    Base          : require('./connector/base').TurenConnector,
    Socket        : require('./connector/socket').SocketConnector,
  },
  client: {
    TurenRpc      : require('./client/rpc').TurenRpc,
    TurenAudio    : require('./client/audio').TurenAudio,
    TurenEvent    : require('./client/event').TurenEvent,
    TurenCommand  : require('./client/cmd').TurenCommand,
  },
  TurenSpeech     : require('./speech').TurenSpeech,
};
