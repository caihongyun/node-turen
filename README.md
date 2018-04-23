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

Audio services is also to debug with TurenCore, we could pull audio streams from every
stage like AEC/BF/VAD.

You could use it as a socket handle:

```js
var audioStream = new TurenAudio('mic_in');
audioStream.on('data', (chunk) => {
  // got data
});
audioStream.readStart();
```

Streaming API also could use used:

```js
var writable = fs.createWriteStream('/path/to/your/file');
writable.pipe(audioStream);
```

#### Logger

You also could access to TurenCore's logs by `TurenLogger`:

```js
var TurenLogger = require('turen').client.TurenLogger;
var logger = new TurenLogger();
logger.on('data', (data) => {
  // receives the data
});
logger.readStart();
```

### License

MIT
