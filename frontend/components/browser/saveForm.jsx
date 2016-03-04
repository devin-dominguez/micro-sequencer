var React = require('react');
var History = require('react-router').hashHistory;
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');
var BrowserStore = require('../../stores/browserStore');
var ConfirmationModal = require('../util/confirmationModal');

var SaveForm = React.createClass({
  getInitialState: function() {
    return {
      title: EditorStore.title(),
      isConfirming: false
    };
  },

  onChangeTitle: function(e) {
    e.preventDefault();
    this.setState({
      title: e.target.value
    });
  },

  cancelClick: function(e) {
    e.preventDefault();
    History.replace("");
  },

  saveSubmit: function(e) {
    e.preventDefault();
    if (this.state.title) {
      if (BrowserStore.ownCompositions().some(function(composition) {
        return composition.title === this.state.title;
      }, this)) {
        this.setState({
          isConfirming: true
        });
      } else {
        var compositionData = EditorStore.compositionData();
        compositionData.title = this.state.title;
        EditorActions.createComposition(compositionData);
        History.replace("");
      }
    }
  },

  confirmOverwrite: function(e) {
    e.preventDefault();
    var compositionData = EditorStore.compositionData();
    compositionData.title = this.state.title;
    EditorActions.updateComposition(compositionData, EditorStore.id());
    History.replace("");
  },

  cancelOverwrite: function(e) {
    e.preventDefault();
    this.setState({
      isConfirming: false
    });
  },

  render: function() {
    var saveButtonClass = this.state.title ? "" : " disabled";
    var overwriteModal = this.state.isConfirming ?
          (<ConfirmationModal
            message={this.state.title + " already exists."}
            submessage="Would you like to overwrite it?"
            yesCallback={this.confirmOverwrite}
            noCallback={this.cancelOverwrite}
          />) :
            null;

    return (
      <form className="save-form"
        onSubmit={this.saveSubmit}
      >
        <h2>Save</h2>
        <input type="text"
          value={this.state.title}
          onChange={this.onChangeTitle}
        />

        <div className="modal-buttons">
          <button className={"button" + saveButtonClass}
          >Save</button>
          <button className="button"
            onClick={this.cancelClick}
          >Cancel</button>
        </div>

        {overwriteModal}
      </form>
    );
  }

});

module.exports = SaveForm;
