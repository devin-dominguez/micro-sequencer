# Flux Stores

### CompositionsStore

Holds meta-information about compositions

#### Actions

- `recieveCompositions`

#### Listeners

- `CompositionsIndex`

### ActiveCompositionStore

Holds un-persisted composition data and wraps around editor portion of the sequencer API

#### Actions

- `recieveComposition`
- recievers to wrap all editor related sequencer API actions. See *sequencerAPI.md* for details

#### Listeners

- `CompositionInfoPanel`
- `Editor`
- `Transport`

### PlaybackStore

#### Actions

- recievers to wrap all playback related sequencer API actions. See *sequencerAPI.md* for details

#### Listeners

- `Transport`
