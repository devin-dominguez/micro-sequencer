var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var BrowserConstants = require('../constants/browserConstants');

var _compositions = [];
var _ownCompositions = [];

var _sortParam = "title";
var _searchString = "";
var _selectedId = -1;

function _filterCompositions(compositions) {
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
}

var BrowserStore = new Store(Dispatcher);

BrowserStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case BrowserConstants.RECEIVE_COMPOSITIONS:
      _compositions = payload.compositions;
      this.__emitChange();
      break;

    case BrowserConstants.CLEAR_OWN_COMPOSITIONS:
      _ownCompositions = [];
      this.__emitChange();
      break;

    case BrowserConstants.RECEIVE_OWN_COMPOSITIONS:
      _ownCompositions = payload.compositions;
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
  return _filterCompositions(compositions);
};

BrowserStore.ownCompositions = function() {
  var compositions = _ownCompositions.map(function(composition) {
    return  {
      title: composition.title,
      id: composition.id
    };
  });
  return _filterCompositions(compositions);
};

module.exports = BrowserStore;
