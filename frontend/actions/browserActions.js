var Dispatcher = require('../dispatcher/dispatcher');
var BrowserConstants = require('../constants/browserConstants');

function failure(errors) {
  var failureAction = {
    actionType: BrowserConstants.BROWSER_ERROR,
    errors: errors.responseJSON
  };
  Dispatcher.dispatch(failureAction);
}

module.exports = {
  receiveCompositions: function(ownCompositions) {
    var actionType = ownCompositions ?
      BrowserConstants.RECEIVE_OWN_COMPOSITIONS :
      BrowserConstants.RECEIVE_COMPOSITIONS;

    var ajaxOptions = {
      url: "api/compositions",
      type: "GET",
      data: {own_compositions: String(ownCompositions)},
      success: function(compositions) {
        var successAction = {
          actionType: actionType,
          compositions: compositions
        };
      Dispatcher.dispatch(successAction);
      },
      error: failure
    };

    $.ajax(ajaxOptions);
  },

  clearOwnCompositions: function() {
    Dispatcher.dispatch({
      actionType: BrowserConstants.CLEAR_OWN_COMPOSITIONS
    });
  },

  updateSearchString: function(newString) {
    Dispatcher.dispatch({
      actionType: BrowserConstants.UPDATE_SEARCH_STRING,
      newString: newString
    });
  },

  selectComposition: function(compositionId) {
    Dispatcher.dispatch({
      actionType: BrowserConstants.SELECT_COMPOSITION,
      compositionId: compositionId
    });
  }
};

