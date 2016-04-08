# &#xb5;-seq

[sequencer.dominguezaudio.com][seq-url]

[seq-url]: http://sequencer.dominguezaudio.com

&#xb5;-seq is a music sequencer web application built using _Ruby on Rails_, _React.js_, and the _WebAudio API_ and is designed using the _Flux_ architecture. &#xb5;-seq allows users to create, edit, and play musical compositions in their browser.


## Features
- Powerful [piano-roll](https://en.wikipedia.org/wiki/Piano_roll#In_digital_audio_workstations) style matrix editor.
  - Add and remove notes
  - Duplicate, resize, and reposition multiple notes at once
- Unlimited simultaneous tracks
  - You are only limited by your computing power
  - Each track can have its own unique sound
- Precise Playback System
  - Notes are played back with precise timing
  - Compositions can be edited in real time as they are being played
- Save your compositions to the database
  - You can save an load your own compositions
  - You can load other user's compositions and save your own versions
- Onscreen keyboard
  - Preview notes before adding them to your composition

### Matrix Editor

#### Visual Rendering
The matrix editor is implemented using a `<canvas>` element wrapped up in a _react_ component. A _flux_ store looks at which notes are present, which are selected, and where notes that are being dragged or moved will end up. It takes this information and calculates which cells need to be rendered and how they should be drawn. The _react_ component interprets this information and re-renders the `<canvas>` appropriately.

#### Events
Mouse events are handled by converting the cursor location from x and y pixels on the `<canvas>` to cell coordinates and then triggering the appropriate _flux_ event based on the state of the react component.

#### Note Data
Note data is stored in a Hash Map with each note's key being derived from its pitch and location in the matrix. I used the formula `note.pitch * composition.length + note.position` to give each note a distinct key. By deriving the key from the note's properties I am able to avoid any sort of iteration to find an individual note as well as the need for a cell to keep a reference to a specific note object. This way notes can be easily inserted and removed without needing to ensure that other objects have the appropriate references.

## Playback System

### Synthesis
Each track has its own synthesizer definition that determines various aspects of how its note's will sound. For each note a _voice_ object made up of several _WebAudio_ components is dynamically created. It plays its sound for the appropriate duration and is subsequently destroyed. By dynamically created voice objects we don't have to worry about any sort of complex voice allocation process or deal with the [voice stealing](http://electronicmusic.wikia.com/wiki/Voice_stealing) issues that are present in many polyphonic synthesizers.

### Timing
The playback system uses a sort of _just in time_ scheduling system which queues up notes for playback moments before they need to be heard. This ensures that only the minimum number of voice objects necessary for playback are ever present at any given time. Since notes are not scheduled until the very last moment, the user is able to edit the composition as it is being played and have their changes immediately take effect.

### Envelopes
One frustrating aspect of the _WebAudio API_ is how it handles audio rate parameter automation. It provides methods for transitioning a parameter from one value to another over a set period of time. The only problem is that if you cancel one of these methods before it reaches its destination value the parameter will reset back to the initial value. This makes it difficult to implement a standard [ADSR volume envelope](http://msp.ucsd.edu/techniques/v0.11/book-html/node59.html).

It is generally accepted that if a note is released before it enters its sustain phase that its volume will fade from its current value down to nothing. Since the _WebAudio API_ resets a parameters value whenever it is interrupted we run into some problems. If we were to release a note during its attack phase its volume would instantly reset to 0. If we were to release a note during its decay phase its volume would jump up to the maximum level.

To get around this problem I took advantage of a quirk of the _WebAudio API_'s `audioParam.setTargetAtTime` method. This allows you to set a parameter's target value and a constant rate at which it should exponentially approach that value. This also has the nice side effect of keeping the parameter at the current value even when the automation method gets interrupted. By using the simple formula `rate = (duration * 2) / 10` to get a rough estimate of which rate should yield the desired time duration, I was able to create a flexible ADSR style volume envelope.

The only downside is that the particular quirk that I am taking advantage of is only in the _Webkit_ implementation of the _WebAudio API_. It works great in _Chrome_, _Safari_, and _Opera_ but has some issues in _Firefox_.

## Upcoming Features
- Drag to select multiple notes
- Multi-pattern sequences
- Improved synthesizers
  - Filters
  - Modulation
  - Percussive Sounds
- Audio Effects
  - Delay
  - Reverberation
  - Spatialization
- Save and load from hard drive
- Audio rendering
- Parameter automation
