var React = require('react');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ConfirmationModal = require('../util/confirmationModal');
var History = require('react-router').hashHistory;
var SessionStore = require('../../stores/sessionStore');
var BrowserStore = require('../../stores/browserStore');
var CompositionActions = require('../../actions/compositionActions');

var SettingsForm = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function() {
    return {
      isLoggedIn: SessionStore.isLoggedIn(),
      isConfirmingSettings: false,
      isConfirmingDelete: false,
      length: EditorStore.phraseLength(),
      tpb: EditorStore.tpb(),
      hilite: EditorStore.hilite(),
      isPublic: EditorStore.isPublic()
    };
  },

  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    this.setState({
      isLoggedIn: SessionStore.isLoggedIn(),
      length: EditorStore.phraseLength(),
      tpb: EditorStore.tpb(),
      hilite: EditorStore.hilite(),
      isPublic: EditorStore.isPublic()
    });
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.setState({
      isConfirmingSettings: true
    });
  },

  onCancel: function(e) {
    e.preventDefault();
    History.replace("");
  },

  cancelSettings: function() {
    this.setState({
      isConfirmingSettings: false
    });
  },

  confirmSettings: function() {
    EditorActions.updateCompositionSettings({
      length: this.state.length,
      tpb: this.state.tpb,
      hilite: this.state.hilite,
      "public": this.state.isPublic
    });

    this.setState({
      isConfirmingSettings: false
    });

    History.replace("");
  },

  onClickDelete: function(e) {
    e.preventDefault();
    this.setState({
      isConfirmingDelete: true
    });
  },

  cancelDelete: function() {
    this.setState({
      isConfirmingDelete: false
    });
  },

  confirmDelete: function() {
    var compositionData = EditorStore.compositionData();
    if (BrowserStore.ownCompositions().some(function(composition) {
      return composition.title === compositionData.title;
    }, this)) {
      CompositionActions.deleteComposition(EditorStore.compositionData());
    }
    this.setState({
      isConfirmingDelete: false
    });
    History.replace("");
    CompositionActions.newComposition();
  },

  render: function() {
    var confirmationModalSettings = this.state.isConfirmingSettings ?
          (<ConfirmationModal
            message="Are you sure?"
            submessage="This is a potentially destructive action."
            yesCallback={this.confirmSettings}
            noCallback={this.cancelSettings}
          />) :
            null;

    var confirmationModalDelete = this.state.isConfirmingDelete ?
          (<ConfirmationModal
            message="Are you sure?"
            submessage="This is action can not be undone."
            yesCallback={this.confirmDelete}
            noCallback={this.cancelDelete}
          />) :
            null;
    return (
      <div className="settings-content">
        <h1>Settings</h1>
        <form className="settings-form"
          onSubmit={this.onSubmit}
        >
          <label>
            Length:
            <input
              type="number"
              valueLink={this.linkState("length")}
              min={16}
              max={1024}
            /></label>
          <label>
            Ticks-Per-Beat:
            <input
              type="number"
              valueLink={this.linkState("tpb")}
              min={1}
              max={32}
            /></label>
          <label>
            Highlight Every n Beats:
            <input
              type="number"
              valueLink={this.linkState("hilite")}
              min={1}
              max={32}
            /></label>
          {this.state.isLoggedIn ? (
            <label>
              Publicly Searchable:
              <input
                type="checkbox"
                checkedLink={this.linkState("isPublic")}
              /></label>
            ) : null}
          {this.state.isLoggedIn ? (
            <label>
              Delete Composition:
            <button className="button delete-button"
              onClick={this.onClickDelete}
            >Delete</button>
            </label>
           ) : null}
        <div className="modal-buttons">
            <input
              className="button"
              type="submit"
              value="Confirm"
            />
            <button
              className="button"
              onClick={this.onCancel}
            >Cancel</button>
          </div>
        </form>

        {confirmationModalSettings}
        {confirmationModalDelete}
      </div>
    );
  }

});

module.exports = SettingsForm;
