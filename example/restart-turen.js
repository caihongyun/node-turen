'use strict';

var TurenSpeech = require('../').TurenSpeech;
var config = require('/data/system/openvoice_profile.json');

process.on('unhandledRejection', (err) => {
  console.log(err && err.stack);
});

var options = {
  host: 'apigwws.open.rokid.com',
  port: 443,
  key: config.key,
  secret: config.secret,
  deviceTypeId: config.device_type_id,
  deviceId: config.device_id,
};
var speech = new TurenSpeech();
speech.on('asr end', (asr) => {
  console.log('asr >>>', asr);
});
speech.on('nlp', (res) => {
  console.log('res >>>', res);
});
// speech.on('raw event', (data) => {
//   // console.log(data.type, {
//   //   asr: data.asr,
//   //   nlp: data.nlp,
//   //   action: data.action,
//   // });
// });
speech.start(options);