var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
}

module.exports = AppDispatcher;

ShoeStore.dispatcherIndex = AppDispatcher.register(function(payload){

});

case 'BUY_SHOES':
    AppDispatcher.waitFor([
        ShoeStore.dispatcherIndex
    ], function(){
        CheckoutStore.purchaseShoes(ShoesStore.getSelectedShoes());
    })