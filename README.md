# &#xb5;-seq

[sequencer.dominguezaudio.com][seq-url]

[seq-url]: http://sequencer.dominguezaudio.com

## Minimum Viable Product

&#xb5;-seq is a music sequencer web application built using Ruby on Rails and React.js. &#xb5;-seq allows users to:

<!-- This is a Markdown checklist. Use it to keep track of your
progress. Put an x between the brackets for a checkmark: [x] -->

- [x] Create an account
- [ ] Log in / Log out
- [ ] Create, play, edit, and delete musical compositions
- [ ] Browse other user's compositions
- [ ] Tag compositions with multiple tags
- [ ] Maintain a list of favorite compositions

## Design Docs
* [View Wireframes][views]
* [React Components][components]
* [Flux Stores][stores]
* [API endpoints][api-endpoints]
* [DB schema][schema]
* [Sequencer API][seqApi]

[views]: ./docs/views.md
[components]: ./docs/components.md
[stores]: ./docs/stores.md
[api-endpoints]: ./docs/api-endpoints.md
[schema]: ./docs/schema.md
[seqApi]: ./docs/sequencerAPI.md

## Implementation Timeline

### Phase 1: Backend setup and User Authentication (0.5 days)

**Objective:** Functioning rails project with Authentication

- [ ] create new project
- [ ] create `User` model
- [ ] authentication
- [ ] user signup/signin pages
- [ ] blank landing page after signin

### Phase 2: Simple Composition CRUD (2.5 days)

**Objective:** Simple Compositions can be created, read, edited and destroyed through
the API.

- [ ] create `Composition` model
- [ ] CRUD API for Composition (`CompositionsController`)
- [ ] implement Sequencer API for single track/pattern/voice composition
- [ ] implement sequencer API for single channel playback
- [ ] test out API interactions in console

### Phase 3: Flux, Router, and Basic Views (1.5 days)

**Objective** Compositions can be edited using a piano-roll GUI.

- [ ] setup the flux loop with skeleton files
- [ ] setup the React Router
- [ ] create piano roll component
- [ ] create transport component
- [ ] create settings component

### Phase 4: Save and Load Compositions with GUI (0.5 days)

**Objective:** User's can save and load compositions from the DB using a GUI

- [ ] create the save and load modals, and appropriate flux loop

### Phase 5: Tags and Favorites(1 days)

**Objective:** Compositions can be tagged with multiple tags, and tags are searchable. Compositions can be favorited.

- [ ] create `Tag` model and join table
- [ ] create `Favorite` model and join table
- [ ] have tags show up in settings and in load components
- [ ] have favorites show up in load component

### Phase 6: Add multiple tracks (1 day)

**objective:** Add support for multiple tracks

- [ ] Implement multiple tracks in sequencer API
- [ ] Add trackIndex component

### Phase 7: Improve Synths (0.5 day)

**objective:** Improve sound quality

- [ ] Implement envelopes in synths
- [ ] Implement LFOs in synths
- [ ] Implement polyphony in synths

### Phase 8: Multiple Patterns and Pattern Sequencer (1.5 days)

**objective** Add support for multi-pattern sequences

- [ ] Implement appropriate parts of sequencer API
- [ ] Implement sequencer component

### Bonus Features (TBD)
- [ ] Multiple Synth Types
- [ ] Advanced editing functions
- [ ] Standalone player
- [ ] Render to wav or mp3
- [ ] Waveform view and spectogram
