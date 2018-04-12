# node-turen

The Node.js client for TurenCore.

### Installation

```sh
$ npm install @rokid/turen --save
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

### License

MIT