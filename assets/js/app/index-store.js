/*
var AppDispatcher = require('./index-flux');
var ShoeConstants = require('./xxx');
var EventEmitter = require('events').EventEmitter();
var merge = require('react/lib/merge');

var _shoes = {};

function loadShoes(data) {
  _shoes = data.shoes;
}

var ShoeStore = merge(EventEmitter.prototype, {
  getShoes: function() {
    return _shoes;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;
  switch(action.actionType) {
    case ShoeConstants.LOAD_SHOES:
      loadShoes(action.data);
      break;

    default:
      return true;
  }
  ShoeStore.emitChange();
  return true;
})

module.exports = ShoeStore;

ShoeStore.dispatcherIndex = AppDispatcher.register(function(payload) {
  console.log('register callback 1');
})

//console.log(AppDispatcher);

case 'BUY_SHOES':
  AppDispatcher.waitFor([
    ShoeStore.dispatcherIndex
  ], function() {
    CheckoutStore.purchaseShoes(ShoeStore.getSelectedShoes());
  })
  */