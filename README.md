# node-turen

The Node.js client for TurenCore.

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/turen.svg?style=flat-square
[npm-url]: https://npmjs.org/package/turen

### Installation

```sh
$ npm install turen --save
```

### Get Started

```js
var options = {
  host: 'apigwws.open.rokid.com',
  port: 443,
  key: 'rokid openplatform key',
  secret: 'rokid openplatform secret',
  deviceTypeId: 'rokid device type id',
  deviceId: 'rokid device id',
};
var speech = new TurenSpeech();
speech.on('voice coming', (event) => {
  // voice coming
});
speech.on('voice accept', (event) => {
  // voice accept
});
speech.on('asr end', (asr, event) => {
  // asr
});
speech.on('nlp', (response, event) => {
  // response.asr
  // response.nlp
  // response.action
});
speech.on('disconnect', (socketType/* event or rpc */) => {
  // got if some event is disconnected
});
speech.start(options);
```

### Services

TurenCore provides multiple socket-based services for different functionalities.

#### RPC

Rpc service is used to call method of TurenCore, which includes:

- `Restart()`
- `RestartWithoutArgs()`
- `Pickup()`
- `IsPickup()`
- `OpenMic()`
- `SetStack()`
- `SetSkillOption()`

#### CMD

Cmd service is used to call debug method which includes:

- `openMic()`
- `closeMic()`
- `pickup()`
- `reset()`
- `readyForAsr()`
- `setAngle(deg)`

#### Event

Event service is to be notified for all voice and nlp events, includes:

- `voice coming` returns the speech `energy` and direction `sl` when triggered locally.
- `voice local sleep` when sleep locally.
- `asr begin` when cloud speech recognition begins.
- `asr end` returns the final value `asr` when cloud speech recognition ends.
- `nlp` returns the `nlp` and `action` when NLP is done.

A complete events list is at [here](lib/events.json).

#### Audio

Audio service is also to debug with TurenCore, we could pull audio streams from every
stage like AEC/BF/VAD.

You could use it as a socket handle:

```js
var audioStream = new TurenAudio('mic_in');
audioStream.on('data', (chunk) => {
  // got data
});
audioStream.connect();
```

Streaming API also could use used:

```js
var writable = fs.createWriteStream('/path/to/your/file');
writable.pipe(audioStream);
```

Push audio data to TurenCore:

```js
var audioWritable = new TurenAudio('mic_out');
await audioWritable.connect();

// write a buffer
audioWritable.send(new Buffer(1024));
// write a readable stream
audioWritable.send(fs.createReadStream('/path/to/your/pcm/file'));
```

The available type values of `TurenAudio` is:

- `mic_in` as a `Readable` stream to pull the raw data, its format 
  depends on your micphone configuration.
- `bf_out` as a `Readable` stream to pull the pcm after BF.
- `bf4_out` as a `Readable` stream to pull the pcm after BF with selected 4 channels.
- `bf12_out` as a `Readable` stream to pull the pcm after BF with the full 12 channels.
- `aec_out` as a `Readable` stream to pull the pcm after AEC.
- `codec_in` as a `Readable` stream to pull the pcm before opu codec.
- `speech_in` as a `Readable` stream to pull the opu before uploading
  to cloud speech service.
- `mic_out` as a `Writable` stream to push raw data.

The following types are available only for our CTC model:

- `ctc.line_0` as a `Readable` stream to pull the pcm to the CTC line 0.
- `ctc.line_1` as a `Readable` stream to pull the pcm to the CTC line 1.
- `ctc.line_2` as a `Readable` stream to pull the pcm to the CTC line 2.
- `ctc.line_3` as a `Readable` stream to pull the pcm to the CTC line 3.

#### Logger

You also could access to TurenCore's logs by `TurenLogger`:

```js
var TurenLogger = require('turen').client.TurenLogger;
var logger = new TurenLogger();
logger.on('data', (data) => {
  // receives the data
});
logger.connect();
```

### License

MIT
