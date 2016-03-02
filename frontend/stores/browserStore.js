var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var BrowserConstants = require('../constants/browserConstants');

var _compositions = [];
var _sortParam = "title";
var _searchString = "";
var _selectedId = -1;

var BrowserStore = new Store(Dispatcher);

BrowserStore.setSearch = function(str) {
  _searchString = str;
}

BrowserStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case BrowserConstants.RECEIVE_COMPOSITIONS:
      _compositions = payload.compositions;
      this.__emitChange();
      break;

    case BrowserConstants.UPDATE_SEARCH_STRING:
      _searchString = payload.newString;
      this.__emitChange();
      break;

    case BrowserConstants.SELECT_COMPOSITION:
      _selectedId = payload.compositionId;
      this.__emitChange();
      break;

    case BrowserConstants.BROWSER_ERROR:
      console.log(payload.errors);
      break;
  }
};

BrowserStore.searchString = function() {
  return _searchString.slice();
};

BrowserStore.selectedId = function() {
  return _selectedId;
};

BrowserStore.allCompositions = function() {
  var compositions = _compositions.slice();
  if (_searchString) {
    var searchString = _searchString.replace(/\s+/g, '').toLowerCase();
    var regExp = new RegExp(searchString.toLowerCase());
    compositions = compositions.filter(function(composition) {
      var item = composition[_sortParam].replace(/\s+/g, '').toLowerCase();
      return regExp.test(item);
    });
  }
  return compositions.sort(function(a, b) {
    return (a[_sortParam] < b[_sortParam]) ? -1 : 1;
  });
};

module.exports = BrowserStore;
