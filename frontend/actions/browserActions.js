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
    var ajaxOptions = {
      url: "api/compositions",
      type: "GET",
      data: {own_compositions: String(ownCompositions)},
      success: function(compositions) {
        var successAction = {
          actionType: BrowserConstants.RECEIVE_COMPOSITIONS,
          compositions: compositions
        };
      Dispatcher.dispatch(successAction);
      },
      error: failure
    };

    $.ajax(ajaxOptions);
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

