var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;

var SessionConstants = require('../constants/sessionConstants');

var loggedIn = false;
var currentUser = {};
var errors = [];

var SessionStore = new Store(Dispatcher);

SessionStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case SessionConstants.NEW_USER:
    case SessionConstants.NEW_SESSION:
      loginUser(payload.user);
      this.__emitChange();
      break;

    case SessionConstants.CURRENT_USER:
      if (payload.user.nullUser) {
        logout();
      } else {
        loginUser(payload.user);
      }
      this.__emitChange();
      break;

    case SessionConstants.END_SESSION:
      logout();
      this.__emitChange();
      break;

    case SessionConstants.SESSION_ERROR:
      setErrors(payload.errors);
      this.__emitChange();
      break;

  }
};

SessionStore.isLoggedIn = function() {
  return loggedIn;
};

SessionStore.currentUser = function() {
  return JSON.parse(JSON.stringify(currentUser));
};

SessionStore.errors = function() {
  return errors.slice();
};

function setErrors(newErrors) {
  errors = newErrors;
}

function loginUser(user) {
  currentUser = user;
  loggedIn = true;
}

function logout() {
  currentUser = {};
  loggedIn = false;
}

module.exports = SessionStore;
