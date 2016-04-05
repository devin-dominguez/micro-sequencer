var Shepherd = require('tether-shepherd');

var Tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-default',
  }
});

var defaultButtons = [
  {
    text: "Next",
    action: Tour.next
  },
  {
    text: "Last",
    action: Tour.back
  },
  {
    text: "Done",
    action: Tour.complete
  }
];

Tour.addStep('browser', {
  title: "Browse",
  text: "Browse and load compositions created by &#xb5;-seq users.",
  attachTo: ".browse-button bottom",
  buttons: [
    {
      text: "Next",
      action: Tour.next
    },
    {
      text: "Done",
      action: Tour.complete
    }
  ]
});

Tour.addStep('playback', {
  title: "Playback Controls",
  text: "Play, pause, and stop a composition.",
  attachTo: ".playback-buttons right",
  buttons: defaultButtons
});

Tour.addStep('tracks', {
  title: "Track List",
  text: "A composition can contain multiple simultaneous tracks.<br/>Click on a track to select it for editing.",
  attachTo: ".track-list right",
  buttons: defaultButtons
});

Tour.addStep('sound designer', {
  title: "Sound Designer",
  text: "Each track can have a unique sound.",
  attachTo: ".track-controls right",
  buttons: defaultButtons
});

Tour.addStep('piano', {
  title: "Piano",
  text: "Use the piano to preview a track's sound.",
  attachTo: ".keyboard right",
  buttons: defaultButtons
});

Tour.addStep('editor', {
  title: "Matrix Editor",
  text: "Double-click to add and remove notes.<br/>" +
    "Click and drag to move or resize notes.",
  attachTo: ".matrix center",
  buttons: defaultButtons
});

Tour.addStep('about', {
  title: "About",
  text: "For more info and detailed instructions click here.",
  attachTo: ".about-button bottom",
  buttons: [
    {
      text: "Last",
      action: Tour.back
    },
    {
      text: "Done",
      action: Tour.complete
    }
  ]
});


module.exports = Tour;

