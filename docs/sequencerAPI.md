# Sequencer API

## General Overview
The sequencer API provides a standardized way to create, edit and play musical compositions using the webAudio API. The API is divided into two primary concerns: *Composition* and *Sonification*.

The *composition* section deals with the data representing an actual composition. This data is broken into two sections: *sequence data* and *playback data*. These are represented by the `Sequence` and `Mixer` objects respectively.

The *sonification* section deals with converting this data into actual sound and music. Everything to do with *sonification* is dealt with by the `Playback` Object.

Setters are used throughout this API to ensure that the various object properties are set to something valid. In the case they are not the API will try to coerce the value to something valid. If this fails it will throw an exception.

#### Hierarchy
- `Composition`
  - `Sequence`
  - `Mixer`
- `Playback`

## Composition
The `Composition` object holds all the sub-objects that make up a *composition* as well as some meta-data properties.

#### Properties
  - `title`
  - `tempo`
  - `tickResolution`
  - `tickAccent`
    - useful when rendering a view

#### Child Objects
  - `sequence`
  - `mixer`

#### Interface
  - `setTitle(newTitle): Void`
  - `setTempo(bpm): Void`
  - `setTickResolution(ticksPerBeat): Void`
  - `setTickAccent(ticksPerAccent): Void`
  - `createTrack(): Number`
    - `Track`s are stored in the `mixer`
  - `removeTrack(trackIdx): Number`

## Sequence Data

### Overview
The goal of the *sequence* section of the API is to provide methods to create a `Composition`. A `Composition` is an object that follows a defined structure and is made up of several other objects, each with their own structure. The `Composition` and each of its component parts have wrapper classes that provide various methods for creating and modifying data in specific ways.

#### Hierarchy
- `Sequence`
  - `PatternBank`
    - several `Pattern`s
      - 1 `Phrase` per `Track`
        - several `Note`s

### Sequence
The `Sequence` contains information on the overall structure of a composition. It has an ordered list of `Pattern#id`s. It provides an interface for changing the sequence of `Pattern`s in various ways. It also contains the *composition's* `PatternBank`. This approach to arrangement and sequencing is taken from the classic *Tracker* paradigm.

#### Properties
  - `loopPoint`

#### Child Objects
  - `patternSequence[<Number>]`
  - `patternBank`

#### Interface
  - `setLoopPoint(seqIdx): Void`
  - `getPatternAt(seqIdx): Pattern`
  - `removePatternAt(seqIdx): Pattern`
  - `setPatternAt(seqIdx, patternId)`: Void`
  - `insertPatternAt(seqIdx, patternId): Void`
  - `addNewPattern(): Pattern`
  - `addNewPatternAt(seqIdx): Pattern`
  - `clonePatternAt(seqIdx): Pattern`

### PatternBank
The `PatternBank` object contains a *composition's* `Pattern` objects. It provides the interface for creating, removing, annd managing `Patterns`.

#### Properties
NONE

#### Child Objects
  - `patterns[<Pattern>]`

#### Interface
  - `getPatternById(id): Pattern`
  - `createPattern(): Pattern`
  - `clonePattern(id): Pattern`
  - `deletePattern(id): Pattern`
  - `sortPatterns(): Void`

### Pattern
A pattern contains 1 `Phrase` object per `Track` in a *composition*. Its primary function is to make sure all of its child `Phrase`s keep their lengths in sync.

#### Properties
  - `id`
  - `length`

#### Child Objects
  - `phrases[<Phrase>]`

#### Interface
  - `setLength(newLength): Void`

### Phrase
A phrase contains an array of `Note` objects. It provides an interface for creating, removing, and modifying notes. The interface makes sure that notes don't overlap each other or the boundaries of the `Phrase`. The interface provided by `Phrase` is designed to work with a *Piano Roll* style view but it should work with any sort of linear musical editing interface.

#### Properties
NONE

#### Child Objects
  - `notes[<Note>]`

#### Interface
  - `addNote(noteParams): Note`
  - `removeNote(noteParams): Note`
  - `transposeNote(noteParams, pitch): Note`
  - `translateNote(noteParams, position): Note`
  - `resizeNote(noteParams, duration): Note`
  - `moveNoteTo(noteParams, pitch, position): Note`
  - `copyNoteTo(noteParams, pitch, position): Note`

### Note
The `Note` object is the basic unit of information in a *composition*. It is defined using a MIDI pitch value, and position/duration values in terms of `Pattern` ticks.

#### Properties
  - `pitch`
  - `position`
  - `duration`

#### Child Objects
NONE

#### Interface
NONE


## Playback Data

### Overview
The *playback data* section is responsible for managing how a composition should sound. It holds the synth definitions and channel configurations.

#### Hierarchy
  - `Mixer`
    - several `Track`s
      - `Synth`

### Mixer
The `Mixer` object holds the *playback data* for every track as well as the master volume parameters.

#### Properties
  - `masterVolume`
  - `muted`
  - `soloMode`

#### Child Objects
  - `tracks[<Track>]`

#### Interface
  - `setMasterVolume(volume): Void`
  - `setMute(Boolean): Void`
  - `setSoloMode(Boolean): Void`
  - `unMuteAllTracks(Boolean): Void`
  - `unSoloAllTracks(Boolean): Void`

### Track
The `Track` objects contain information describing how a particular set of *sequence data* should sound. This includes the synth-definition as well as level and spatialization information.

#### Properties
  - `name`
  - `volume`
  - `panning`
  - `muted`
  - `soloed`

#### Child Objects
  - `synth`

#### Interface
  - `setName(newName): Void`
  - `setVolume(volume): Void`
  - `setPanning(angle): Void`
  - `setMute(Boolean): Void`
  - `setSolo(Boolean): void`

### Synth
The `Synth` object contains data describing how a particular track should sound in terms of timbre and envelope.

#### Properties
  - `type`
  - `numVoices`
  - `attackTime`
  - `decayTime`
  - `sustainLevel`
  - `releaseRate`
  - `lfoRate`
  - `lfoDepth`
  - `lfoDelay`

#### Child Objects
NONE

#### Interface
  - `setType(waveform): Void`
  - `setNumVoices(num): Void`
  - `setAttackTime(time): Void`
  - `setDecayTime(time): Void`
  - `setSustainLevel(level): Void`
  - `setReleaseRate(rate): Void`
  - `setLfoRate(freq): Void`
  - `setLfoDepth(depth): Void`
  - `setLfoDelay(time): Void`

## Sonification

### Overview
The goal of the *sonification* section is to read through a composition and play the appropriate tones at the appropriate times.

#### Hierarchy
- `Playback`
  - `Transport`
  - 1 `SynthRunner` per `Track`
    - 1..6 `Voice`s for polyphonic phrases

### Playback
The `Playback` object is primarily a container for the sub-objects. It provides an interface for loading a `Composition`.

#### Properties
  - `composition`
NONE

#### Child Objects
  - `transport`
  - `synthRunners[<SynthRunner>]`

#### Interface
  - `loadComposition(composition): Void`

### Transport
The `Transport` object provides methods for reading through a composition at a specified tempo.

#### Properties
  - `playing`
  - `currentSeqIdx`
  - `patternTick`
  - `patternLooping`

#### Child Objects
NONE

#### Interface
  - `setPatternLooping(Boolean): Void`
  - `play(): Void`
  - `pause(): Void`
  - `stop(): Void`
  - `rewind(): Void`
  - `panic(): Void`
  - `setPosition(seqIdx, patternTick): Void`
  - `getPosition(): Array[seqIdx, patternTick]`

### SynthRunner
The `SynthRunner` object creates a webAudio synthesizer based on a track's `Synth` object. It contains an array of individual `Voice` objects for polyphinic playback.

#### Properties
  - synth

#### Child Objects
  - `voices[<Voice>]`

#### Interface
  - `loadSynth(synth): Void`
  - `noteStart(pitch): Number`
    - return idx of voice that note was started on
  - `noteEnd(voice): Void`
  - `scheduleNote(note): Number`
    - return idx of voice that note was scheduled on

### Voice
The only actual sound generating object in the whole API. The `Voice` should never need to be directly accessed by anything other than its parent `SynthRunner` object. All of its parameter access and functionality is mediated through the interface of `SynthRunner` and `Synth` objects.

#### Properties
NONE

#### Child Objects
NONE

#### Interface
NONE
