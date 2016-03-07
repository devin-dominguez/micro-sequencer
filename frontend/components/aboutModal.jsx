var Modal = require('./util/modal');
var React = require('react');
var History = require('react-router').hashHistory;

var AboutModal = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    History.replace("");
  },

  render: function() {
    return (
      <Modal>
      <div className="about-content">
        <h1>About &#xb5;-seq</h1>
        <p>
        &#xb5;-seq is an online music composition tool that allows composers to create, edit, and listen to <em>chiptune</em> style compositions right in their browser.
        To get started click on the <span className="button">Browse</span> button in the upper right and select some music. An account is only necessary for saving a composition.
        Please be aware that due to incompatibilities in the implementation of the <em>webAudioAPI</em>, &#xb5;-seq is best experienced using <em>Chrome</em> or <em>Safari</em>.
        </p>

      <h1>Instructions</h1>
        <h3>Matrix Editor</h3>
        <ul>
          <li>Click on a key on the keyboard to preview a note</li>
          <li>Double-click on an empty cell to insert a note</li>
          <li>Double-click on a note to remove it</li>
          <li>Click on a cell to select it</li>
          <li>SHIFT-click on a cell to toggle its selection</li>
          <li>Drag a note to move it around the matrix</li>
          <li>Drag from the far right of a note to resize it</li>
          <li>CTRL-drag a note to duplicate it</li>
        </ul>
        <h3>Track Editor</h3>
        <ul>
          <li>Click on a track to switch to it in the matrix editor and Sound Designer</li>
          <li>Click on the <span className="button">+</span> to add a track</li>
          <li>Click on a track's <span className="button">x</span> to remove it</li>
          <li>Use a track's slider to adjust its volume</li>
        </ul>
        <h3>Sound Designer</h3>
        <ul>
         <li>Adjust a sound's volume envelope using the sliders</li>
         <li>Select a sound's waveform using the dropdown menu</li>
        </ul>
        <h3>Menus</h3>
        <ul>
         <li><span className="button">New</span> create a new composition</li>
         <li><span className="button">Save</span> save your composition if logged in</li>
         <li><span className="button">Load</span> load one of your compositions if logged in</li>
         <li><span className="button">Browse</span> load any publicly searchable composition.</li>
         <li><span className="button">Settings</span> adjust playback settings. Delete composition and control public status if logged in</li>
         <li><span className="button">About</span> bring up this window</li>
         <li><span className="button">Account</span> sign up or sign in</li>
        </ul>
      </div>
      <div className="about-buttons">
        <button className="button about-confirm"
          onClick={this.onClick}
        >Okay</button>
      </div>
      </Modal>
    );
  }

});

module.exports = AboutModal;
