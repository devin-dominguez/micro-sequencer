var Dispatcher = require('../dispatcher/dispatcher');
var CompositionConstants = require('../constants/compositionConstants');
var BrowserActions = require('../actions/browserActions');

module.exports = {
  loadComposition: function(compositionId) {
    var ajaxOptions = {
      url: "api/compositions/" +  compositionId,
      type: "GET",
      success: function(composition) {
        var successAction = {
          actionType: CompositionConstants.LOAD_COMPOSITION,
          composition: composition
        };
      Dispatcher.dispatch(successAction);
      }
    };

    $.ajax(ajaxOptions);
  },

  newComposition: function() {
    Dispatcher.dispatch({
      actionType: CompositionConstants.NEW_COMPOSITION
    });
  },

  createComposition: function(compositionData) {
    var ajaxOptions = {
      url: "api/compositions/",
      type: "POST",
      data: {composition: compositionData},
      success: function(composition) {
        var successAction = {
          actionType: CompositionConstants.CREATE_COMPOSITION,
          composition: composition
        };
        Dispatcher.dispatch(successAction);
        BrowserActions.receiveCompositions(true);
      }
    };

    $.ajax(ajaxOptions);
  },

  updateComposition: function(compositionData) {
    var ajaxOptions = {
      url: "api/compositions/",
      type: "PATCH",
      data: {composition: compositionData},
      success: function(composition) {
        var successAction = {
          actionType: CompositionConstants.UPDATE_COMPOSITION,
          composition: composition
        };
        Dispatcher.dispatch(successAction);
        BrowserActions.receiveCompositions(true);
      }
    };

    $.ajax(ajaxOptions);
  },

  deleteComposition: function(compositionData) {
    var ajaxOptions = {
      url: "api/compositions/",
      type: "DELETE",
      data: {composition: compositionData},
      success: function() {
        var successAction = {
          actionType: CompositionConstants.DELETE_COMPOSITION,
        };
        Dispatcher.dispatch(successAction);
        BrowserActions.receiveCompositions(true);
      }
    };

    $.ajax(ajaxOptions);
  },
};
