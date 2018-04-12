'use strict';

var turen = require('../');
var SocketConnector = turen.connector.Socket;
var TurenRpc = turen.client.TurenRpc;
var TurenEvent = turen.client.TurenEvent;

process.on('unhandledRejection', (err) => {
  console.log(err && err.stack);
});

var rpc = new TurenRpc(null, {
  autoConnects: true,
});

rpc.makeCall('Restart',
  ['apigwws.open.rokid.com',
  443,
  '/api',
  'your device type id',
  'your account key',
  'your account secret',
  '0002111753000190']);

var eventClient = new TurenEvent();
eventClient.on('event', (event) => {
  console.log(event.type, {
    asr: event.asr,
    nlp: event.nlp,
    action: event.action,
  });
});
eventClient.start();