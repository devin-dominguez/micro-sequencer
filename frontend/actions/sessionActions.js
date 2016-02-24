var Dispatcher = require('../dispatcher/dispatcher');
var SessionConstants = require('../constants/sessionConstants');

function failure(errors) {
  var failureAction = {
    actionType: SessionConstants.SESSION_ERROR,
    errors: errors.responseJSON
  };
  Dispatcher.dispatch(failureAction);
}

module.exports = {
  newUser: function(userData) {
    var ajaxOptions = {
      url: "api/users",
      type: "POST",
      data: {user: userData},
      success: function(user) {
        var successAction = {
          actionType: SessionConstants.NEW_USER,
          user: user
        };
      Dispatcher.dispatch(successAction);
      },
      error: failure
    };

    $.ajax(ajaxOptions);
  },

  newSession: function(userData) {
    var ajaxOptions = {
      url: "api/session",
      type: "POST",
      data: {user: userData},
      success: function(user) {
        var successAction = {
          actionType: SessionConstants.NEW_SESSION,
          user: user
        };
      Dispatcher.dispatch(successAction);
      },
      error: failure
    };

    $.ajax(ajaxOptions);
  },

  logout: function() {
    var ajaxOptions = {
      url: "api/session",
      type: "DELETE",
      success: function(user) {
        var successAction = {
          actionType: SessionConstants.END_SESSION,
          user: user
        };
      Dispatcher.dispatch(successAction);
      },
      error: failure
    };

    $.ajax(ajaxOptions);
  },

  recieveCurrentUser: function() {
    var ajaxOptions = {
      url: "api/session/current",
      type: "GET",
      success: function(user) {
        var successAction = {
          actionType: SessionConstants.CURRENT_USER,
          user: user
        };
      Dispatcher.dispatch(successAction);
      },
      error: failure
    };

    $.ajax(ajaxOptions);
  }


};
