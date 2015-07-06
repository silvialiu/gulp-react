(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Reflux = require('reflux');
console.log(React);
var toggleGem = Reflux.createAction();
var gemStore = Reflux.createStore({
  init: function() {
    this.isGemActivated = false;
    this.listenTo(toggleGem, this.handleToggleGem);
  },
  handleToggleGem: function() {
    this.isGemActivated = !this.isGemActivated;
    this.trigger(this.isGemActivated);
  }
});
var Gem = React.createClass({
  displayName: "Gem",
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    this.unsubscribe = gemStore.listen(this.onGemChange);
  },
  componentWillUnmount: function() {
    this.unsubscribe();
  },
  onGemChange: function(gemStatus) {
    this.setState({gemStatus: gemStatus});
  },
  render: function() {
    var gemStatusStr = this.state.gemStatus ? "activated" : "deactivated";
    return (React.createElement("div", null, " gem is ", gemStatusStr));
  }
});
React.render(React.createElement(Gem, null), document.getElementById('result'));
toggleGem();


//# sourceURL=/Users/silvia/code_cj/gulp-new/assets/js/app/index-reflux.js
},{"reflux":2}],2:[function(require,module,exports){
module.exports = require('./src');

},{"./src":16}],3:[function(require,module,exports){
'use strict';

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  if (!this._events || !this._events[event]) return [];
  if (this._events[event].fn) return [this._events[event].fn];

  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
    ee[i] = this._events[event][i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  if (!this._events || !this._events[event]) return false;

  var listeners = this._events[event]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this);

  if (!this._events) this._events = {};
  if (!this._events[event]) this._events[event] = listener;
  else {
    if (!this._events[event].fn) this._events[event].push(listener);
    else this._events[event] = [
      this._events[event], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true);

  if (!this._events) this._events = {};
  if (!this._events[event]) this._events[event] = listener;
  else {
    if (!this._events[event].fn) this._events[event].push(listener);
    else this._events[event] = [
      this._events[event], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
  if (!this._events || !this._events[event]) return this;

  var listeners = this._events[event]
    , events = [];

  if (fn) {
    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
      events.push(listeners);
    }
    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
        events.push(listeners[i]);
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[event] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[event];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[event];
  else this._events = {};

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the module.
//
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.EventEmitter2 = EventEmitter;
EventEmitter.EventEmitter3 = EventEmitter;

//
// Expose the module.
//
module.exports = EventEmitter;

},{}],4:[function(require,module,exports){
(function (global){
/*! Native Promise Only
    v0.7.6-a (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
!function(t,n,e){n[t]=n[t]||e(),"undefined"!=typeof module&&module.exports?module.exports=n[t]:"function"==typeof define&&define.amd&&define(function(){return n[t]})}("Promise","undefined"!=typeof global?global:this,function(){"use strict";function t(t,n){l.add(t,n),h||(h=y(l.drain))}function n(t){var n,e=typeof t;return null==t||"object"!=e&&"function"!=e||(n=t.then),"function"==typeof n?n:!1}function e(){for(var t=0;t<this.chain.length;t++)o(this,1===this.state?this.chain[t].success:this.chain[t].failure,this.chain[t]);this.chain.length=0}function o(t,e,o){var r,i;try{e===!1?o.reject(t.msg):(r=e===!0?t.msg:e.call(void 0,t.msg),r===o.promise?o.reject(TypeError("Promise-chain cycle")):(i=n(r))?i.call(r,o.resolve,o.reject):o.resolve(r))}catch(c){o.reject(c)}}function r(o){var c,u,a=this;if(!a.triggered){a.triggered=!0,a.def&&(a=a.def);try{(c=n(o))?(u=new f(a),c.call(o,function(){r.apply(u,arguments)},function(){i.apply(u,arguments)})):(a.msg=o,a.state=1,a.chain.length>0&&t(e,a))}catch(s){i.call(u||new f(a),s)}}}function i(n){var o=this;o.triggered||(o.triggered=!0,o.def&&(o=o.def),o.msg=n,o.state=2,o.chain.length>0&&t(e,o))}function c(t,n,e,o){for(var r=0;r<n.length;r++)!function(r){t.resolve(n[r]).then(function(t){e(r,t)},o)}(r)}function f(t){this.def=t,this.triggered=!1}function u(t){this.promise=t,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0}function a(n){if("function"!=typeof n)throw TypeError("Not a function");if(0!==this.__NPO__)throw TypeError("Not a promise");this.__NPO__=1;var o=new u(this);this.then=function(n,r){var i={success:"function"==typeof n?n:!0,failure:"function"==typeof r?r:!1};return i.promise=new this.constructor(function(t,n){if("function"!=typeof t||"function"!=typeof n)throw TypeError("Not a function");i.resolve=t,i.reject=n}),o.chain.push(i),0!==o.state&&t(e,o),i.promise},this["catch"]=function(t){return this.then(void 0,t)};try{n.call(void 0,function(t){r.call(o,t)},function(t){i.call(o,t)})}catch(c){i.call(o,c)}}var s,h,l,p=Object.prototype.toString,y="undefined"!=typeof setImmediate?function(t){return setImmediate(t)}:setTimeout;try{Object.defineProperty({},"x",{}),s=function(t,n,e,o){return Object.defineProperty(t,n,{value:e,writable:!0,configurable:o!==!1})}}catch(d){s=function(t,n,e){return t[n]=e,t}}l=function(){function t(t,n){this.fn=t,this.self=n,this.next=void 0}var n,e,o;return{add:function(r,i){o=new t(r,i),e?e.next=o:n=o,e=o,o=void 0},drain:function(){var t=n;for(n=e=h=void 0;t;)t.fn.call(t.self),t=t.next}}}();var g=s({},"constructor",a,!1);return s(a,"prototype",g,!1),s(g,"__NPO__",0,!1),s(a,"resolve",function(t){var n=this;return t&&"object"==typeof t&&1===t.__NPO__?t:new n(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");n(t)})}),s(a,"reject",function(t){return new this(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");e(t)})}),s(a,"all",function(t){var n=this;return"[object Array]"!=p.call(t)?n.reject(TypeError("Not an array")):0===t.length?n.resolve([]):new n(function(e,o){if("function"!=typeof e||"function"!=typeof o)throw TypeError("Not a function");var r=t.length,i=Array(r),f=0;c(n,t,function(t,n){i[t]=n,++f===r&&e(i)},o)})}),s(a,"race",function(t){var n=this;return"[object Array]"!=p.call(t)?n.reject(TypeError("Not an array")):new n(function(e,o){if("function"!=typeof e||"function"!=typeof o)throw TypeError("Not a function");c(n,t,function(t,n){e(n)},o)})}),a});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
/**
 * A module of methods that you want to include in all actions.
 * This module is consumed by `createAction`.
 */
module.exports = {
};

},{}],6:[function(require,module,exports){
exports.createdStores = [];

exports.createdActions = [];

exports.reset = function() {
    while(exports.createdStores.length) {
        exports.createdStores.pop();
    }
    while(exports.createdActions.length) {
        exports.createdActions.pop();
    }
};

},{}],7:[function(require,module,exports){
var _ = require('./utils'),
    maker = require('./joins').instanceJoinCreator;

/**
 * Extract child listenables from a parent from their
 * children property and return them in a keyed Object
 *
 * @param {Object} listenable The parent listenable
 */
var mapChildListenables = function(listenable) {
    var i = 0, children = {}, childName;
    for (;i < (listenable.children||[]).length; ++i) {
        childName = listenable.children[i];
        if(listenable[childName]){
            children[childName] = listenable[childName];
        }
    }
    return children;
};

/**
 * Make a flat dictionary of all listenables including their
 * possible children (recursively), concatenating names in camelCase.
 *
 * @param {Object} listenables The top-level listenables
 */
var flattenListenables = function(listenables) {
    var flattened = {};
    for(var key in listenables){
        var listenable = listenables[key];
        var childMap = mapChildListenables(listenable);

        // recursively flatten children
        var children = flattenListenables(childMap);

        // add the primary listenable and chilren
        flattened[key] = listenable;
        for(var childKey in children){
            var childListenable = children[childKey];
            flattened[key + _.capitalize(childKey)] = childListenable;
        }
    }

    return flattened;
};

/**
 * A module of methods related to listening.
 */
module.exports = {

    /**
     * An internal utility function used by `validateListening`
     *
     * @param {Action|Store} listenable The listenable we want to search for
     * @returns {Boolean} The result of a recursive search among `this.subscriptions`
     */
    hasListener: function(listenable) {
        var i = 0, j, listener, listenables;
        for (;i < (this.subscriptions||[]).length; ++i) {
            listenables = [].concat(this.subscriptions[i].listenable);
            for (j = 0; j < listenables.length; j++){
                listener = listenables[j];
                if (listener === listenable || listener.hasListener && listener.hasListener(listenable)) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * A convenience method that listens to all listenables in the given object.
     *
     * @param {Object} listenables An object of listenables. Keys will be used as callback method names.
     */
    listenToMany: function(listenables){
        var allListenables = flattenListenables(listenables);
        for(var key in allListenables){
            var cbname = _.callbackName(key),
                localname = this[cbname] ? cbname : this[key] ? key : undefined;
            if (localname){
                this.listenTo(allListenables[key],localname,this[cbname+"Default"]||this[localname+"Default"]||localname);
            }
        }
    },

    /**
     * Checks if the current context can listen to the supplied listenable
     *
     * @param {Action|Store} listenable An Action or Store that should be
     *  listened to.
     * @returns {String|Undefined} An error message, or undefined if there was no problem.
     */
    validateListening: function(listenable){
        if (listenable === this) {
            return "Listener is not able to listen to itself";
        }
        if (!_.isFunction(listenable.listen)) {
            return listenable + " is missing a listen method";
        }
        if (listenable.hasListener && listenable.hasListener(this)) {
            return "Listener cannot listen to this listenable because of circular loop";
        }
    },

    /**
     * Sets up a subscription to the given listenable for the context object
     *
     * @param {Action|Store} listenable An Action or Store that should be
     *  listened to.
     * @param {Function|String} callback The callback to register as event handler
     * @param {Function|String} defaultCallback The callback to register as default handler
     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is the object being listened to
     */
    listenTo: function(listenable, callback, defaultCallback) {
        var desub, unsubscriber, subscriptionobj, subs = this.subscriptions = this.subscriptions || [];
        _.throwIf(this.validateListening(listenable));
        this.fetchInitialState(listenable, defaultCallback);
        desub = listenable.listen(this[callback]||callback, this);
        unsubscriber = function() {
            var index = subs.indexOf(subscriptionobj);
            _.throwIf(index === -1,'Tried to remove listen already gone from subscriptions list!');
            subs.splice(index, 1);
            desub();
        };
        subscriptionobj = {
            stop: unsubscriber,
            listenable: listenable
        };
        subs.push(subscriptionobj);
        return subscriptionobj;
    },

    /**
     * Stops listening to a single listenable
     *
     * @param {Action|Store} listenable The action or store we no longer want to listen to
     * @returns {Boolean} True if a subscription was found and removed, otherwise false.
     */
    stopListeningTo: function(listenable){
        var sub, i = 0, subs = this.subscriptions || [];
        for(;i < subs.length; i++){
            sub = subs[i];
            if (sub.listenable === listenable){
                sub.stop();
                _.throwIf(subs.indexOf(sub)!==-1,'Failed to remove listen from subscriptions list!');
                return true;
            }
        }
        return false;
    },

    /**
     * Stops all subscriptions and empties subscriptions array
     */
    stopListeningToAll: function(){
        var remaining, subs = this.subscriptions || [];
        while((remaining=subs.length)){
            subs[0].stop();
            _.throwIf(subs.length!==remaining-1,'Failed to remove listen from subscriptions list!');
        }
    },

    /**
     * Used in `listenTo`. Fetches initial data from a publisher if it has a `getInitialState` method.
     * @param {Action|Store} listenable The publisher we want to get initial state from
     * @param {Function|String} defaultCallback The method to receive the data
     */
    fetchInitialState: function (listenable, defaultCallback) {
        defaultCallback = (defaultCallback && this[defaultCallback]) || defaultCallback;
        var me = this;
        if (_.isFunction(defaultCallback) && _.isFunction(listenable.getInitialState)) {
            var data = listenable.getInitialState();
            if (data && _.isFunction(data.then)) {
                data.then(function() {
                    defaultCallback.apply(me, arguments);
                });
            } else {
                defaultCallback.call(this, data);
            }
        }
    },

    /**
     * The callback will be called once all listenables have triggered at least once.
     * It will be invoked with the last emission from each listenable.
     * @param {...Publishers} publishers Publishers that should be tracked.
     * @param {Function|String} callback The method to call when all publishers have emitted
     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
     */
    joinTrailing: maker("last"),

    /**
     * The callback will be called once all listenables have triggered at least once.
     * It will be invoked with the first emission from each listenable.
     * @param {...Publishers} publishers Publishers that should be tracked.
     * @param {Function|String} callback The method to call when all publishers have emitted
     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
     */
    joinLeading: maker("first"),

    /**
     * The callback will be called once all listenables have triggered at least once.
     * It will be invoked with all emission from each listenable.
     * @param {...Publishers} publishers Publishers that should be tracked.
     * @param {Function|String} callback The method to call when all publishers have emitted
     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
     */
    joinConcat: maker("all"),

    /**
     * The callback will be called once all listenables have triggered.
     * If a callback triggers twice before that happens, an error is thrown.
     * @param {...Publishers} publishers Publishers that should be tracked.
     * @param {Function|String} callback The method to call when all publishers have emitted
     * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
     */
    joinStrict: maker("strict")
};

},{"./joins":17,"./utils":21}],8:[function(require,module,exports){
var _ = require('./utils'),
    ListenerMethods = require('./ListenerMethods');

/**
 * A module meant to be consumed as a mixin by a React component. Supplies the methods from
 * `ListenerMethods` mixin and takes care of teardown of subscriptions.
 * Note that if you're using the `connect` mixin you don't need this mixin, as connect will
 * import everything this mixin contains!
 */
module.exports = _.extend({

    /**
     * Cleans up all listener previously registered.
     */
    componentWillUnmount: ListenerMethods.stopListeningToAll

}, ListenerMethods);

},{"./ListenerMethods":7,"./utils":21}],9:[function(require,module,exports){
var _ = require('./utils');

/**
 * A module of methods for object that you want to be able to listen to.
 * This module is consumed by `createStore` and `createAction`
 */
module.exports = {

    /**
     * Hook used by the publisher that is invoked before emitting
     * and before `shouldEmit`. The arguments are the ones that the action
     * is invoked with. If this function returns something other than
     * undefined, that will be passed on as arguments for shouldEmit and
     * emission.
     */
    preEmit: function() {},

    /**
     * Hook used by the publisher after `preEmit` to determine if the
     * event should be emitted with given arguments. This may be overridden
     * in your application, default implementation always returns true.
     *
     * @returns {Boolean} true if event should be emitted
     */
    shouldEmit: function() { return true; },

    /**
     * Subscribes the given callback for action triggered
     *
     * @param {Function} callback The callback to register as event handler
     * @param {Mixed} [optional] bindContext The context to bind the callback with
     * @returns {Function} Callback that unsubscribes the registered event handler
     */
    listen: function(callback, bindContext) {
        bindContext = bindContext || this;
        var eventHandler = function(args) {
            if (aborted){
                return;
            }
            callback.apply(bindContext, args);
        }, me = this, aborted = false;
        this.emitter.addListener(this.eventLabel, eventHandler);
        return function() {
            aborted = true;
            me.emitter.removeListener(me.eventLabel, eventHandler);
        };
    },

    /**
     * Attach handlers to promise that trigger the completed and failed
     * child publishers, if available.
     *
     * @param {Object} The promise to attach to
     */
    promise: function(promise) {
        var me = this;

        var canHandlePromise =
            this.children.indexOf('completed') >= 0 &&
            this.children.indexOf('failed') >= 0;

        if (!canHandlePromise){
            throw new Error('Publisher must have "completed" and "failed" child publishers');
        }

        promise.then(function(response) {
            return me.completed(response);
        }, function(error) {
            return me.failed(error);
        });
    },

    /**
     * Subscribes the given callback for action triggered, which should
     * return a promise that in turn is passed to `this.promise`
     *
     * @param {Function} callback The callback to register as event handler
     */
    listenAndPromise: function(callback, bindContext) {
        var me = this;
        bindContext = bindContext || this;
        this.willCallPromise = (this.willCallPromise || 0) + 1;

        var removeListen = this.listen(function() {

            if (!callback) {
                throw new Error('Expected a function returning a promise but got ' + callback);
            }

            var args = arguments,
                promise = callback.apply(bindContext, args);
            return me.promise.call(me, promise);
        }, bindContext);

        return function () {
          me.willCallPromise--;
          removeListen.call(me);
        };

    },

    /**
     * Publishes an event using `this.emitter` (if `shouldEmit` agrees)
     */
    trigger: function() {
        var args = arguments,
            pre = this.preEmit.apply(this, args);
        args = pre === undefined ? args : _.isArguments(pre) ? pre : [].concat(pre);
        if (this.shouldEmit.apply(this, args)) {
            this.emitter.emit(this.eventLabel, args);
        }
    },

    /**
     * Tries to publish the event on the next tick
     */
    triggerAsync: function(){
        var args = arguments,me = this;
        _.nextTick(function() {
            me.trigger.apply(me, args);
        });
    },

    /**
     * Returns a Promise for the triggered action
     *
     * @return {Promise}
     *   Resolved by completed child action.
     *   Rejected by failed child action.
     *   If listenAndPromise'd, then promise associated to this trigger.
     *   Otherwise, the promise is for next child action completion.
     */
    triggerPromise: function(){
        var me = this;
        var args = arguments;

        var canHandlePromise =
            this.children.indexOf('completed') >= 0 &&
            this.children.indexOf('failed') >= 0;

        var promise = _.createPromise(function(resolve, reject) {
            // If `listenAndPromise` is listening
            // patch `promise` w/ context-loaded resolve/reject
            if (me.willCallPromise) {
                _.nextTick(function() {
                    var old_promise_method = me.promise;
                    me.promise = function (promise) {
                        promise.then(resolve, reject);
                        // Back to your regularly schedule programming.
                        me.promise = old_promise_method;
                        return me.promise.apply(me, arguments);
                    };
                    me.trigger.apply(me, args);
                });
                return;
            }

            if (canHandlePromise) {
                var removeSuccess = me.completed.listen(function(args) {
                    removeSuccess();
                    removeFailed();
                    resolve(args);
                });

                var removeFailed = me.failed.listen(function(args) {
                    removeSuccess();
                    removeFailed();
                    reject(args);
                });
            }

            me.triggerAsync.apply(me, args);

            if (!canHandlePromise) {
                resolve();
            }
        });

        return promise;
    }
};

},{"./utils":21}],10:[function(require,module,exports){
/**
 * A module of methods that you want to include in all stores.
 * This module is consumed by `createStore`.
 */
module.exports = {
};

},{}],11:[function(require,module,exports){
module.exports = function(store, definition) {
  for (var name in definition) {
    if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(definition, name);

        if (!propertyDescriptor.value || typeof propertyDescriptor.value !== 'function' || !definition.hasOwnProperty(name)) {
            continue;
        }

        store[name] = definition[name].bind(store);
    } else {
        var property = definition[name];

        if (typeof property !== 'function' || !definition.hasOwnProperty(name)) {
            continue;
        }

        store[name] = property.bind(store);
    }
  }

  return store;
};

},{}],12:[function(require,module,exports){
var Reflux = require('./index'),
    _ = require('./utils');

module.exports = function(listenable,key){
    return {
        getInitialState: function(){
            if (!_.isFunction(listenable.getInitialState)) {
                return {};
            } else if (key === undefined) {
                return listenable.getInitialState();
            } else {
                return _.object([key],[listenable.getInitialState()]);
            }
        },
        componentDidMount: function(){
            _.extend(this,Reflux.ListenerMethods);
            var me = this, cb = (key === undefined ? this.setState : function(v){me.setState(_.object([key],[v]));});
            this.listenTo(listenable,cb);
        },
        componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
    };
};

},{"./index":16,"./utils":21}],13:[function(require,module,exports){
var Reflux = require('./index'),
  _ = require('./utils');

module.exports = function(listenable, key, filterFunc) {
    filterFunc = _.isFunction(key) ? key : filterFunc;
    return {
        getInitialState: function() {
            if (!_.isFunction(listenable.getInitialState)) {
                return {};
            } else if (_.isFunction(key)) {
                return filterFunc.call(this, listenable.getInitialState());
            } else {
                // Filter initial payload from store.
                var result = filterFunc.call(this, listenable.getInitialState());
                if (result) {
                  return _.object([key], [result]);
                } else {
                  return {};
                }
            }
        },
        componentDidMount: function() {
            _.extend(this, Reflux.ListenerMethods);
            var me = this;
            var cb = function(value) {
                if (_.isFunction(key)) {
                    me.setState(filterFunc.call(me, value));
                } else {
                    var result = filterFunc.call(me, value);
                    me.setState(_.object([key], [result]));
                }
            };

            this.listenTo(listenable, cb);
        },
        componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
    };
};


},{"./index":16,"./utils":21}],14:[function(require,module,exports){
var _ = require('./utils'),
    Reflux = require('./index'),
    Keep = require('./Keep'),
    allowed = {preEmit:1,shouldEmit:1};

/**
 * Creates an action functor object. It is mixed in with functions
 * from the `PublisherMethods` mixin. `preEmit` and `shouldEmit` may
 * be overridden in the definition object.
 *
 * @param {Object} definition The action object definition
 */
var createAction = function(definition) {

    definition = definition || {};
    if (!_.isObject(definition)){
        definition = {actionName: definition};
    }

    for(var a in Reflux.ActionMethods){
        if (!allowed[a] && Reflux.PublisherMethods[a]) {
            throw new Error("Cannot override API method " + a +
                " in Reflux.ActionMethods. Use another method name or override it on Reflux.PublisherMethods instead."
            );
        }
    }

    for(var d in definition){
        if (!allowed[d] && Reflux.PublisherMethods[d]) {
            throw new Error("Cannot override API method " + d +
                " in action creation. Use another method name or override it on Reflux.PublisherMethods instead."
            );
        }
    }

    definition.children = definition.children || [];
    if (definition.asyncResult){
        definition.children = definition.children.concat(["completed","failed"]);
    }

    var i = 0, childActions = {};
    for (; i < definition.children.length; i++) {
        var name = definition.children[i];
        childActions[name] = createAction(name);
    }

    var context = _.extend({
        eventLabel: "action",
        emitter: new _.EventEmitter(),
        _isAction: true
    }, Reflux.PublisherMethods, Reflux.ActionMethods, definition);

    var functor = function() {
        return functor[functor.sync?"trigger":"triggerPromise"].apply(functor, arguments);
    };

    _.extend(functor,childActions,context);

    Keep.createdActions.push(functor);

    return functor;

};

module.exports = createAction;

},{"./Keep":6,"./index":16,"./utils":21}],15:[function(require,module,exports){
var _ = require('./utils'),
    Reflux = require('./index'),
    Keep = require('./Keep'),
    mixer = require('./mixer'),
    allowed = {preEmit:1,shouldEmit:1},
    bindMethods = require('./bindMethods');

/**
 * Creates an event emitting Data Store. It is mixed in with functions
 * from the `ListenerMethods` and `PublisherMethods` mixins. `preEmit`
 * and `shouldEmit` may be overridden in the definition object.
 *
 * @param {Object} definition The data store object definition
 * @returns {Store} A data store instance
 */
module.exports = function(definition) {

    definition = definition || {};

    for(var a in Reflux.StoreMethods){
        if (!allowed[a] && (Reflux.PublisherMethods[a] || Reflux.ListenerMethods[a])){
            throw new Error("Cannot override API method " + a +
                " in Reflux.StoreMethods. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead."
            );
        }
    }

    for(var d in definition){
        if (!allowed[d] && (Reflux.PublisherMethods[d] || Reflux.ListenerMethods[d])){
            throw new Error("Cannot override API method " + d +
                " in store creation. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead."
            );
        }
    }

    definition = mixer(definition);

    function Store() {
        var i=0, arr;
        this.subscriptions = [];
        this.emitter = new _.EventEmitter();
        this.eventLabel = "change";
        bindMethods(this, definition);
        if (this.init && _.isFunction(this.init)) {
            this.init();
        }
        if (this.listenables){
            arr = [].concat(this.listenables);
            for(;i < arr.length;i++){
                this.listenToMany(arr[i]);
            }
        }
    }

    _.extend(Store.prototype, Reflux.ListenerMethods, Reflux.PublisherMethods, Reflux.StoreMethods, definition);

    var store = new Store();
    Keep.createdStores.push(store);

    return store;
};

},{"./Keep":6,"./bindMethods":11,"./index":16,"./mixer":20,"./utils":21}],16:[function(require,module,exports){
exports.ActionMethods = require('./ActionMethods');

exports.ListenerMethods = require('./ListenerMethods');

exports.PublisherMethods = require('./PublisherMethods');

exports.StoreMethods = require('./StoreMethods');

exports.createAction = require('./createAction');

exports.createStore = require('./createStore');

exports.connect = require('./connect');

exports.connectFilter = require('./connectFilter');

exports.ListenerMixin = require('./ListenerMixin');

exports.listenTo = require('./listenTo');

exports.listenToMany = require('./listenToMany');


var maker = require('./joins').staticJoinCreator;

exports.joinTrailing = exports.all = maker("last"); // Reflux.all alias for backward compatibility

exports.joinLeading = maker("first");

exports.joinStrict = maker("strict");

exports.joinConcat = maker("all");

var _ = require('./utils');

exports.EventEmitter = _.EventEmitter;

exports.Promise = _.Promise;

/**
 * Convenience function for creating a set of actions
 *
 * @param definitions the definitions for the actions to be created
 * @returns an object with actions of corresponding action names
 */
exports.createActions = function(definitions) {
    var actions = {};
    for (var k in definitions){
        if (definitions.hasOwnProperty(k)) {
            var val = definitions[k],
                actionName = _.isObject(val) ? k : val;

            actions[actionName] = exports.createAction(val);
        }
    }
    return actions;
};

/**
 * Sets the eventmitter that Reflux uses
 */
exports.setEventEmitter = function(ctx) {
    var _ = require('./utils');
    exports.EventEmitter = _.EventEmitter = ctx;
};


/**
 * Sets the Promise library that Reflux uses
 */
exports.setPromise = function(ctx) {
    var _ = require('./utils');
    exports.Promise = _.Promise = ctx;
};


/**
 * Sets the Promise factory that creates new promises
 * @param {Function} factory has the signature `function(resolver) { return [new Promise]; }`
 */
exports.setPromiseFactory = function(factory) {
    var _ = require('./utils');
    _.createPromise = factory;
};


/**
 * Sets the method used for deferring actions and stores
 */
exports.nextTick = function(nextTick) {
    var _ = require('./utils');
    _.nextTick = nextTick;
};

/**
 * Provides the set of created actions and stores for introspection
 */
exports.__keep = require('./Keep');

/**
 * Warn if Function.prototype.bind not available
 */
if (!Function.prototype.bind) {
  console.error(
    'Function.prototype.bind not available. ' +
    'ES5 shim required. ' +
    'https://github.com/spoike/refluxjs#es5'
  );
}

},{"./ActionMethods":5,"./Keep":6,"./ListenerMethods":7,"./ListenerMixin":8,"./PublisherMethods":9,"./StoreMethods":10,"./connect":12,"./connectFilter":13,"./createAction":14,"./createStore":15,"./joins":17,"./listenTo":18,"./listenToMany":19,"./utils":21}],17:[function(require,module,exports){
/**
 * Internal module used to create static and instance join methods
 */

var slice = Array.prototype.slice,
    _ = require("./utils"),
    createStore = require("./createStore"),
    strategyMethodNames = {
        strict: "joinStrict",
        first: "joinLeading",
        last: "joinTrailing",
        all: "joinConcat"
    };

/**
 * Used in `index.js` to create the static join methods
 * @param {String} strategy Which strategy to use when tracking listenable trigger arguments
 * @returns {Function} A static function which returns a store with a join listen on the given listenables using the given strategy
 */
exports.staticJoinCreator = function(strategy){
    return function(/* listenables... */) {
        var listenables = slice.call(arguments);
        return createStore({
            init: function(){
                this[strategyMethodNames[strategy]].apply(this,listenables.concat("triggerAsync"));
            }
        });
    };
};

/**
 * Used in `ListenerMethods.js` to create the instance join methods
 * @param {String} strategy Which strategy to use when tracking listenable trigger arguments
 * @returns {Function} An instance method which sets up a join listen on the given listenables using the given strategy
 */
exports.instanceJoinCreator = function(strategy){
    return function(/* listenables..., callback*/){
        _.throwIf(arguments.length < 3,'Cannot create a join with less than 2 listenables!');
        var listenables = slice.call(arguments),
            callback = listenables.pop(),
            numberOfListenables = listenables.length,
            join = {
                numberOfListenables: numberOfListenables,
                callback: this[callback]||callback,
                listener: this,
                strategy: strategy
            }, i, cancels = [], subobj;
        for (i = 0; i < numberOfListenables; i++) {
            _.throwIf(this.validateListening(listenables[i]));
        }
        for (i = 0; i < numberOfListenables; i++) {
            cancels.push(listenables[i].listen(newListener(i,join),this));
        }
        reset(join);
        subobj = {listenable: listenables};
        subobj.stop = makeStopper(subobj,cancels,this);
        this.subscriptions = (this.subscriptions || []).concat(subobj);
        return subobj;
    };
};

// ---- internal join functions ----

function makeStopper(subobj,cancels,context){
    return function() {
        var i, subs = context.subscriptions,
            index = (subs ? subs.indexOf(subobj) : -1);
        _.throwIf(index === -1,'Tried to remove join already gone from subscriptions list!');
        for(i=0;i < cancels.length; i++){
            cancels[i]();
        }
        subs.splice(index, 1);
    };
}

function reset(join) {
    join.listenablesEmitted = new Array(join.numberOfListenables);
    join.args = new Array(join.numberOfListenables);
}

function newListener(i,join) {
    return function() {
        var callargs = slice.call(arguments);
        if (join.listenablesEmitted[i]){
            switch(join.strategy){
                case "strict": throw new Error("Strict join failed because listener triggered twice.");
                case "last": join.args[i] = callargs; break;
                case "all": join.args[i].push(callargs);
            }
        } else {
            join.listenablesEmitted[i] = true;
            join.args[i] = (join.strategy==="all"?[callargs]:callargs);
        }
        emitIfAllListenablesEmitted(join);
    };
}

function emitIfAllListenablesEmitted(join) {
    for (var i = 0; i < join.numberOfListenables; i++) {
        if (!join.listenablesEmitted[i]) {
            return;
        }
    }
    join.callback.apply(join.listener,join.args);
    reset(join);
}

},{"./createStore":15,"./utils":21}],18:[function(require,module,exports){
var Reflux = require('./index');


/**
 * A mixin factory for a React component. Meant as a more convenient way of using the `ListenerMixin`,
 * without having to manually set listeners in the `componentDidMount` method.
 *
 * @param {Action|Store} listenable An Action or Store that should be
 *  listened to.
 * @param {Function|String} callback The callback to register as event handler
 * @param {Function|String} defaultCallback The callback to register as default handler
 * @returns {Object} An object to be used as a mixin, which sets up the listener for the given listenable.
 */
module.exports = function(listenable,callback,initial){
    return {
        /**
         * Set up the mixin before the initial rendering occurs. Import methods from `ListenerMethods`
         * and then make the call to `listenTo` with the arguments provided to the factory function
         */
        componentDidMount: function() {
            for(var m in Reflux.ListenerMethods){
                if (this[m] !== Reflux.ListenerMethods[m]){
                    if (this[m]){
                        throw "Can't have other property '"+m+"' when using Reflux.listenTo!";
                    }
                    this[m] = Reflux.ListenerMethods[m];
                }
            }
            this.listenTo(listenable,callback,initial);
        },
        /**
         * Cleans up all listener previously registered.
         */
        componentWillUnmount: Reflux.ListenerMethods.stopListeningToAll
    };
};

},{"./index":16}],19:[function(require,module,exports){
var Reflux = require('./index');

/**
 * A mixin factory for a React component. Meant as a more convenient way of using the `listenerMixin`,
 * without having to manually set listeners in the `componentDidMount` method. This version is used
 * to automatically set up a `listenToMany` call.
 *
 * @param {Object} listenables An object of listenables
 * @returns {Object} An object to be used as a mixin, which sets up the listeners for the given listenables.
 */
module.exports = function(listenables){
    return {
        /**
         * Set up the mixin before the initial rendering occurs. Import methods from `ListenerMethods`
         * and then make the call to `listenTo` with the arguments provided to the factory function
         */
        componentDidMount: function() {
            for(var m in Reflux.ListenerMethods){
                if (this[m] !== Reflux.ListenerMethods[m]){
                    if (this[m]){
                        throw "Can't have other property '"+m+"' when using Reflux.listenToMany!";
                    }
                    this[m] = Reflux.ListenerMethods[m];
                }
            }
            this.listenToMany(listenables);
        },
        /**
         * Cleans up all listener previously registered.
         */
        componentWillUnmount: Reflux.ListenerMethods.stopListeningToAll
    };
};

},{"./index":16}],20:[function(require,module,exports){
var _ = require('./utils');

module.exports = function mix(def) {
    var composed = {
        init: [],
        preEmit: [],
        shouldEmit: []
    };

    var updated = (function mixDef(mixin) {
        var mixed = {};
        if (mixin.mixins) {
            mixin.mixins.forEach(function (subMixin) {
                _.extend(mixed, mixDef(subMixin));
            });
        }
        _.extend(mixed, mixin);
        Object.keys(composed).forEach(function (composable) {
            if (mixin.hasOwnProperty(composable)) {
                composed[composable].push(mixin[composable]);
            }
        });
        return mixed;
    }(def));

    if (composed.init.length > 1) {
        updated.init = function () {
            var args = arguments;
            composed.init.forEach(function (init) {
                init.apply(this, args);
            }, this);
        };
    }
    if (composed.preEmit.length > 1) {
        updated.preEmit = function () {
            return composed.preEmit.reduce(function (args, preEmit) {
                var newValue = preEmit.apply(this, args);
                return newValue === undefined ? args : [newValue];
            }.bind(this), arguments);
        };
    }
    if (composed.shouldEmit.length > 1) {
        updated.shouldEmit = function () {
            var args = arguments;
            return !composed.shouldEmit.some(function (shouldEmit) {
                return !shouldEmit.apply(this, args);
            }, this);
        };
    }
    Object.keys(composed).forEach(function (composable) {
        if (composed[composable].length === 1) {
            updated[composable] = composed[composable][0];
        }
    });

    return updated;
};

},{"./utils":21}],21:[function(require,module,exports){
/*
 * isObject, extend, isFunction, isArguments are taken from undescore/lodash in
 * order to remove the dependency
 */
var isObject = exports.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

exports.extend = function(obj) {
    if (!isObject(obj)) {
        return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop);
                Object.defineProperty(obj, prop, propertyDescriptor);
            } else {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};

exports.isFunction = function(value) {
    return typeof value === 'function';
};

exports.EventEmitter = require('eventemitter3');

exports.nextTick = function(callback) {
    setTimeout(callback, 0);
};

exports.capitalize = function(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
};

exports.callbackName = function(string){
    return "on"+exports.capitalize(string);
};

exports.object = function(keys,vals){
    var o={}, i=0;
    for(;i<keys.length;i++){
        o[keys[i]] = vals[i];
    }
    return o;
};

exports.Promise = require("native-promise-only");

exports.createPromise = function(resolver) {
    return new exports.Promise(resolver);
};

exports.isArguments = function(value) {
    return typeof value === 'object' && ('callee' in value) && typeof value.length === 'number';
};

exports.throwIf = function(val,msg){
    if (val){
        throw Error(msg||val);
    }
};

},{"eventemitter3":3,"native-promise-only":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2lsdmlhL2NvZGVfY2ovZ3VscC1uZXcvYXNzZXRzL2pzL2FwcC9pbmRleC1yZWZsdXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVmbHV4L2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmx1eC9ub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvbm9kZV9tb2R1bGVzL25hdGl2ZS1wcm9taXNlLW9ubHkvbnBvLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmx1eC9zcmMvQWN0aW9uTWV0aG9kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL0tlZXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVmbHV4L3NyYy9MaXN0ZW5lck1ldGhvZHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVmbHV4L3NyYy9MaXN0ZW5lck1peGluLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmx1eC9zcmMvUHVibGlzaGVyTWV0aG9kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL1N0b3JlTWV0aG9kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL2JpbmRNZXRob2RzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmx1eC9zcmMvY29ubmVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL2Nvbm5lY3RGaWx0ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVmbHV4L3NyYy9jcmVhdGVBY3Rpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVmbHV4L3NyYy9jcmVhdGVTdG9yZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmx1eC9zcmMvam9pbnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVmbHV4L3NyYy9saXN0ZW5Uby5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL2xpc3RlblRvTWFueS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWZsdXgvc3JjL21peGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmx1eC9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNDQTtBQUFBLEFBQUksRUFBQSxDQUFBLE1BQUssRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLFFBQU8sQ0FBQyxDQUFDO0FBQzlCLE1BQU0sSUFBSSxBQUFDLENBQUMsS0FBSSxDQUFDLENBQUM7QUFFbEIsQUFBSSxFQUFBLENBQUEsU0FBUSxFQUFJLENBQUEsTUFBSyxhQUFhLEFBQUMsRUFBQyxDQUFDO0FBYXJDLEFBQUksRUFBQSxDQUFBLFFBQU8sRUFBSSxDQUFBLE1BQUssWUFBWSxBQUFDLENBQUM7QUFHOUIsS0FBRyxDQUFHLFVBQVEsQUFBQyxDQUFFO0FBQ2IsT0FBRyxlQUFlLEVBQUksTUFBSSxDQUFDO0FBRzNCLE9BQUcsU0FBUyxBQUFDLENBQUMsU0FBUSxDQUFHLENBQUEsSUFBRyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2xEO0FBR0EsZ0JBQWMsQ0FBRyxVQUFRLEFBQUMsQ0FBRTtBQUN4QixPQUFHLGVBQWUsRUFBSSxFQUFDLElBQUcsZUFBZSxDQUFDO0FBSTFDLE9BQUcsUUFBUSxBQUFDLENBQUMsSUFBRyxlQUFlLENBQUMsQ0FBQztFQUNyQztBQUFBLEFBRUosQ0FBQyxDQUFDO0FBQ0YsQUFBSSxFQUFBLENBQUEsR0FBRSxFQUFJLENBQUEsS0FBSSxZQUFZLEFBQUMsQ0FBQztBQUFDLFlBQVUsQ0FBRyxNQUFJO0FBQzFDLGdCQUFjLENBQUcsVUFBUSxBQUFDLENBQUU7QUFDMUIsU0FBTyxHQUNQLENBQUM7RUFDSDtBQUNBLGtCQUFnQixDQUFHLFVBQVEsQUFBQyxDQUFFO0FBQzFCLE9BQUcsWUFBWSxFQUFJLENBQUEsUUFBTyxPQUFPLEFBQUMsQ0FBQyxJQUFHLFlBQVksQ0FBQyxDQUFDO0VBQ3hEO0FBRUEscUJBQW1CLENBQUcsVUFBUSxBQUFDLENBQUU7QUFDN0IsT0FBRyxZQUFZLEFBQUMsRUFBQyxDQUFDO0VBQ3RCO0FBR0EsWUFBVSxDQUFHLFVBQVMsU0FBUSxDQUFHO0FBQzdCLE9BQUcsU0FBUyxBQUFDLENBQUMsQ0FBQyxTQUFRLENBQUcsVUFBUSxDQUFDLENBQUMsQ0FBQztFQUN6QztBQUVBLE9BQUssQ0FBRyxVQUFRLEFBQUMsQ0FBRTtBQUNmLEFBQUksTUFBQSxDQUFBLFlBQVcsRUFBSSxDQUFBLElBQUcsTUFBTSxVQUFVLEVBQ2xDLFlBQVUsRUFDVixjQUFZLENBQUM7QUFDakIsU0FBTyxFQUFDLEtBQUksY0FBYyxBQUFDLENBQUMsS0FBSSxDQUFHLEtBQUcsQ0FBRyxXQUFTLENBQUcsYUFBVyxDQUFDLENBQUMsQ0FBQztFQUN2RTtBQUFBLEFBQ0osQ0FBQyxDQUFDO0FBR0YsSUFBSSxPQUFPLEFBQUMsQ0FBQyxLQUFJLGNBQWMsQUFBQyxDQUFDLEdBQUUsQ0FBRyxLQUFHLENBQUMsQ0FBRyxDQUFBLFFBQU8sZUFBZSxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUMsQ0FBQztBQUUvRSxRQUFRLEFBQUMsRUFBQyxDQUFDO0FBNEUwM047Ozs7QUM5SXI0TjtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgUmVmbHV4ID0gcmVxdWlyZSgncmVmbHV4Jyk7XG5jb25zb2xlLmxvZyhSZWFjdCk7XG5cbnZhciB0b2dnbGVHZW0gPSBSZWZsdXguY3JlYXRlQWN0aW9uKCk7XG4vKlxudmFyIGlzR2VtQWN0aXZhdGVkID0gdHJ1ZTtcblxudG9nZ2xlR2VtLmxpc3RlbihmdW5jdGlvbihzdGF0dXMpe1xuICBpc0dlbUFjdGl2YXRlZCA9ICFpc0dlbUFjdGl2YXRlZDtcbiAgdmFyIHN0ckFjdGl2YXRlZCA9IGlzR2VtQWN0aXZhdGVkID8gJ2FjdCcgOiAnZGVhJztcbiAgY29uc29sZS5sb2coJ0dlbSBpcyAnICsgc3RyQWN0aXZhdGVkKTtcbiAgY29uc29sZS5sb2coc3RhdHVzKTtcbn0pO1xuXG4qL1xuXG52YXIgZ2VtU3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuXG4gICAgLy8gSW5pdGlhbCBzZXR1cFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmlzR2VtQWN0aXZhdGVkID0gZmFsc2U7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgc3RhdHVzVXBkYXRlIGFjdGlvblxuICAgICAgICB0aGlzLmxpc3RlblRvKHRvZ2dsZUdlbSwgdGhpcy5oYW5kbGVUb2dnbGVHZW0pO1xuICAgIH0sXG5cbiAgICAvLyBDYWxsYmFja1xuICAgIGhhbmRsZVRvZ2dsZUdlbTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXNHZW1BY3RpdmF0ZWQgPSAhdGhpcy5pc0dlbUFjdGl2YXRlZDtcblxuICAgICAgICAvLyBQYXNzIG9uIHRvIGxpc3RlbmVycyB0aHJvdWdoIFxuICAgICAgICAvLyB0aGUgRGF0YVN0b3JlLnRyaWdnZXIgZnVuY3Rpb25cbiAgICAgICAgdGhpcy50cmlnZ2VyKHRoaXMuaXNHZW1BY3RpdmF0ZWQpO1xuICAgIH1cblxufSk7XG52YXIgR2VtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkdlbVwiLCAgXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICB9O1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gZ2VtU3RvcmUubGlzdGVuKHRoaXMub25HZW1DaGFuZ2UpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9LFxuXG4gICAgLy8gVGhlIGxpc3RlbmluZyBjYWxsYmFja1xuICAgIG9uR2VtQ2hhbmdlOiBmdW5jdGlvbihnZW1TdGF0dXMpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Z2VtU3RhdHVzOiBnZW1TdGF0dXN9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGdlbVN0YXR1c1N0ciA9IHRoaXMuc3RhdGUuZ2VtU3RhdHVzID9cbiAgICAgICAgICAgIFwiYWN0aXZhdGVkXCIgOlxuICAgICAgICAgICAgXCJkZWFjdGl2YXRlZFwiOyAgICBcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiIGdlbSBpcyBcIiwgZ2VtU3RhdHVzU3RyKSk7XG4gICAgfVxufSk7XG5cblxuUmVhY3QucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VtLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdCcpKTtcblxudG9nZ2xlR2VtKCk7XG4vKlxuLy8gY3JlYXRlIGFuIGFjdGlvblxudmFyIHRleHRVcGRhdGUgPSBSZWZsdXguY3JlYXRlQWN0aW9uKCk7XG52YXIgc3RhdHVzVXBkYXRlID0gUmVmbHV4LmNyZWF0ZUFjdGlvbigpO1xuXG4vLyBjcmVhdGUgYSBEYXRhU3RvcmUgLSBsaXN0ZW5pbmcgdG8gdGV4dFVwZGF0ZSBhY3Rpb25cbnZhciB0ZXh0U3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRleHRVcGRhdGUsIHRoaXMub3V0cHV0KTtcbiAgfSxcbiAgb3V0cHV0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMud3JpdGVPdXQoYXJnc1tpXSk7XG4gICAgfVxuICB9LFxuICB3cml0ZU91dDogZnVuY3Rpb24odGV4dCkge1xuICAgIHRoaXMudHJpZ2dlcih0ZXh0KTtcbiAgfVxufSk7XG5cbi8vIGNyZWF0aW5nIGEgRGF0YVN0b3JlXG52YXIgc3RhdHVzU3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpc3RlblRvKHN0YXR1c1VwZGF0ZSwgdGhpcy5vdXRwdXQpO1xuICB9LFxuICBvdXRwdXQ6IGZ1bmN0aW9uKGZsYWcpIHtcbiAgICB2YXIgc3RhdHVzID0gZmxhZyA/ICdPTkxJTkUnIDogJ09GRkxJTkUnO1xuICAgIHRoaXMudHJpZ2dlcihzdGF0dXMpO1xuICB9XG59KTtcblxuLy8gY3JlYXRlIGEgYWdncmVnYXRlIERhdGFTdG9yZSB0aGF0IGlzIGxpc3RlbmluZyB0byB0ZXh0U3RvcmUgYW5kIHN0YXR1c1N0b3JlXG52YXIgc3RvcnlTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG4gIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5saXN0ZW5UbyhzdGF0dXNTdG9yZSwgdGhpcy5zdGF0dXNDaGFuZ2VkKTtcbiAgICB0aGlzLmxpc3RlblRvKHRleHRTdG9yZSwgdGhpcy50ZXh0VXBkYXRlZCk7XG4gICAgdGhpcy5zdG9yeUFyciA9IFtdO1xuICB9LFxuICBzdGF0dXNDaGFuZ2VkOiBmdW5jdGlvbihmbGFnKSB7XG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tJyk7XG4gICAgY29uc29sZS5sb2coZmxhZyk7XG4gICAgaWYgKGZsYWcgPT09IFwiT0ZGTElORVwiKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ29uY2UgdXBvbiBhIHRpbWUgdGhlIHVzZXIgZGlkIHRoZSBmb2xsb3dpbmc6ICcgKyB0aGlzLnN0b3J5QXJyLmpvaW4oJywgJykpO1xuICAgICAgLy8gZW1wdHkgc3RvcnlBcnJcbiAgICAgIHRoaXMuc3RvcnlBcnIuc3BsaWNlKDAsIHRoaXMuc3RvcnlBcnIubGVuZ3RoKTtcbiAgICB9XG4gIH0sXG4gIHRleHRVcGRhdGVkOiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdGhpcy5zdG9yeUFyci5wdXNoKHRleHQpO1xuICB9XG59KTtcblxuLy8gc2ltcGxlIHZpZXcgY29tcG9uZW50IHRoYXQgb3VwdXRzIHRvIGNvbnNvbGVcbmZ1bmN0aW9uIENvbnNvbGVDb21wb25lbnQoKSB7XG4gIHRleHRTdG9yZS5saXN0ZW4oZnVuY3Rpb24odGV4dCkge1xuICAgIC8vY29uc29sZS5sb2coMSk7XG4gICAgY29uc29sZS5sb2coJ3RleHQ6ICcsIHRleHQpO1xuICB9KTtcbiAgc3RhdHVzU3RvcmUubGlzdGVuKGZ1bmN0aW9uKHN0YXR1cykge1xuICAgIC8vY29uc29sZS5sb2coMik7XG4gICAgY29uc29sZS5sb2coJ3N0YXR1czogJywgc3RhdHVzKTtcbiAgfSk7XG4gIHN0b3J5U3RvcmUubGlzdGVuKGZ1bmN0aW9uKHN0b3J5KSB7XG4gICAgLy9jb25zb2xlLmxvZygzKTtcbiAgICBjb25zb2xlLmxvZygnc3Rvcnk6ICcsIHN0b3J5KTtcbiAgfSk7XG59XG5uZXcgQ29uc29sZUNvbXBvbmVudCgpO1xuXG4vLyBpbnZva2luZyBhY3Rpb25zIHdpdGggYXJiaXRyYXJ5IHBhcmFtXG5zdGF0dXNVcGRhdGUodHJ1ZSk7XG50ZXh0VXBkYXRlKCd0ZXN0aW5nJywgMTMzNywgeyd0ZXN0JzogMTMzN30pO1xuc3RhdHVzVXBkYXRlKGZhbHNlKTtcbiovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXphV3gyYVdFdlkyOWtaVjlqYWk5bmRXeHdMVzVsZHk5aGMzTmxkSE12YW5NdllYQndMMmx1WkdWNExYSmxabXgxZUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHRCUVVOQkxFbEJRVWtzVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVNdlFpeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE96dEJRVVZ1UWl4SlFVRkpMRk5CUVZNc1IwRkJSeXhOUVVGTkxFTkJRVU1zV1VGQldTeEZRVUZGTEVOQlFVTTdRVUZEZEVNN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQkxFVkJRVVU3TzBGQlJVWXNTVUZCU1N4UlFVRlJMRWRCUVVjc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF6dEJRVU5zUXpzN1NVRkZTU3hKUVVGSkxFVkJRVVVzVjBGQlZ6dEJRVU55UWl4UlFVRlJMRWxCUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzUzBGQlN5eERRVUZETzBGQlEzQkRPenRSUVVWUkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU4yUkN4TFFVRkxPMEZCUTB3N08wbEJSVWtzWlVGQlpTeEZRVUZGTEZkQlFWYzdRVUZEYUVNc1VVRkJVU3hKUVVGSkxFTkJRVU1zWTBGQll5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJRenRCUVVOdVJEdEJRVU5CT3p0UlFVVlJMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFdEJRVXM3TzBOQlJVb3NRMEZCUXl4RFFVRkRPMEZCUTBnc1NVRkJTU3g1UWtGQmVVSXNiVUpCUVVFN1NVRkRla0lzWlVGQlpTeEZRVUZGTEZkQlFWYzdUVUZETVVJc1QwRkJUenRQUVVOT0xFTkJRVU03UzBGRFNEdEpRVU5FTEdsQ1FVRnBRaXhGUVVGRkxGZEJRVmM3VVVGRE1VSXNTVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVNM1JDeExRVUZMT3p0SlFVVkVMRzlDUVVGdlFpeEZRVUZGTEZkQlFWYzdVVUZETjBJc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBGQlF6TkNMRXRCUVVzN1FVRkRURHM3U1VGRlNTeFhRVUZYTEVWQlFVVXNVMEZCVXl4VFFVRlRMRVZCUVVVN1VVRkROMElzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6bERMRXRCUVVzN08wbEJSVVFzVFVGQlRTeEZRVUZGTEZkQlFWYzdVVUZEWml4SlFVRkpMRmxCUVZrc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTTdXVUZEYmtNc1YwRkJWenRaUVVOWUxHRkJRV0VzUTBGQlF6dFJRVU5zUWl4UlFVRlJMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeEpRVUZETEVWQlFVRXNWVUZCUVN4RlFVRlRMRmxCUVcxQ0xFTkJRVUVzUlVGQlJUdExRVU01UXp0QlFVTk1MRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMGc3TzBGQlJVRXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXh2UWtGQlF5eEhRVUZITEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJSU3hSUVVGUkxFTkJRVU1zWTBGQll5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSWHBFTEZOQlFWTXNSVUZCUlN4RFFVRkRPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmNiblpoY2lCU1pXWnNkWGdnUFNCeVpYRjFhWEpsS0NkeVpXWnNkWGduS1R0Y2JtTnZibk52YkdVdWJHOW5LRkpsWVdOMEtUdGNibHh1ZG1GeUlIUnZaMmRzWlVkbGJTQTlJRkpsWm14MWVDNWpjbVZoZEdWQlkzUnBiMjRvS1R0Y2JpOHFYRzUyWVhJZ2FYTkhaVzFCWTNScGRtRjBaV1FnUFNCMGNuVmxPMXh1WEc1MGIyZG5iR1ZIWlcwdWJHbHpkR1Z1S0daMWJtTjBhVzl1S0hOMFlYUjFjeWw3WEc0Z0lHbHpSMlZ0UVdOMGFYWmhkR1ZrSUQwZ0lXbHpSMlZ0UVdOMGFYWmhkR1ZrTzF4dUlDQjJZWElnYzNSeVFXTjBhWFpoZEdWa0lEMGdhWE5IWlcxQlkzUnBkbUYwWldRZ1B5QW5ZV04wSnlBNklDZGtaV0VuTzF4dUlDQmpiMjV6YjJ4bExteHZaeWduUjJWdElHbHpJQ2NnS3lCemRISkJZM1JwZG1GMFpXUXBPMXh1SUNCamIyNXpiMnhsTG14dlp5aHpkR0YwZFhNcE8xeHVmU2s3WEc1Y2Jpb3ZYRzVjYm5aaGNpQm5aVzFUZEc5eVpTQTlJRkpsWm14MWVDNWpjbVZoZEdWVGRHOXlaU2g3WEc1Y2JpQWdJQ0F2THlCSmJtbDBhV0ZzSUhObGRIVndYRzRnSUNBZ2FXNXBkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YVhOSFpXMUJZM1JwZG1GMFpXUWdQU0JtWVd4elpUdGNibHh1SUNBZ0lDQWdJQ0F2THlCU1pXZHBjM1JsY2lCemRHRjBkWE5WY0dSaGRHVWdZV04wYVc5dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YkdsemRHVnVWRzhvZEc5bloyeGxSMlZ0TENCMGFHbHpMbWhoYm1Sc1pWUnZaMmRzWlVkbGJTazdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lDOHZJRU5oYkd4aVlXTnJYRzRnSUNBZ2FHRnVaR3hsVkc5bloyeGxSMlZ0T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1cGMwZGxiVUZqZEdsMllYUmxaQ0E5SUNGMGFHbHpMbWx6UjJWdFFXTjBhWFpoZEdWa08xeHVYRzRnSUNBZ0lDQWdJQzh2SUZCaGMzTWdiMjRnZEc4Z2JHbHpkR1Z1WlhKeklIUm9jbTkxWjJnZ1hHNGdJQ0FnSUNBZ0lDOHZJSFJvWlNCRVlYUmhVM1J2Y21VdWRISnBaMmRsY2lCbWRXNWpkR2x2Ymx4dUlDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSW9kR2hwY3k1cGMwZGxiVUZqZEdsMllYUmxaQ2s3WEc0Z0lDQWdmVnh1WEc1OUtUdGNiblpoY2lCSFpXMGdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3SUNCY2JpQWdJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmU3hjYmlBZ0lDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkVzV6ZFdKelkzSnBZbVVnUFNCblpXMVRkRzl5WlM1c2FYTjBaVzRvZEdocGN5NXZia2RsYlVOb1lXNW5aU2s3WEc0Z0lDQWdmU3hjYmx4dUlDQWdJR052YlhCdmJtVnVkRmRwYkd4VmJtMXZkVzUwT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWJuTjFZbk5qY21saVpTZ3BPMXh1SUNBZ0lIMHNYRzVjYmlBZ0lDQXZMeUJVYUdVZ2JHbHpkR1Z1YVc1bklHTmhiR3hpWVdOclhHNGdJQ0FnYjI1SFpXMURhR0Z1WjJVNklHWjFibU4wYVc5dUtHZGxiVk4wWVhSMWN5a2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdG5aVzFUZEdGMGRYTTZJR2RsYlZOMFlYUjFjMzBwTzF4dUlDQWdJSDBzWEc1Y2JpQWdJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdaMlZ0VTNSaGRIVnpVM1J5SUQwZ2RHaHBjeTV6ZEdGMFpTNW5aVzFUZEdGMGRYTWdQMXh1SUNBZ0lDQWdJQ0FnSUNBZ1hDSmhZM1JwZG1GMFpXUmNJaUE2WEc0Z0lDQWdJQ0FnSUNBZ0lDQmNJbVJsWVdOMGFYWmhkR1ZrWENJN0lDQWdJRnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdLRHhrYVhZK0lHZGxiU0JwY3lCN1oyVnRVM1JoZEhWelUzUnlmVHd2WkdsMlBpazdYRzRnSUNBZ2ZWeHVmU2s3WEc1Y2JseHVVbVZoWTNRdWNtVnVaR1Z5S0R4SFpXMGdMejRzSUdSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLQ2R5WlhOMWJIUW5LU2s3WEc1Y2JuUnZaMmRzWlVkbGJTZ3BPMXh1THlwY2JpOHZJR055WldGMFpTQmhiaUJoWTNScGIyNWNiblpoY2lCMFpYaDBWWEJrWVhSbElEMGdVbVZtYkhWNExtTnlaV0YwWlVGamRHbHZiaWdwTzF4dWRtRnlJSE4wWVhSMWMxVndaR0YwWlNBOUlGSmxabXgxZUM1amNtVmhkR1ZCWTNScGIyNG9LVHRjYmx4dUx5OGdZM0psWVhSbElHRWdSR0YwWVZOMGIzSmxJQzBnYkdsemRHVnVhVzVuSUhSdklIUmxlSFJWY0dSaGRHVWdZV04wYVc5dVhHNTJZWElnZEdWNGRGTjBiM0psSUQwZ1VtVm1iSFY0TG1OeVpXRjBaVk4wYjNKbEtIdGNiaUFnYVc1cGREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdkR2hwY3k1c2FYTjBaVzVVYnloMFpYaDBWWEJrWVhSbExDQjBhR2x6TG05MWRIQjFkQ2s3WEc0Z0lIMHNYRzRnSUc5MWRIQjFkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnZG1GeUlHa3NJR0Z5WjNNZ1BTQkJjbkpoZVM1d2NtOTBiM1I1Y0dVdWMyeHBZMlV1WTJGc2JDaGhjbWQxYldWdWRITXNJREFwTzF4dUlDQWdJR1p2Y2lBb2FTQTlJREE3SUdrZ1BDQmhjbWR6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQjBhR2x6TG5keWFYUmxUM1YwS0dGeVozTmJhVjBwTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnZDNKcGRHVlBkWFE2SUdaMWJtTjBhVzl1S0hSbGVIUXBJSHRjYmlBZ0lDQjBhR2x6TG5SeWFXZG5aWElvZEdWNGRDazdYRzRnSUgxY2JuMHBPMXh1WEc0dkx5QmpjbVZoZEdsdVp5QmhJRVJoZEdGVGRHOXlaVnh1ZG1GeUlITjBZWFIxYzFOMGIzSmxJRDBnVW1WbWJIVjRMbU55WldGMFpWTjBiM0psS0h0Y2JpQWdhVzVwZERvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2RHaHBjeTVzYVhOMFpXNVVieWh6ZEdGMGRYTlZjR1JoZEdVc0lIUm9hWE11YjNWMGNIVjBLVHRjYmlBZ2ZTeGNiaUFnYjNWMGNIVjBPaUJtZFc1amRHbHZiaWhtYkdGbktTQjdYRzRnSUNBZ2RtRnlJSE4wWVhSMWN5QTlJR1pzWVdjZ1B5QW5UMDVNU1U1Rkp5QTZJQ2RQUmtaTVNVNUZKenRjYmlBZ0lDQjBhR2x6TG5SeWFXZG5aWElvYzNSaGRIVnpLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JpOHZJR055WldGMFpTQmhJR0ZuWjNKbFoyRjBaU0JFWVhSaFUzUnZjbVVnZEdoaGRDQnBjeUJzYVhOMFpXNXBibWNnZEc4Z2RHVjRkRk4wYjNKbElHRnVaQ0J6ZEdGMGRYTlRkRzl5WlZ4dWRtRnlJSE4wYjNKNVUzUnZjbVVnUFNCU1pXWnNkWGd1WTNKbFlYUmxVM1J2Y21Vb2UxeHVJQ0JwYm1sME9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lIUm9hWE11YkdsemRHVnVWRzhvYzNSaGRIVnpVM1J2Y21Vc0lIUm9hWE11YzNSaGRIVnpRMmhoYm1kbFpDazdYRzRnSUNBZ2RHaHBjeTVzYVhOMFpXNVVieWgwWlhoMFUzUnZjbVVzSUhSb2FYTXVkR1Y0ZEZWd1pHRjBaV1FwTzF4dUlDQWdJSFJvYVhNdWMzUnZjbmxCY25JZ1BTQmJYVHRjYmlBZ2ZTeGNiaUFnYzNSaGRIVnpRMmhoYm1kbFpEb2dablZ1WTNScGIyNG9abXhoWnlrZ2UxeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktDY3RMUzB0TFMwdExTY3BPMXh1SUNBZ0lHTnZibk52YkdVdWJHOW5LR1pzWVdjcE8xeHVJQ0FnSUdsbUlDaG1iR0ZuSUQwOVBTQmNJazlHUmt4SlRrVmNJaWtnZTF4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeUtDZHZibU5sSUhWd2IyNGdZU0IwYVcxbElIUm9aU0IxYzJWeUlHUnBaQ0IwYUdVZ1ptOXNiRzkzYVc1bk9pQW5JQ3NnZEdocGN5NXpkRzl5ZVVGeWNpNXFiMmx1S0Njc0lDY3BLVHRjYmlBZ0lDQWdJQzh2SUdWdGNIUjVJSE4wYjNKNVFYSnlYRzRnSUNBZ0lDQjBhR2x6TG5OMGIzSjVRWEp5TG5Od2JHbGpaU2d3TENCMGFHbHpMbk4wYjNKNVFYSnlMbXhsYm1kMGFDazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dUlDQjBaWGgwVlhCa1lYUmxaRG9nWm5WdVkzUnBiMjRvZEdWNGRDa2dlMXh1SUNBZ0lIUm9hWE11YzNSdmNubEJjbkl1Y0hWemFDaDBaWGgwS1R0Y2JpQWdmVnh1ZlNrN1hHNWNiaTh2SUhOcGJYQnNaU0IyYVdWM0lHTnZiWEJ2Ym1WdWRDQjBhR0YwSUc5MWNIVjBjeUIwYnlCamIyNXpiMnhsWEc1bWRXNWpkR2x2YmlCRGIyNXpiMnhsUTI5dGNHOXVaVzUwS0NrZ2UxeHVJQ0IwWlhoMFUzUnZjbVV1YkdsemRHVnVLR1oxYm1OMGFXOXVLSFJsZUhRcElIdGNiaUFnSUNBdkwyTnZibk52YkdVdWJHOW5LREVwTzF4dUlDQWdJR052Ym5OdmJHVXViRzluS0NkMFpYaDBPaUFuTENCMFpYaDBLVHRjYmlBZ2ZTazdYRzRnSUhOMFlYUjFjMU4wYjNKbExteHBjM1JsYmlobWRXNWpkR2x2YmloemRHRjBkWE1wSUh0Y2JpQWdJQ0F2TDJOdmJuTnZiR1V1Ykc5bktESXBPMXh1SUNBZ0lHTnZibk52YkdVdWJHOW5LQ2R6ZEdGMGRYTTZJQ2NzSUhOMFlYUjFjeWs3WEc0Z0lIMHBPMXh1SUNCemRHOXllVk4wYjNKbExteHBjM1JsYmlobWRXNWpkR2x2YmloemRHOXllU2tnZTF4dUlDQWdJQzh2WTI5dWMyOXNaUzVzYjJjb015azdYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29KM04wYjNKNU9pQW5MQ0J6ZEc5eWVTazdYRzRnSUgwcE8xeHVmVnh1Ym1WM0lFTnZibk52YkdWRGIyMXdiMjVsYm5Rb0tUdGNibHh1THk4Z2FXNTJiMnRwYm1jZ1lXTjBhVzl1Y3lCM2FYUm9JR0Z5WW1sMGNtRnllU0J3WVhKaGJWeHVjM1JoZEhWelZYQmtZWFJsS0hSeWRXVXBPMXh1ZEdWNGRGVndaR0YwWlNnbmRHVnpkR2x1Wnljc0lERXpNemNzSUhzbmRHVnpkQ2M2SURFek16ZDlLVHRjYm5OMFlYUjFjMVZ3WkdGMFpTaG1ZV3h6WlNrN1hHNHFMeUpkZlE9PSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBFdmVudEVtaXR0ZXIgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQuXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IENvbnRleHQgZm9yIGZ1bmN0aW9uIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IGVtaXQgb25jZVxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBNaW5pbWFsIEV2ZW50RW1pdHRlciBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogRXZlbnRFbWl0dGVyIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHsgLyogTm90aGluZyB0byBzZXQgKi8gfVxuXG4vKipcbiAqIEhvbGRzIHRoZSBhc3NpZ25lZCBFdmVudEVtaXR0ZXJzIGJ5IG5hbWUuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IG9mIGFzc2lnbmVkIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50cyB0aGF0IHNob3VsZCBiZSBsaXN0ZWQuXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCkge1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW2V2ZW50XSkgcmV0dXJuIFtdO1xuICBpZiAodGhpcy5fZXZlbnRzW2V2ZW50XS5mbikgcmV0dXJuIFt0aGlzLl9ldmVudHNbZXZlbnRdLmZuXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuX2V2ZW50c1tldmVudF0ubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gdGhpcy5fZXZlbnRzW2V2ZW50XVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogRW1pdCBhbiBldmVudCB0byBhbGwgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJbmRpY2F0aW9uIGlmIHdlJ3ZlIGVtaXR0ZWQgYW4gZXZlbnQuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1tldmVudF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgYXJnc1xuICAgICwgaTtcblxuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGxpc3RlbmVycy5mbikge1xuICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgbmV3IEV2ZW50TGlzdGVuZXIgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAcGFyYW0ge0Z1bmN0b259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW2V2ZW50XSkgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IGxpc3RlbmVyO1xuICBlbHNlIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1tldmVudF0uZm4pIHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChsaXN0ZW5lcik7XG4gICAgZWxzZSB0aGlzLl9ldmVudHNbZXZlbnRdID0gW1xuICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSwgbGlzdGVuZXJcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhbiBFdmVudExpc3RlbmVyIHRoYXQncyBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICBpZiAoIXRoaXMuX2V2ZW50c1tldmVudF0pIHRoaXMuX2V2ZW50c1tldmVudF0gPSBsaXN0ZW5lcjtcbiAgZWxzZSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHNbZXZlbnRdLmZuKSB0aGlzLl9ldmVudHNbZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xuICAgIGVsc2UgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtcbiAgICAgIHRoaXMuX2V2ZW50c1tldmVudF0sIGxpc3RlbmVyXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBUaGUgZXZlbnQgd2Ugd2FudCB0byByZW1vdmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgdGhhdCB3ZSBuZWVkIHRvIGZpbmQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgT25seSByZW1vdmUgb25jZSBsaXN0ZW5lcnMuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBvbmNlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbZXZlbnRdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICAgICwgZXZlbnRzID0gW107XG5cbiAgaWYgKGZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5mbiAmJiAobGlzdGVuZXJzLmZuICE9PSBmbiB8fCAob25jZSAmJiAhbGlzdGVuZXJzLm9uY2UpKSkge1xuICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0ZW5lcnMuZm4pIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0uZm4gIT09IGZuIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSkpIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gIC8vXG4gIGlmIChldmVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgb3Igb25seSB0aGUgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBUaGUgZXZlbnQgd2FudCB0byByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuIHRoaXM7XG5cbiAgaWYgKGV2ZW50KSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgZWxzZSB0aGlzLl9ldmVudHMgPSB7fTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyMiA9IEV2ZW50RW1pdHRlcjtcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIzID0gRXZlbnRFbWl0dGVyO1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG4iLCIvKiEgTmF0aXZlIFByb21pc2UgT25seVxuICAgIHYwLjcuNi1hIChjKSBLeWxlIFNpbXBzb25cbiAgICBNSVQgTGljZW5zZTogaHR0cDovL2dldGlmeS5taXQtbGljZW5zZS5vcmdcbiovXG4hZnVuY3Rpb24odCxuLGUpe25bdF09blt0XXx8ZSgpLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPW5bdF06XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kJiZkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gblt0XX0pfShcIlByb21pc2VcIixcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdCh0LG4pe2wuYWRkKHQsbiksaHx8KGg9eShsLmRyYWluKSl9ZnVuY3Rpb24gbih0KXt2YXIgbixlPXR5cGVvZiB0O3JldHVybiBudWxsPT10fHxcIm9iamVjdFwiIT1lJiZcImZ1bmN0aW9uXCIhPWV8fChuPXQudGhlbiksXCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uOiExfWZ1bmN0aW9uIGUoKXtmb3IodmFyIHQ9MDt0PHRoaXMuY2hhaW4ubGVuZ3RoO3QrKylvKHRoaXMsMT09PXRoaXMuc3RhdGU/dGhpcy5jaGFpblt0XS5zdWNjZXNzOnRoaXMuY2hhaW5bdF0uZmFpbHVyZSx0aGlzLmNoYWluW3RdKTt0aGlzLmNoYWluLmxlbmd0aD0wfWZ1bmN0aW9uIG8odCxlLG8pe3ZhciByLGk7dHJ5e2U9PT0hMT9vLnJlamVjdCh0Lm1zZyk6KHI9ZT09PSEwP3QubXNnOmUuY2FsbCh2b2lkIDAsdC5tc2cpLHI9PT1vLnByb21pc2U/by5yZWplY3QoVHlwZUVycm9yKFwiUHJvbWlzZS1jaGFpbiBjeWNsZVwiKSk6KGk9bihyKSk/aS5jYWxsKHIsby5yZXNvbHZlLG8ucmVqZWN0KTpvLnJlc29sdmUocikpfWNhdGNoKGMpe28ucmVqZWN0KGMpfX1mdW5jdGlvbiByKG8pe3ZhciBjLHUsYT10aGlzO2lmKCFhLnRyaWdnZXJlZCl7YS50cmlnZ2VyZWQ9ITAsYS5kZWYmJihhPWEuZGVmKTt0cnl7KGM9bihvKSk/KHU9bmV3IGYoYSksYy5jYWxsKG8sZnVuY3Rpb24oKXtyLmFwcGx5KHUsYXJndW1lbnRzKX0sZnVuY3Rpb24oKXtpLmFwcGx5KHUsYXJndW1lbnRzKX0pKTooYS5tc2c9byxhLnN0YXRlPTEsYS5jaGFpbi5sZW5ndGg+MCYmdChlLGEpKX1jYXRjaChzKXtpLmNhbGwodXx8bmV3IGYoYSkscyl9fX1mdW5jdGlvbiBpKG4pe3ZhciBvPXRoaXM7by50cmlnZ2VyZWR8fChvLnRyaWdnZXJlZD0hMCxvLmRlZiYmKG89by5kZWYpLG8ubXNnPW4sby5zdGF0ZT0yLG8uY2hhaW4ubGVuZ3RoPjAmJnQoZSxvKSl9ZnVuY3Rpb24gYyh0LG4sZSxvKXtmb3IodmFyIHI9MDtyPG4ubGVuZ3RoO3IrKykhZnVuY3Rpb24ocil7dC5yZXNvbHZlKG5bcl0pLnRoZW4oZnVuY3Rpb24odCl7ZShyLHQpfSxvKX0ocil9ZnVuY3Rpb24gZih0KXt0aGlzLmRlZj10LHRoaXMudHJpZ2dlcmVkPSExfWZ1bmN0aW9uIHUodCl7dGhpcy5wcm9taXNlPXQsdGhpcy5zdGF0ZT0wLHRoaXMudHJpZ2dlcmVkPSExLHRoaXMuY2hhaW49W10sdGhpcy5tc2c9dm9pZCAwfWZ1bmN0aW9uIGEobil7aWYoXCJmdW5jdGlvblwiIT10eXBlb2Ygbil0aHJvdyBUeXBlRXJyb3IoXCJOb3QgYSBmdW5jdGlvblwiKTtpZigwIT09dGhpcy5fX05QT19fKXRocm93IFR5cGVFcnJvcihcIk5vdCBhIHByb21pc2VcIik7dGhpcy5fX05QT19fPTE7dmFyIG89bmV3IHUodGhpcyk7dGhpcy50aGVuPWZ1bmN0aW9uKG4scil7dmFyIGk9e3N1Y2Nlc3M6XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uOiEwLGZhaWx1cmU6XCJmdW5jdGlvblwiPT10eXBlb2Ygcj9yOiExfTtyZXR1cm4gaS5wcm9taXNlPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGZ1bmN0aW9uKHQsbil7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdHx8XCJmdW5jdGlvblwiIT10eXBlb2Ygbil0aHJvdyBUeXBlRXJyb3IoXCJOb3QgYSBmdW5jdGlvblwiKTtpLnJlc29sdmU9dCxpLnJlamVjdD1ufSksby5jaGFpbi5wdXNoKGkpLDAhPT1vLnN0YXRlJiZ0KGUsbyksaS5wcm9taXNlfSx0aGlzW1wiY2F0Y2hcIl09ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMudGhlbih2b2lkIDAsdCl9O3RyeXtuLmNhbGwodm9pZCAwLGZ1bmN0aW9uKHQpe3IuY2FsbChvLHQpfSxmdW5jdGlvbih0KXtpLmNhbGwobyx0KX0pfWNhdGNoKGMpe2kuY2FsbChvLGMpfX12YXIgcyxoLGwscD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLHk9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNldEltbWVkaWF0ZT9mdW5jdGlvbih0KXtyZXR1cm4gc2V0SW1tZWRpYXRlKHQpfTpzZXRUaW1lb3V0O3RyeXtPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sXCJ4XCIse30pLHM9ZnVuY3Rpb24odCxuLGUsbyl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LG4se3ZhbHVlOmUsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOm8hPT0hMX0pfX1jYXRjaChkKXtzPWZ1bmN0aW9uKHQsbixlKXtyZXR1cm4gdFtuXT1lLHR9fWw9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsbil7dGhpcy5mbj10LHRoaXMuc2VsZj1uLHRoaXMubmV4dD12b2lkIDB9dmFyIG4sZSxvO3JldHVybnthZGQ6ZnVuY3Rpb24ocixpKXtvPW5ldyB0KHIsaSksZT9lLm5leHQ9bzpuPW8sZT1vLG89dm9pZCAwfSxkcmFpbjpmdW5jdGlvbigpe3ZhciB0PW47Zm9yKG49ZT1oPXZvaWQgMDt0Oyl0LmZuLmNhbGwodC5zZWxmKSx0PXQubmV4dH19fSgpO3ZhciBnPXMoe30sXCJjb25zdHJ1Y3RvclwiLGEsITEpO3JldHVybiBzKGEsXCJwcm90b3R5cGVcIixnLCExKSxzKGcsXCJfX05QT19fXCIsMCwhMSkscyhhLFwicmVzb2x2ZVwiLGZ1bmN0aW9uKHQpe3ZhciBuPXRoaXM7cmV0dXJuIHQmJlwib2JqZWN0XCI9PXR5cGVvZiB0JiYxPT09dC5fX05QT19fP3Q6bmV3IG4oZnVuY3Rpb24obixlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBufHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IFR5cGVFcnJvcihcIk5vdCBhIGZ1bmN0aW9uXCIpO24odCl9KX0pLHMoYSxcInJlamVjdFwiLGZ1bmN0aW9uKHQpe3JldHVybiBuZXcgdGhpcyhmdW5jdGlvbihuLGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIG58fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7ZSh0KX0pfSkscyhhLFwiYWxsXCIsZnVuY3Rpb24odCl7dmFyIG49dGhpcztyZXR1cm5cIltvYmplY3QgQXJyYXldXCIhPXAuY2FsbCh0KT9uLnJlamVjdChUeXBlRXJyb3IoXCJOb3QgYW4gYXJyYXlcIikpOjA9PT10Lmxlbmd0aD9uLnJlc29sdmUoW10pOm5ldyBuKGZ1bmN0aW9uKGUsbyl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZXx8XCJmdW5jdGlvblwiIT10eXBlb2Ygbyl0aHJvdyBUeXBlRXJyb3IoXCJOb3QgYSBmdW5jdGlvblwiKTt2YXIgcj10Lmxlbmd0aCxpPUFycmF5KHIpLGY9MDtjKG4sdCxmdW5jdGlvbih0LG4pe2lbdF09biwrK2Y9PT1yJiZlKGkpfSxvKX0pfSkscyhhLFwicmFjZVwiLGZ1bmN0aW9uKHQpe3ZhciBuPXRoaXM7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiIT1wLmNhbGwodCk/bi5yZWplY3QoVHlwZUVycm9yKFwiTm90IGFuIGFycmF5XCIpKTpuZXcgbihmdW5jdGlvbihlLG8pe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGV8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIG8pdGhyb3cgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7YyhuLHQsZnVuY3Rpb24odCxuKXtlKG4pfSxvKX0pfSksYX0pO1xuIiwiLyoqXG4gKiBBIG1vZHVsZSBvZiBtZXRob2RzIHRoYXQgeW91IHdhbnQgdG8gaW5jbHVkZSBpbiBhbGwgYWN0aW9ucy5cbiAqIFRoaXMgbW9kdWxlIGlzIGNvbnN1bWVkIGJ5IGBjcmVhdGVBY3Rpb25gLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbn07XG4iLCJleHBvcnRzLmNyZWF0ZWRTdG9yZXMgPSBbXTtcblxuZXhwb3J0cy5jcmVhdGVkQWN0aW9ucyA9IFtdO1xuXG5leHBvcnRzLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgd2hpbGUoZXhwb3J0cy5jcmVhdGVkU3RvcmVzLmxlbmd0aCkge1xuICAgICAgICBleHBvcnRzLmNyZWF0ZWRTdG9yZXMucG9wKCk7XG4gICAgfVxuICAgIHdoaWxlKGV4cG9ydHMuY3JlYXRlZEFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGV4cG9ydHMuY3JlYXRlZEFjdGlvbnMucG9wKCk7XG4gICAgfVxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIG1ha2VyID0gcmVxdWlyZSgnLi9qb2lucycpLmluc3RhbmNlSm9pbkNyZWF0b3I7XG5cbi8qKlxuICogRXh0cmFjdCBjaGlsZCBsaXN0ZW5hYmxlcyBmcm9tIGEgcGFyZW50IGZyb20gdGhlaXJcbiAqIGNoaWxkcmVuIHByb3BlcnR5IGFuZCByZXR1cm4gdGhlbSBpbiBhIGtleWVkIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0ZW5hYmxlIFRoZSBwYXJlbnQgbGlzdGVuYWJsZVxuICovXG52YXIgbWFwQ2hpbGRMaXN0ZW5hYmxlcyA9IGZ1bmN0aW9uKGxpc3RlbmFibGUpIHtcbiAgICB2YXIgaSA9IDAsIGNoaWxkcmVuID0ge30sIGNoaWxkTmFtZTtcbiAgICBmb3IgKDtpIDwgKGxpc3RlbmFibGUuY2hpbGRyZW58fFtdKS5sZW5ndGg7ICsraSkge1xuICAgICAgICBjaGlsZE5hbWUgPSBsaXN0ZW5hYmxlLmNoaWxkcmVuW2ldO1xuICAgICAgICBpZihsaXN0ZW5hYmxlW2NoaWxkTmFtZV0pe1xuICAgICAgICAgICAgY2hpbGRyZW5bY2hpbGROYW1lXSA9IGxpc3RlbmFibGVbY2hpbGROYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hpbGRyZW47XG59O1xuXG4vKipcbiAqIE1ha2UgYSBmbGF0IGRpY3Rpb25hcnkgb2YgYWxsIGxpc3RlbmFibGVzIGluY2x1ZGluZyB0aGVpclxuICogcG9zc2libGUgY2hpbGRyZW4gKHJlY3Vyc2l2ZWx5KSwgY29uY2F0ZW5hdGluZyBuYW1lcyBpbiBjYW1lbENhc2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGxpc3RlbmFibGVzIFRoZSB0b3AtbGV2ZWwgbGlzdGVuYWJsZXNcbiAqL1xudmFyIGZsYXR0ZW5MaXN0ZW5hYmxlcyA9IGZ1bmN0aW9uKGxpc3RlbmFibGVzKSB7XG4gICAgdmFyIGZsYXR0ZW5lZCA9IHt9O1xuICAgIGZvcih2YXIga2V5IGluIGxpc3RlbmFibGVzKXtcbiAgICAgICAgdmFyIGxpc3RlbmFibGUgPSBsaXN0ZW5hYmxlc1trZXldO1xuICAgICAgICB2YXIgY2hpbGRNYXAgPSBtYXBDaGlsZExpc3RlbmFibGVzKGxpc3RlbmFibGUpO1xuXG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGZsYXR0ZW4gY2hpbGRyZW5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gZmxhdHRlbkxpc3RlbmFibGVzKGNoaWxkTWFwKTtcblxuICAgICAgICAvLyBhZGQgdGhlIHByaW1hcnkgbGlzdGVuYWJsZSBhbmQgY2hpbHJlblxuICAgICAgICBmbGF0dGVuZWRba2V5XSA9IGxpc3RlbmFibGU7XG4gICAgICAgIGZvcih2YXIgY2hpbGRLZXkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgdmFyIGNoaWxkTGlzdGVuYWJsZSA9IGNoaWxkcmVuW2NoaWxkS2V5XTtcbiAgICAgICAgICAgIGZsYXR0ZW5lZFtrZXkgKyBfLmNhcGl0YWxpemUoY2hpbGRLZXkpXSA9IGNoaWxkTGlzdGVuYWJsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuZWQ7XG59O1xuXG4vKipcbiAqIEEgbW9kdWxlIG9mIG1ldGhvZHMgcmVsYXRlZCB0byBsaXN0ZW5pbmcuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJuYWwgdXRpbGl0eSBmdW5jdGlvbiB1c2VkIGJ5IGB2YWxpZGF0ZUxpc3RlbmluZ2BcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QWN0aW9ufFN0b3JlfSBsaXN0ZW5hYmxlIFRoZSBsaXN0ZW5hYmxlIHdlIHdhbnQgdG8gc2VhcmNoIGZvclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBUaGUgcmVzdWx0IG9mIGEgcmVjdXJzaXZlIHNlYXJjaCBhbW9uZyBgdGhpcy5zdWJzY3JpcHRpb25zYFxuICAgICAqL1xuICAgIGhhc0xpc3RlbmVyOiBmdW5jdGlvbihsaXN0ZW5hYmxlKSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbGlzdGVuZXIsIGxpc3RlbmFibGVzO1xuICAgICAgICBmb3IgKDtpIDwgKHRoaXMuc3Vic2NyaXB0aW9uc3x8W10pLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsaXN0ZW5hYmxlcyA9IFtdLmNvbmNhdCh0aGlzLnN1YnNjcmlwdGlvbnNbaV0ubGlzdGVuYWJsZSk7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbGlzdGVuYWJsZXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuYWJsZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09PSBsaXN0ZW5hYmxlIHx8IGxpc3RlbmVyLmhhc0xpc3RlbmVyICYmIGxpc3RlbmVyLmhhc0xpc3RlbmVyKGxpc3RlbmFibGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEEgY29udmVuaWVuY2UgbWV0aG9kIHRoYXQgbGlzdGVucyB0byBhbGwgbGlzdGVuYWJsZXMgaW4gdGhlIGdpdmVuIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0ZW5hYmxlcyBBbiBvYmplY3Qgb2YgbGlzdGVuYWJsZXMuIEtleXMgd2lsbCBiZSB1c2VkIGFzIGNhbGxiYWNrIG1ldGhvZCBuYW1lcy5cbiAgICAgKi9cbiAgICBsaXN0ZW5Ub01hbnk6IGZ1bmN0aW9uKGxpc3RlbmFibGVzKXtcbiAgICAgICAgdmFyIGFsbExpc3RlbmFibGVzID0gZmxhdHRlbkxpc3RlbmFibGVzKGxpc3RlbmFibGVzKTtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gYWxsTGlzdGVuYWJsZXMpe1xuICAgICAgICAgICAgdmFyIGNibmFtZSA9IF8uY2FsbGJhY2tOYW1lKGtleSksXG4gICAgICAgICAgICAgICAgbG9jYWxuYW1lID0gdGhpc1tjYm5hbWVdID8gY2JuYW1lIDogdGhpc1trZXldID8ga2V5IDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKGxvY2FsbmFtZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5UbyhhbGxMaXN0ZW5hYmxlc1trZXldLGxvY2FsbmFtZSx0aGlzW2NibmFtZStcIkRlZmF1bHRcIl18fHRoaXNbbG9jYWxuYW1lK1wiRGVmYXVsdFwiXXx8bG9jYWxuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgY29udGV4dCBjYW4gbGlzdGVuIHRvIHRoZSBzdXBwbGllZCBsaXN0ZW5hYmxlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FjdGlvbnxTdG9yZX0gbGlzdGVuYWJsZSBBbiBBY3Rpb24gb3IgU3RvcmUgdGhhdCBzaG91bGQgYmVcbiAgICAgKiAgbGlzdGVuZWQgdG8uXG4gICAgICogQHJldHVybnMge1N0cmluZ3xVbmRlZmluZWR9IEFuIGVycm9yIG1lc3NhZ2UsIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSB3YXMgbm8gcHJvYmxlbS5cbiAgICAgKi9cbiAgICB2YWxpZGF0ZUxpc3RlbmluZzogZnVuY3Rpb24obGlzdGVuYWJsZSl7XG4gICAgICAgIGlmIChsaXN0ZW5hYmxlID09PSB0aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJMaXN0ZW5lciBpcyBub3QgYWJsZSB0byBsaXN0ZW4gdG8gaXRzZWxmXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24obGlzdGVuYWJsZS5saXN0ZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuYWJsZSArIFwiIGlzIG1pc3NpbmcgYSBsaXN0ZW4gbWV0aG9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3RlbmFibGUuaGFzTGlzdGVuZXIgJiYgbGlzdGVuYWJsZS5oYXNMaXN0ZW5lcih0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTGlzdGVuZXIgY2Fubm90IGxpc3RlbiB0byB0aGlzIGxpc3RlbmFibGUgYmVjYXVzZSBvZiBjaXJjdWxhciBsb29wXCI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBhIHN1YnNjcmlwdGlvbiB0byB0aGUgZ2l2ZW4gbGlzdGVuYWJsZSBmb3IgdGhlIGNvbnRleHQgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FjdGlvbnxTdG9yZX0gbGlzdGVuYWJsZSBBbiBBY3Rpb24gb3IgU3RvcmUgdGhhdCBzaG91bGQgYmVcbiAgICAgKiAgbGlzdGVuZWQgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byByZWdpc3RlciBhcyBldmVudCBoYW5kbGVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IGRlZmF1bHRDYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXIgYXMgZGVmYXVsdCBoYW5kbGVyXG4gICAgICogQHJldHVybnMge09iamVjdH0gQSBzdWJzY3JpcHRpb24gb2JqIHdoZXJlIGBzdG9wYCBpcyBhbiB1bnN1YiBmdW5jdGlvbiBhbmQgYGxpc3RlbmFibGVgIGlzIHRoZSBvYmplY3QgYmVpbmcgbGlzdGVuZWQgdG9cbiAgICAgKi9cbiAgICBsaXN0ZW5UbzogZnVuY3Rpb24obGlzdGVuYWJsZSwgY2FsbGJhY2ssIGRlZmF1bHRDYWxsYmFjaykge1xuICAgICAgICB2YXIgZGVzdWIsIHVuc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9ub2JqLCBzdWJzID0gdGhpcy5zdWJzY3JpcHRpb25zID0gdGhpcy5zdWJzY3JpcHRpb25zIHx8IFtdO1xuICAgICAgICBfLnRocm93SWYodGhpcy52YWxpZGF0ZUxpc3RlbmluZyhsaXN0ZW5hYmxlKSk7XG4gICAgICAgIHRoaXMuZmV0Y2hJbml0aWFsU3RhdGUobGlzdGVuYWJsZSwgZGVmYXVsdENhbGxiYWNrKTtcbiAgICAgICAgZGVzdWIgPSBsaXN0ZW5hYmxlLmxpc3Rlbih0aGlzW2NhbGxiYWNrXXx8Y2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICB1bnN1YnNjcmliZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnMuaW5kZXhPZihzdWJzY3JpcHRpb25vYmopO1xuICAgICAgICAgICAgXy50aHJvd0lmKGluZGV4ID09PSAtMSwnVHJpZWQgdG8gcmVtb3ZlIGxpc3RlbiBhbHJlYWR5IGdvbmUgZnJvbSBzdWJzY3JpcHRpb25zIGxpc3QhJyk7XG4gICAgICAgICAgICBzdWJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICBkZXN1YigpO1xuICAgICAgICB9O1xuICAgICAgICBzdWJzY3JpcHRpb25vYmogPSB7XG4gICAgICAgICAgICBzdG9wOiB1bnN1YnNjcmliZXIsXG4gICAgICAgICAgICBsaXN0ZW5hYmxlOiBsaXN0ZW5hYmxlXG4gICAgICAgIH07XG4gICAgICAgIHN1YnMucHVzaChzdWJzY3JpcHRpb25vYmopO1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9ub2JqO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyBsaXN0ZW5pbmcgdG8gYSBzaW5nbGUgbGlzdGVuYWJsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBY3Rpb258U3RvcmV9IGxpc3RlbmFibGUgVGhlIGFjdGlvbiBvciBzdG9yZSB3ZSBubyBsb25nZXIgd2FudCB0byBsaXN0ZW4gdG9cbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiBhIHN1YnNjcmlwdGlvbiB3YXMgZm91bmQgYW5kIHJlbW92ZWQsIG90aGVyd2lzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBzdG9wTGlzdGVuaW5nVG86IGZ1bmN0aW9uKGxpc3RlbmFibGUpe1xuICAgICAgICB2YXIgc3ViLCBpID0gMCwgc3VicyA9IHRoaXMuc3Vic2NyaXB0aW9ucyB8fCBbXTtcbiAgICAgICAgZm9yKDtpIDwgc3Vicy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBzdWIgPSBzdWJzW2ldO1xuICAgICAgICAgICAgaWYgKHN1Yi5saXN0ZW5hYmxlID09PSBsaXN0ZW5hYmxlKXtcbiAgICAgICAgICAgICAgICBzdWIuc3RvcCgpO1xuICAgICAgICAgICAgICAgIF8udGhyb3dJZihzdWJzLmluZGV4T2Yoc3ViKSE9PS0xLCdGYWlsZWQgdG8gcmVtb3ZlIGxpc3RlbiBmcm9tIHN1YnNjcmlwdGlvbnMgbGlzdCEnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIGFsbCBzdWJzY3JpcHRpb25zIGFuZCBlbXB0aWVzIHN1YnNjcmlwdGlvbnMgYXJyYXlcbiAgICAgKi9cbiAgICBzdG9wTGlzdGVuaW5nVG9BbGw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciByZW1haW5pbmcsIHN1YnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMgfHwgW107XG4gICAgICAgIHdoaWxlKChyZW1haW5pbmc9c3Vicy5sZW5ndGgpKXtcbiAgICAgICAgICAgIHN1YnNbMF0uc3RvcCgpO1xuICAgICAgICAgICAgXy50aHJvd0lmKHN1YnMubGVuZ3RoIT09cmVtYWluaW5nLTEsJ0ZhaWxlZCB0byByZW1vdmUgbGlzdGVuIGZyb20gc3Vic2NyaXB0aW9ucyBsaXN0IScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVzZWQgaW4gYGxpc3RlblRvYC4gRmV0Y2hlcyBpbml0aWFsIGRhdGEgZnJvbSBhIHB1Ymxpc2hlciBpZiBpdCBoYXMgYSBgZ2V0SW5pdGlhbFN0YXRlYCBtZXRob2QuXG4gICAgICogQHBhcmFtIHtBY3Rpb258U3RvcmV9IGxpc3RlbmFibGUgVGhlIHB1Ymxpc2hlciB3ZSB3YW50IHRvIGdldCBpbml0aWFsIHN0YXRlIGZyb21cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gZGVmYXVsdENhbGxiYWNrIFRoZSBtZXRob2QgdG8gcmVjZWl2ZSB0aGUgZGF0YVxuICAgICAqL1xuICAgIGZldGNoSW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAobGlzdGVuYWJsZSwgZGVmYXVsdENhbGxiYWNrKSB7XG4gICAgICAgIGRlZmF1bHRDYWxsYmFjayA9IChkZWZhdWx0Q2FsbGJhY2sgJiYgdGhpc1tkZWZhdWx0Q2FsbGJhY2tdKSB8fCBkZWZhdWx0Q2FsbGJhY2s7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZGVmYXVsdENhbGxiYWNrKSAmJiBfLmlzRnVuY3Rpb24obGlzdGVuYWJsZS5nZXRJbml0aWFsU3RhdGUpKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGxpc3RlbmFibGUuZ2V0SW5pdGlhbFN0YXRlKCk7XG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBfLmlzRnVuY3Rpb24oZGF0YS50aGVuKSkge1xuICAgICAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENhbGxiYWNrLmFwcGx5KG1lLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0Q2FsbGJhY2suY2FsbCh0aGlzLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgbGlzdGVuYWJsZXMgaGF2ZSB0cmlnZ2VyZWQgYXQgbGVhc3Qgb25jZS5cbiAgICAgKiBJdCB3aWxsIGJlIGludm9rZWQgd2l0aCB0aGUgbGFzdCBlbWlzc2lvbiBmcm9tIGVhY2ggbGlzdGVuYWJsZS5cbiAgICAgKiBAcGFyYW0gey4uLlB1Ymxpc2hlcnN9IHB1Ymxpc2hlcnMgUHVibGlzaGVycyB0aGF0IHNob3VsZCBiZSB0cmFja2VkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBjYWxsYmFjayBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiBhbGwgcHVibGlzaGVycyBoYXZlIGVtaXR0ZWRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIHN1YnNjcmlwdGlvbiBvYmogd2hlcmUgYHN0b3BgIGlzIGFuIHVuc3ViIGZ1bmN0aW9uIGFuZCBgbGlzdGVuYWJsZWAgaXMgYW4gYXJyYXkgb2YgbGlzdGVuYWJsZXNcbiAgICAgKi9cbiAgICBqb2luVHJhaWxpbmc6IG1ha2VyKFwibGFzdFwiKSxcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBsaXN0ZW5hYmxlcyBoYXZlIHRyaWdnZXJlZCBhdCBsZWFzdCBvbmNlLlxuICAgICAqIEl0IHdpbGwgYmUgaW52b2tlZCB3aXRoIHRoZSBmaXJzdCBlbWlzc2lvbiBmcm9tIGVhY2ggbGlzdGVuYWJsZS5cbiAgICAgKiBAcGFyYW0gey4uLlB1Ymxpc2hlcnN9IHB1Ymxpc2hlcnMgUHVibGlzaGVycyB0aGF0IHNob3VsZCBiZSB0cmFja2VkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBjYWxsYmFjayBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiBhbGwgcHVibGlzaGVycyBoYXZlIGVtaXR0ZWRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIHN1YnNjcmlwdGlvbiBvYmogd2hlcmUgYHN0b3BgIGlzIGFuIHVuc3ViIGZ1bmN0aW9uIGFuZCBgbGlzdGVuYWJsZWAgaXMgYW4gYXJyYXkgb2YgbGlzdGVuYWJsZXNcbiAgICAgKi9cbiAgICBqb2luTGVhZGluZzogbWFrZXIoXCJmaXJzdFwiKSxcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBsaXN0ZW5hYmxlcyBoYXZlIHRyaWdnZXJlZCBhdCBsZWFzdCBvbmNlLlxuICAgICAqIEl0IHdpbGwgYmUgaW52b2tlZCB3aXRoIGFsbCBlbWlzc2lvbiBmcm9tIGVhY2ggbGlzdGVuYWJsZS5cbiAgICAgKiBAcGFyYW0gey4uLlB1Ymxpc2hlcnN9IHB1Ymxpc2hlcnMgUHVibGlzaGVycyB0aGF0IHNob3VsZCBiZSB0cmFja2VkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBjYWxsYmFjayBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiBhbGwgcHVibGlzaGVycyBoYXZlIGVtaXR0ZWRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIHN1YnNjcmlwdGlvbiBvYmogd2hlcmUgYHN0b3BgIGlzIGFuIHVuc3ViIGZ1bmN0aW9uIGFuZCBgbGlzdGVuYWJsZWAgaXMgYW4gYXJyYXkgb2YgbGlzdGVuYWJsZXNcbiAgICAgKi9cbiAgICBqb2luQ29uY2F0OiBtYWtlcihcImFsbFwiKSxcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCBsaXN0ZW5hYmxlcyBoYXZlIHRyaWdnZXJlZC5cbiAgICAgKiBJZiBhIGNhbGxiYWNrIHRyaWdnZXJzIHR3aWNlIGJlZm9yZSB0aGF0IGhhcHBlbnMsIGFuIGVycm9yIGlzIHRocm93bi5cbiAgICAgKiBAcGFyYW0gey4uLlB1Ymxpc2hlcnN9IHB1Ymxpc2hlcnMgUHVibGlzaGVycyB0aGF0IHNob3VsZCBiZSB0cmFja2VkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSBjYWxsYmFjayBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiBhbGwgcHVibGlzaGVycyBoYXZlIGVtaXR0ZWRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIHN1YnNjcmlwdGlvbiBvYmogd2hlcmUgYHN0b3BgIGlzIGFuIHVuc3ViIGZ1bmN0aW9uIGFuZCBgbGlzdGVuYWJsZWAgaXMgYW4gYXJyYXkgb2YgbGlzdGVuYWJsZXNcbiAgICAgKi9cbiAgICBqb2luU3RyaWN0OiBtYWtlcihcInN0cmljdFwiKVxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIExpc3RlbmVyTWV0aG9kcyA9IHJlcXVpcmUoJy4vTGlzdGVuZXJNZXRob2RzJyk7XG5cbi8qKlxuICogQSBtb2R1bGUgbWVhbnQgdG8gYmUgY29uc3VtZWQgYXMgYSBtaXhpbiBieSBhIFJlYWN0IGNvbXBvbmVudC4gU3VwcGxpZXMgdGhlIG1ldGhvZHMgZnJvbVxuICogYExpc3RlbmVyTWV0aG9kc2AgbWl4aW4gYW5kIHRha2VzIGNhcmUgb2YgdGVhcmRvd24gb2Ygc3Vic2NyaXB0aW9ucy5cbiAqIE5vdGUgdGhhdCBpZiB5b3UncmUgdXNpbmcgdGhlIGBjb25uZWN0YCBtaXhpbiB5b3UgZG9uJ3QgbmVlZCB0aGlzIG1peGluLCBhcyBjb25uZWN0IHdpbGxcbiAqIGltcG9ydCBldmVyeXRoaW5nIHRoaXMgbWl4aW4gY29udGFpbnMhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gXy5leHRlbmQoe1xuXG4gICAgLyoqXG4gICAgICogQ2xlYW5zIHVwIGFsbCBsaXN0ZW5lciBwcmV2aW91c2x5IHJlZ2lzdGVyZWQuXG4gICAgICovXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IExpc3RlbmVyTWV0aG9kcy5zdG9wTGlzdGVuaW5nVG9BbGxcblxufSwgTGlzdGVuZXJNZXRob2RzKTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIEEgbW9kdWxlIG9mIG1ldGhvZHMgZm9yIG9iamVjdCB0aGF0IHlvdSB3YW50IHRvIGJlIGFibGUgdG8gbGlzdGVuIHRvLlxuICogVGhpcyBtb2R1bGUgaXMgY29uc3VtZWQgYnkgYGNyZWF0ZVN0b3JlYCBhbmQgYGNyZWF0ZUFjdGlvbmBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAvKipcbiAgICAgKiBIb29rIHVzZWQgYnkgdGhlIHB1Ymxpc2hlciB0aGF0IGlzIGludm9rZWQgYmVmb3JlIGVtaXR0aW5nXG4gICAgICogYW5kIGJlZm9yZSBgc2hvdWxkRW1pdGAuIFRoZSBhcmd1bWVudHMgYXJlIHRoZSBvbmVzIHRoYXQgdGhlIGFjdGlvblxuICAgICAqIGlzIGludm9rZWQgd2l0aC4gSWYgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHNvbWV0aGluZyBvdGhlciB0aGFuXG4gICAgICogdW5kZWZpbmVkLCB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIGFzIGFyZ3VtZW50cyBmb3Igc2hvdWxkRW1pdCBhbmRcbiAgICAgKiBlbWlzc2lvbi5cbiAgICAgKi9cbiAgICBwcmVFbWl0OiBmdW5jdGlvbigpIHt9LFxuXG4gICAgLyoqXG4gICAgICogSG9vayB1c2VkIGJ5IHRoZSBwdWJsaXNoZXIgYWZ0ZXIgYHByZUVtaXRgIHRvIGRldGVybWluZSBpZiB0aGVcbiAgICAgKiBldmVudCBzaG91bGQgYmUgZW1pdHRlZCB3aXRoIGdpdmVuIGFyZ3VtZW50cy4gVGhpcyBtYXkgYmUgb3ZlcnJpZGRlblxuICAgICAqIGluIHlvdXIgYXBwbGljYXRpb24sIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gYWx3YXlzIHJldHVybnMgdHJ1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGV2ZW50IHNob3VsZCBiZSBlbWl0dGVkXG4gICAgICovXG4gICAgc2hvdWxkRW1pdDogZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9LFxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGFjdGlvbiB0cmlnZ2VyZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byByZWdpc3RlciBhcyBldmVudCBoYW5kbGVyXG4gICAgICogQHBhcmFtIHtNaXhlZH0gW29wdGlvbmFsXSBiaW5kQ29udGV4dCBUaGUgY29udGV4dCB0byBiaW5kIHRoZSBjYWxsYmFjayB3aXRoXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBDYWxsYmFjayB0aGF0IHVuc3Vic2NyaWJlcyB0aGUgcmVnaXN0ZXJlZCBldmVudCBoYW5kbGVyXG4gICAgICovXG4gICAgbGlzdGVuOiBmdW5jdGlvbihjYWxsYmFjaywgYmluZENvbnRleHQpIHtcbiAgICAgICAgYmluZENvbnRleHQgPSBiaW5kQ29udGV4dCB8fCB0aGlzO1xuICAgICAgICB2YXIgZXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgaWYgKGFib3J0ZWQpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGJpbmRDb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfSwgbWUgPSB0aGlzLCBhYm9ydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW1pdHRlci5hZGRMaXN0ZW5lcih0aGlzLmV2ZW50TGFiZWwsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgbWUuZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihtZS5ldmVudExhYmVsLCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggaGFuZGxlcnMgdG8gcHJvbWlzZSB0aGF0IHRyaWdnZXIgdGhlIGNvbXBsZXRlZCBhbmQgZmFpbGVkXG4gICAgICogY2hpbGQgcHVibGlzaGVycywgaWYgYXZhaWxhYmxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFRoZSBwcm9taXNlIHRvIGF0dGFjaCB0b1xuICAgICAqL1xuICAgIHByb21pc2U6IGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcblxuICAgICAgICB2YXIgY2FuSGFuZGxlUHJvbWlzZSA9XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmluZGV4T2YoJ2NvbXBsZXRlZCcpID49IDAgJiZcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uaW5kZXhPZignZmFpbGVkJykgPj0gMDtcblxuICAgICAgICBpZiAoIWNhbkhhbmRsZVByb21pc2Upe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQdWJsaXNoZXIgbXVzdCBoYXZlIFwiY29tcGxldGVkXCIgYW5kIFwiZmFpbGVkXCIgY2hpbGQgcHVibGlzaGVycycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbWUuY29tcGxldGVkKHJlc3BvbnNlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBtZS5mYWlsZWQoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGFjdGlvbiB0cmlnZ2VyZWQsIHdoaWNoIHNob3VsZFxuICAgICAqIHJldHVybiBhIHByb21pc2UgdGhhdCBpbiB0dXJuIGlzIHBhc3NlZCB0byBgdGhpcy5wcm9taXNlYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHJlZ2lzdGVyIGFzIGV2ZW50IGhhbmRsZXJcbiAgICAgKi9cbiAgICBsaXN0ZW5BbmRQcm9taXNlOiBmdW5jdGlvbihjYWxsYmFjaywgYmluZENvbnRleHQpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgYmluZENvbnRleHQgPSBiaW5kQ29udGV4dCB8fCB0aGlzO1xuICAgICAgICB0aGlzLndpbGxDYWxsUHJvbWlzZSA9ICh0aGlzLndpbGxDYWxsUHJvbWlzZSB8fCAwKSArIDE7XG5cbiAgICAgICAgdmFyIHJlbW92ZUxpc3RlbiA9IHRoaXMubGlzdGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIGZ1bmN0aW9uIHJldHVybmluZyBhIHByb21pc2UgYnV0IGdvdCAnICsgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICBwcm9taXNlID0gY2FsbGJhY2suYXBwbHkoYmluZENvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIG1lLnByb21pc2UuY2FsbChtZSwgcHJvbWlzZSk7XG4gICAgICAgIH0sIGJpbmRDb250ZXh0KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG1lLndpbGxDYWxsUHJvbWlzZS0tO1xuICAgICAgICAgIHJlbW92ZUxpc3Rlbi5jYWxsKG1lKTtcbiAgICAgICAgfTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQdWJsaXNoZXMgYW4gZXZlbnQgdXNpbmcgYHRoaXMuZW1pdHRlcmAgKGlmIGBzaG91bGRFbWl0YCBhZ3JlZXMpXG4gICAgICovXG4gICAgdHJpZ2dlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgcHJlID0gdGhpcy5wcmVFbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICBhcmdzID0gcHJlID09PSB1bmRlZmluZWQgPyBhcmdzIDogXy5pc0FyZ3VtZW50cyhwcmUpID8gcHJlIDogW10uY29uY2F0KHByZSk7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZEVtaXQuYXBwbHkodGhpcywgYXJncykpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KHRoaXMuZXZlbnRMYWJlbCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVHJpZXMgdG8gcHVibGlzaCB0aGUgZXZlbnQgb24gdGhlIG5leHQgdGlja1xuICAgICAqL1xuICAgIHRyaWdnZXJBc3luYzogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsbWUgPSB0aGlzO1xuICAgICAgICBfLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWUudHJpZ2dlci5hcHBseShtZSwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIHRyaWdnZXJlZCBhY3Rpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICogICBSZXNvbHZlZCBieSBjb21wbGV0ZWQgY2hpbGQgYWN0aW9uLlxuICAgICAqICAgUmVqZWN0ZWQgYnkgZmFpbGVkIGNoaWxkIGFjdGlvbi5cbiAgICAgKiAgIElmIGxpc3RlbkFuZFByb21pc2UnZCwgdGhlbiBwcm9taXNlIGFzc29jaWF0ZWQgdG8gdGhpcyB0cmlnZ2VyLlxuICAgICAqICAgT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyBmb3IgbmV4dCBjaGlsZCBhY3Rpb24gY29tcGxldGlvbi5cbiAgICAgKi9cbiAgICB0cmlnZ2VyUHJvbWlzZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgdmFyIGNhbkhhbmRsZVByb21pc2UgPVxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5pbmRleE9mKCdjb21wbGV0ZWQnKSA+PSAwICYmXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmluZGV4T2YoJ2ZhaWxlZCcpID49IDA7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSBfLmNyZWF0ZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvLyBJZiBgbGlzdGVuQW5kUHJvbWlzZWAgaXMgbGlzdGVuaW5nXG4gICAgICAgICAgICAvLyBwYXRjaCBgcHJvbWlzZWAgdy8gY29udGV4dC1sb2FkZWQgcmVzb2x2ZS9yZWplY3RcbiAgICAgICAgICAgIGlmIChtZS53aWxsQ2FsbFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBfLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkX3Byb21pc2VfbWV0aG9kID0gbWUucHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgbWUucHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJhY2sgdG8geW91ciByZWd1bGFybHkgc2NoZWR1bGUgcHJvZ3JhbW1pbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5wcm9taXNlID0gb2xkX3Byb21pc2VfbWV0aG9kO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lLnByb21pc2UuYXBwbHkobWUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIG1lLnRyaWdnZXIuYXBwbHkobWUsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhbkhhbmRsZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVtb3ZlU3VjY2VzcyA9IG1lLmNvbXBsZXRlZC5saXN0ZW4oZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVTdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZhaWxlZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbW92ZUZhaWxlZCA9IG1lLmZhaWxlZC5saXN0ZW4oZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVTdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZhaWxlZCgpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoYXJncyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1lLnRyaWdnZXJBc3luYy5hcHBseShtZSwgYXJncyk7XG5cbiAgICAgICAgICAgIGlmICghY2FuSGFuZGxlUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQSBtb2R1bGUgb2YgbWV0aG9kcyB0aGF0IHlvdSB3YW50IHRvIGluY2x1ZGUgaW4gYWxsIHN0b3Jlcy5cbiAqIFRoaXMgbW9kdWxlIGlzIGNvbnN1bWVkIGJ5IGBjcmVhdGVTdG9yZWAuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RvcmUsIGRlZmluaXRpb24pIHtcbiAgZm9yICh2YXIgbmFtZSBpbiBkZWZpbml0aW9uKSB7XG4gICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGRlZmluaXRpb24sIG5hbWUpO1xuXG4gICAgICAgIGlmICghcHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlIHx8IHR5cGVvZiBwcm9wZXJ0eURlc2NyaXB0b3IudmFsdWUgIT09ICdmdW5jdGlvbicgfHwgIWRlZmluaXRpb24uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcmVbbmFtZV0gPSBkZWZpbml0aW9uW25hbWVdLmJpbmQoc3RvcmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGRlZmluaXRpb25bbmFtZV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eSAhPT0gJ2Z1bmN0aW9uJyB8fCAhZGVmaW5pdGlvbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9yZVtuYW1lXSA9IHByb3BlcnR5LmJpbmQoc3RvcmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdG9yZTtcbn07XG4iLCJ2YXIgUmVmbHV4ID0gcmVxdWlyZSgnLi9pbmRleCcpLFxuICAgIF8gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdGVuYWJsZSxrZXkpe1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGxpc3RlbmFibGUuZ2V0SW5pdGlhbFN0YXRlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdGVuYWJsZS5nZXRJbml0aWFsU3RhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ub2JqZWN0KFtrZXldLFtsaXN0ZW5hYmxlLmdldEluaXRpYWxTdGF0ZSgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXy5leHRlbmQodGhpcyxSZWZsdXguTGlzdGVuZXJNZXRob2RzKTtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIGNiID0gKGtleSA9PT0gdW5kZWZpbmVkID8gdGhpcy5zZXRTdGF0ZSA6IGZ1bmN0aW9uKHYpe21lLnNldFN0YXRlKF8ub2JqZWN0KFtrZXldLFt2XSkpO30pO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5UbyhsaXN0ZW5hYmxlLGNiKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQ6IFJlZmx1eC5MaXN0ZW5lck1peGluLmNvbXBvbmVudFdpbGxVbm1vdW50XG4gICAgfTtcbn07XG4iLCJ2YXIgUmVmbHV4ID0gcmVxdWlyZSgnLi9pbmRleCcpLFxuICBfID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3RlbmFibGUsIGtleSwgZmlsdGVyRnVuYykge1xuICAgIGZpbHRlckZ1bmMgPSBfLmlzRnVuY3Rpb24oa2V5KSA/IGtleSA6IGZpbHRlckZ1bmM7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGxpc3RlbmFibGUuZ2V0SW5pdGlhbFN0YXRlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGtleSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyRnVuYy5jYWxsKHRoaXMsIGxpc3RlbmFibGUuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgaW5pdGlhbCBwYXlsb2FkIGZyb20gc3RvcmUuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZpbHRlckZ1bmMuY2FsbCh0aGlzLCBsaXN0ZW5hYmxlLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXy5vYmplY3QoW2tleV0sIFtyZXN1bHRdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXy5leHRlbmQodGhpcywgUmVmbHV4Lkxpc3RlbmVyTWV0aG9kcyk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2V0U3RhdGUoZmlsdGVyRnVuYy5jYWxsKG1lLCB2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmaWx0ZXJGdW5jLmNhbGwobWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2V0U3RhdGUoXy5vYmplY3QoW2tleV0sIFtyZXN1bHRdKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5saXN0ZW5UbyhsaXN0ZW5hYmxlLCBjYik7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBSZWZsdXguTGlzdGVuZXJNaXhpbi5jb21wb25lbnRXaWxsVW5tb3VudFxuICAgIH07XG59O1xuXG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBSZWZsdXggPSByZXF1aXJlKCcuL2luZGV4JyksXG4gICAgS2VlcCA9IHJlcXVpcmUoJy4vS2VlcCcpLFxuICAgIGFsbG93ZWQgPSB7cHJlRW1pdDoxLHNob3VsZEVtaXQ6MX07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhY3Rpb24gZnVuY3RvciBvYmplY3QuIEl0IGlzIG1peGVkIGluIHdpdGggZnVuY3Rpb25zXG4gKiBmcm9tIHRoZSBgUHVibGlzaGVyTWV0aG9kc2AgbWl4aW4uIGBwcmVFbWl0YCBhbmQgYHNob3VsZEVtaXRgIG1heVxuICogYmUgb3ZlcnJpZGRlbiBpbiB0aGUgZGVmaW5pdGlvbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24gVGhlIGFjdGlvbiBvYmplY3QgZGVmaW5pdGlvblxuICovXG52YXIgY3JlYXRlQWN0aW9uID0gZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuXG4gICAgZGVmaW5pdGlvbiA9IGRlZmluaXRpb24gfHwge307XG4gICAgaWYgKCFfLmlzT2JqZWN0KGRlZmluaXRpb24pKXtcbiAgICAgICAgZGVmaW5pdGlvbiA9IHthY3Rpb25OYW1lOiBkZWZpbml0aW9ufTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGEgaW4gUmVmbHV4LkFjdGlvbk1ldGhvZHMpe1xuICAgICAgICBpZiAoIWFsbG93ZWRbYV0gJiYgUmVmbHV4LlB1Ymxpc2hlck1ldGhvZHNbYV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBBUEkgbWV0aG9kIFwiICsgYSArXG4gICAgICAgICAgICAgICAgXCIgaW4gUmVmbHV4LkFjdGlvbk1ldGhvZHMuIFVzZSBhbm90aGVyIG1ldGhvZCBuYW1lIG9yIG92ZXJyaWRlIGl0IG9uIFJlZmx1eC5QdWJsaXNoZXJNZXRob2RzIGluc3RlYWQuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IodmFyIGQgaW4gZGVmaW5pdGlvbil7XG4gICAgICAgIGlmICghYWxsb3dlZFtkXSAmJiBSZWZsdXguUHVibGlzaGVyTWV0aG9kc1tkXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIEFQSSBtZXRob2QgXCIgKyBkICtcbiAgICAgICAgICAgICAgICBcIiBpbiBhY3Rpb24gY3JlYXRpb24uIFVzZSBhbm90aGVyIG1ldGhvZCBuYW1lIG9yIG92ZXJyaWRlIGl0IG9uIFJlZmx1eC5QdWJsaXNoZXJNZXRob2RzIGluc3RlYWQuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZpbml0aW9uLmNoaWxkcmVuID0gZGVmaW5pdGlvbi5jaGlsZHJlbiB8fCBbXTtcbiAgICBpZiAoZGVmaW5pdGlvbi5hc3luY1Jlc3VsdCl7XG4gICAgICAgIGRlZmluaXRpb24uY2hpbGRyZW4gPSBkZWZpbml0aW9uLmNoaWxkcmVuLmNvbmNhdChbXCJjb21wbGV0ZWRcIixcImZhaWxlZFwiXSk7XG4gICAgfVxuXG4gICAgdmFyIGkgPSAwLCBjaGlsZEFjdGlvbnMgPSB7fTtcbiAgICBmb3IgKDsgaSA8IGRlZmluaXRpb24uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5hbWUgPSBkZWZpbml0aW9uLmNoaWxkcmVuW2ldO1xuICAgICAgICBjaGlsZEFjdGlvbnNbbmFtZV0gPSBjcmVhdGVBY3Rpb24obmFtZSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRleHQgPSBfLmV4dGVuZCh7XG4gICAgICAgIGV2ZW50TGFiZWw6IFwiYWN0aW9uXCIsXG4gICAgICAgIGVtaXR0ZXI6IG5ldyBfLkV2ZW50RW1pdHRlcigpLFxuICAgICAgICBfaXNBY3Rpb246IHRydWVcbiAgICB9LCBSZWZsdXguUHVibGlzaGVyTWV0aG9kcywgUmVmbHV4LkFjdGlvbk1ldGhvZHMsIGRlZmluaXRpb24pO1xuXG4gICAgdmFyIGZ1bmN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0b3JbZnVuY3Rvci5zeW5jP1widHJpZ2dlclwiOlwidHJpZ2dlclByb21pc2VcIl0uYXBwbHkoZnVuY3RvciwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgXy5leHRlbmQoZnVuY3RvcixjaGlsZEFjdGlvbnMsY29udGV4dCk7XG5cbiAgICBLZWVwLmNyZWF0ZWRBY3Rpb25zLnB1c2goZnVuY3Rvcik7XG5cbiAgICByZXR1cm4gZnVuY3RvcjtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBY3Rpb247XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBSZWZsdXggPSByZXF1aXJlKCcuL2luZGV4JyksXG4gICAgS2VlcCA9IHJlcXVpcmUoJy4vS2VlcCcpLFxuICAgIG1peGVyID0gcmVxdWlyZSgnLi9taXhlcicpLFxuICAgIGFsbG93ZWQgPSB7cHJlRW1pdDoxLHNob3VsZEVtaXQ6MX0sXG4gICAgYmluZE1ldGhvZHMgPSByZXF1aXJlKCcuL2JpbmRNZXRob2RzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBldmVudCBlbWl0dGluZyBEYXRhIFN0b3JlLiBJdCBpcyBtaXhlZCBpbiB3aXRoIGZ1bmN0aW9uc1xuICogZnJvbSB0aGUgYExpc3RlbmVyTWV0aG9kc2AgYW5kIGBQdWJsaXNoZXJNZXRob2RzYCBtaXhpbnMuIGBwcmVFbWl0YFxuICogYW5kIGBzaG91bGRFbWl0YCBtYXkgYmUgb3ZlcnJpZGRlbiBpbiB0aGUgZGVmaW5pdGlvbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24gVGhlIGRhdGEgc3RvcmUgb2JqZWN0IGRlZmluaXRpb25cbiAqIEByZXR1cm5zIHtTdG9yZX0gQSBkYXRhIHN0b3JlIGluc3RhbmNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuXG4gICAgZGVmaW5pdGlvbiA9IGRlZmluaXRpb24gfHwge307XG5cbiAgICBmb3IodmFyIGEgaW4gUmVmbHV4LlN0b3JlTWV0aG9kcyl7XG4gICAgICAgIGlmICghYWxsb3dlZFthXSAmJiAoUmVmbHV4LlB1Ymxpc2hlck1ldGhvZHNbYV0gfHwgUmVmbHV4Lkxpc3RlbmVyTWV0aG9kc1thXSkpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIEFQSSBtZXRob2QgXCIgKyBhICtcbiAgICAgICAgICAgICAgICBcIiBpbiBSZWZsdXguU3RvcmVNZXRob2RzLiBVc2UgYW5vdGhlciBtZXRob2QgbmFtZSBvciBvdmVycmlkZSBpdCBvbiBSZWZsdXguUHVibGlzaGVyTWV0aG9kcyAvIFJlZmx1eC5MaXN0ZW5lck1ldGhvZHMgaW5zdGVhZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvcih2YXIgZCBpbiBkZWZpbml0aW9uKXtcbiAgICAgICAgaWYgKCFhbGxvd2VkW2RdICYmIChSZWZsdXguUHVibGlzaGVyTWV0aG9kc1tkXSB8fCBSZWZsdXguTGlzdGVuZXJNZXRob2RzW2RdKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgQVBJIG1ldGhvZCBcIiArIGQgK1xuICAgICAgICAgICAgICAgIFwiIGluIHN0b3JlIGNyZWF0aW9uLiBVc2UgYW5vdGhlciBtZXRob2QgbmFtZSBvciBvdmVycmlkZSBpdCBvbiBSZWZsdXguUHVibGlzaGVyTWV0aG9kcyAvIFJlZmx1eC5MaXN0ZW5lck1ldGhvZHMgaW5zdGVhZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlZmluaXRpb24gPSBtaXhlcihkZWZpbml0aW9uKTtcblxuICAgIGZ1bmN0aW9uIFN0b3JlKCkge1xuICAgICAgICB2YXIgaT0wLCBhcnI7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgXy5FdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5ldmVudExhYmVsID0gXCJjaGFuZ2VcIjtcbiAgICAgICAgYmluZE1ldGhvZHModGhpcywgZGVmaW5pdGlvbik7XG4gICAgICAgIGlmICh0aGlzLmluaXQgJiYgXy5pc0Z1bmN0aW9uKHRoaXMuaW5pdCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmFibGVzKXtcbiAgICAgICAgICAgIGFyciA9IFtdLmNvbmNhdCh0aGlzLmxpc3RlbmFibGVzKTtcbiAgICAgICAgICAgIGZvcig7aSA8IGFyci5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlblRvTWFueShhcnJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoU3RvcmUucHJvdG90eXBlLCBSZWZsdXguTGlzdGVuZXJNZXRob2RzLCBSZWZsdXguUHVibGlzaGVyTWV0aG9kcywgUmVmbHV4LlN0b3JlTWV0aG9kcywgZGVmaW5pdGlvbik7XG5cbiAgICB2YXIgc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICBLZWVwLmNyZWF0ZWRTdG9yZXMucHVzaChzdG9yZSk7XG5cbiAgICByZXR1cm4gc3RvcmU7XG59O1xuIiwiZXhwb3J0cy5BY3Rpb25NZXRob2RzID0gcmVxdWlyZSgnLi9BY3Rpb25NZXRob2RzJyk7XG5cbmV4cG9ydHMuTGlzdGVuZXJNZXRob2RzID0gcmVxdWlyZSgnLi9MaXN0ZW5lck1ldGhvZHMnKTtcblxuZXhwb3J0cy5QdWJsaXNoZXJNZXRob2RzID0gcmVxdWlyZSgnLi9QdWJsaXNoZXJNZXRob2RzJyk7XG5cbmV4cG9ydHMuU3RvcmVNZXRob2RzID0gcmVxdWlyZSgnLi9TdG9yZU1ldGhvZHMnKTtcblxuZXhwb3J0cy5jcmVhdGVBY3Rpb24gPSByZXF1aXJlKCcuL2NyZWF0ZUFjdGlvbicpO1xuXG5leHBvcnRzLmNyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi9jcmVhdGVTdG9yZScpO1xuXG5leHBvcnRzLmNvbm5lY3QgPSByZXF1aXJlKCcuL2Nvbm5lY3QnKTtcblxuZXhwb3J0cy5jb25uZWN0RmlsdGVyID0gcmVxdWlyZSgnLi9jb25uZWN0RmlsdGVyJyk7XG5cbmV4cG9ydHMuTGlzdGVuZXJNaXhpbiA9IHJlcXVpcmUoJy4vTGlzdGVuZXJNaXhpbicpO1xuXG5leHBvcnRzLmxpc3RlblRvID0gcmVxdWlyZSgnLi9saXN0ZW5UbycpO1xuXG5leHBvcnRzLmxpc3RlblRvTWFueSA9IHJlcXVpcmUoJy4vbGlzdGVuVG9NYW55Jyk7XG5cblxudmFyIG1ha2VyID0gcmVxdWlyZSgnLi9qb2lucycpLnN0YXRpY0pvaW5DcmVhdG9yO1xuXG5leHBvcnRzLmpvaW5UcmFpbGluZyA9IGV4cG9ydHMuYWxsID0gbWFrZXIoXCJsYXN0XCIpOyAvLyBSZWZsdXguYWxsIGFsaWFzIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cbmV4cG9ydHMuam9pbkxlYWRpbmcgPSBtYWtlcihcImZpcnN0XCIpO1xuXG5leHBvcnRzLmpvaW5TdHJpY3QgPSBtYWtlcihcInN0cmljdFwiKTtcblxuZXhwb3J0cy5qb2luQ29uY2F0ID0gbWFrZXIoXCJhbGxcIik7XG5cbnZhciBfID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5leHBvcnRzLkV2ZW50RW1pdHRlciA9IF8uRXZlbnRFbWl0dGVyO1xuXG5leHBvcnRzLlByb21pc2UgPSBfLlByb21pc2U7XG5cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgc2V0IG9mIGFjdGlvbnNcbiAqXG4gKiBAcGFyYW0gZGVmaW5pdGlvbnMgdGhlIGRlZmluaXRpb25zIGZvciB0aGUgYWN0aW9ucyB0byBiZSBjcmVhdGVkXG4gKiBAcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhY3Rpb25zIG9mIGNvcnJlc3BvbmRpbmcgYWN0aW9uIG5hbWVzXG4gKi9cbmV4cG9ydHMuY3JlYXRlQWN0aW9ucyA9IGZ1bmN0aW9uKGRlZmluaXRpb25zKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7fTtcbiAgICBmb3IgKHZhciBrIGluIGRlZmluaXRpb25zKXtcbiAgICAgICAgaWYgKGRlZmluaXRpb25zLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gZGVmaW5pdGlvbnNba10sXG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZSA9IF8uaXNPYmplY3QodmFsKSA/IGsgOiB2YWw7XG5cbiAgICAgICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0gPSBleHBvcnRzLmNyZWF0ZUFjdGlvbih2YWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY3Rpb25zO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBldmVudG1pdHRlciB0aGF0IFJlZmx1eCB1c2VzXG4gKi9cbmV4cG9ydHMuc2V0RXZlbnRFbWl0dGVyID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgdmFyIF8gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG4gICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBfLkV2ZW50RW1pdHRlciA9IGN0eDtcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBQcm9taXNlIGxpYnJhcnkgdGhhdCBSZWZsdXggdXNlc1xuICovXG5leHBvcnRzLnNldFByb21pc2UgPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbiAgICBleHBvcnRzLlByb21pc2UgPSBfLlByb21pc2UgPSBjdHg7XG59O1xuXG5cbi8qKlxuICogU2V0cyB0aGUgUHJvbWlzZSBmYWN0b3J5IHRoYXQgY3JlYXRlcyBuZXcgcHJvbWlzZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZhY3RvcnkgaGFzIHRoZSBzaWduYXR1cmUgYGZ1bmN0aW9uKHJlc29sdmVyKSB7IHJldHVybiBbbmV3IFByb21pc2VdOyB9YFxuICovXG5leHBvcnRzLnNldFByb21pc2VGYWN0b3J5ID0gZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgIHZhciBfID0gcmVxdWlyZSgnLi91dGlscycpO1xuICAgIF8uY3JlYXRlUHJvbWlzZSA9IGZhY3Rvcnk7XG59O1xuXG5cbi8qKlxuICogU2V0cyB0aGUgbWV0aG9kIHVzZWQgZm9yIGRlZmVycmluZyBhY3Rpb25zIGFuZCBzdG9yZXNcbiAqL1xuZXhwb3J0cy5uZXh0VGljayA9IGZ1bmN0aW9uKG5leHRUaWNrKSB7XG4gICAgdmFyIF8gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG4gICAgXy5uZXh0VGljayA9IG5leHRUaWNrO1xufTtcblxuLyoqXG4gKiBQcm92aWRlcyB0aGUgc2V0IG9mIGNyZWF0ZWQgYWN0aW9ucyBhbmQgc3RvcmVzIGZvciBpbnRyb3NwZWN0aW9uXG4gKi9cbmV4cG9ydHMuX19rZWVwID0gcmVxdWlyZSgnLi9LZWVwJyk7XG5cbi8qKlxuICogV2FybiBpZiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBub3QgYXZhaWxhYmxlXG4gKi9cbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgY29uc29sZS5lcnJvcihcbiAgICAnRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgbm90IGF2YWlsYWJsZS4gJyArXG4gICAgJ0VTNSBzaGltIHJlcXVpcmVkLiAnICtcbiAgICAnaHR0cHM6Ly9naXRodWIuY29tL3Nwb2lrZS9yZWZsdXhqcyNlczUnXG4gICk7XG59XG4iLCIvKipcbiAqIEludGVybmFsIG1vZHVsZSB1c2VkIHRvIGNyZWF0ZSBzdGF0aWMgYW5kIGluc3RhbmNlIGpvaW4gbWV0aG9kc1xuICovXG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICBfID0gcmVxdWlyZShcIi4vdXRpbHNcIiksXG4gICAgY3JlYXRlU3RvcmUgPSByZXF1aXJlKFwiLi9jcmVhdGVTdG9yZVwiKSxcbiAgICBzdHJhdGVneU1ldGhvZE5hbWVzID0ge1xuICAgICAgICBzdHJpY3Q6IFwiam9pblN0cmljdFwiLFxuICAgICAgICBmaXJzdDogXCJqb2luTGVhZGluZ1wiLFxuICAgICAgICBsYXN0OiBcImpvaW5UcmFpbGluZ1wiLFxuICAgICAgICBhbGw6IFwiam9pbkNvbmNhdFwiXG4gICAgfTtcblxuLyoqXG4gKiBVc2VkIGluIGBpbmRleC5qc2AgdG8gY3JlYXRlIHRoZSBzdGF0aWMgam9pbiBtZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyYXRlZ3kgV2hpY2ggc3RyYXRlZ3kgdG8gdXNlIHdoZW4gdHJhY2tpbmcgbGlzdGVuYWJsZSB0cmlnZ2VyIGFyZ3VtZW50c1xuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHN0YXRpYyBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGEgc3RvcmUgd2l0aCBhIGpvaW4gbGlzdGVuIG9uIHRoZSBnaXZlbiBsaXN0ZW5hYmxlcyB1c2luZyB0aGUgZ2l2ZW4gc3RyYXRlZ3lcbiAqL1xuZXhwb3J0cy5zdGF0aWNKb2luQ3JlYXRvciA9IGZ1bmN0aW9uKHN0cmF0ZWd5KXtcbiAgICByZXR1cm4gZnVuY3Rpb24oLyogbGlzdGVuYWJsZXMuLi4gKi8pIHtcbiAgICAgICAgdmFyIGxpc3RlbmFibGVzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gY3JlYXRlU3RvcmUoe1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGlzW3N0cmF0ZWd5TWV0aG9kTmFtZXNbc3RyYXRlZ3ldXS5hcHBseSh0aGlzLGxpc3RlbmFibGVzLmNvbmNhdChcInRyaWdnZXJBc3luY1wiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFVzZWQgaW4gYExpc3RlbmVyTWV0aG9kcy5qc2AgdG8gY3JlYXRlIHRoZSBpbnN0YW5jZSBqb2luIG1ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJhdGVneSBXaGljaCBzdHJhdGVneSB0byB1c2Ugd2hlbiB0cmFja2luZyBsaXN0ZW5hYmxlIHRyaWdnZXIgYXJndW1lbnRzXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEFuIGluc3RhbmNlIG1ldGhvZCB3aGljaCBzZXRzIHVwIGEgam9pbiBsaXN0ZW4gb24gdGhlIGdpdmVuIGxpc3RlbmFibGVzIHVzaW5nIHRoZSBnaXZlbiBzdHJhdGVneVxuICovXG5leHBvcnRzLmluc3RhbmNlSm9pbkNyZWF0b3IgPSBmdW5jdGlvbihzdHJhdGVneSl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKC8qIGxpc3RlbmFibGVzLi4uLCBjYWxsYmFjayovKXtcbiAgICAgICAgXy50aHJvd0lmKGFyZ3VtZW50cy5sZW5ndGggPCAzLCdDYW5ub3QgY3JlYXRlIGEgam9pbiB3aXRoIGxlc3MgdGhhbiAyIGxpc3RlbmFibGVzIScpO1xuICAgICAgICB2YXIgbGlzdGVuYWJsZXMgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgICAgICBjYWxsYmFjayA9IGxpc3RlbmFibGVzLnBvcCgpLFxuICAgICAgICAgICAgbnVtYmVyT2ZMaXN0ZW5hYmxlcyA9IGxpc3RlbmFibGVzLmxlbmd0aCxcbiAgICAgICAgICAgIGpvaW4gPSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZMaXN0ZW5hYmxlczogbnVtYmVyT2ZMaXN0ZW5hYmxlcyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogdGhpc1tjYWxsYmFja118fGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgIGxpc3RlbmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiBzdHJhdGVneVxuICAgICAgICAgICAgfSwgaSwgY2FuY2VscyA9IFtdLCBzdWJvYmo7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1iZXJPZkxpc3RlbmFibGVzOyBpKyspIHtcbiAgICAgICAgICAgIF8udGhyb3dJZih0aGlzLnZhbGlkYXRlTGlzdGVuaW5nKGxpc3RlbmFibGVzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bWJlck9mTGlzdGVuYWJsZXM7IGkrKykge1xuICAgICAgICAgICAgY2FuY2Vscy5wdXNoKGxpc3RlbmFibGVzW2ldLmxpc3RlbihuZXdMaXN0ZW5lcihpLGpvaW4pLHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldChqb2luKTtcbiAgICAgICAgc3Vib2JqID0ge2xpc3RlbmFibGU6IGxpc3RlbmFibGVzfTtcbiAgICAgICAgc3Vib2JqLnN0b3AgPSBtYWtlU3RvcHBlcihzdWJvYmosY2FuY2Vscyx0aGlzKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gKHRoaXMuc3Vic2NyaXB0aW9ucyB8fCBbXSkuY29uY2F0KHN1Ym9iaik7XG4gICAgICAgIHJldHVybiBzdWJvYmo7XG4gICAgfTtcbn07XG5cbi8vIC0tLS0gaW50ZXJuYWwgam9pbiBmdW5jdGlvbnMgLS0tLVxuXG5mdW5jdGlvbiBtYWtlU3RvcHBlcihzdWJvYmosY2FuY2Vscyxjb250ZXh0KXtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCBzdWJzID0gY29udGV4dC5zdWJzY3JpcHRpb25zLFxuICAgICAgICAgICAgaW5kZXggPSAoc3VicyA/IHN1YnMuaW5kZXhPZihzdWJvYmopIDogLTEpO1xuICAgICAgICBfLnRocm93SWYoaW5kZXggPT09IC0xLCdUcmllZCB0byByZW1vdmUgam9pbiBhbHJlYWR5IGdvbmUgZnJvbSBzdWJzY3JpcHRpb25zIGxpc3QhJyk7XG4gICAgICAgIGZvcihpPTA7aSA8IGNhbmNlbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY2FuY2Vsc1tpXSgpO1xuICAgICAgICB9XG4gICAgICAgIHN1YnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiByZXNldChqb2luKSB7XG4gICAgam9pbi5saXN0ZW5hYmxlc0VtaXR0ZWQgPSBuZXcgQXJyYXkoam9pbi5udW1iZXJPZkxpc3RlbmFibGVzKTtcbiAgICBqb2luLmFyZ3MgPSBuZXcgQXJyYXkoam9pbi5udW1iZXJPZkxpc3RlbmFibGVzKTtcbn1cblxuZnVuY3Rpb24gbmV3TGlzdGVuZXIoaSxqb2luKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2FsbGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChqb2luLmxpc3RlbmFibGVzRW1pdHRlZFtpXSl7XG4gICAgICAgICAgICBzd2l0Y2goam9pbi5zdHJhdGVneSl7XG4gICAgICAgICAgICAgICAgY2FzZSBcInN0cmljdFwiOiB0aHJvdyBuZXcgRXJyb3IoXCJTdHJpY3Qgam9pbiBmYWlsZWQgYmVjYXVzZSBsaXN0ZW5lciB0cmlnZ2VyZWQgdHdpY2UuXCIpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJsYXN0XCI6IGpvaW4uYXJnc1tpXSA9IGNhbGxhcmdzOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiYWxsXCI6IGpvaW4uYXJnc1tpXS5wdXNoKGNhbGxhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpvaW4ubGlzdGVuYWJsZXNFbWl0dGVkW2ldID0gdHJ1ZTtcbiAgICAgICAgICAgIGpvaW4uYXJnc1tpXSA9IChqb2luLnN0cmF0ZWd5PT09XCJhbGxcIj9bY2FsbGFyZ3NdOmNhbGxhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbWl0SWZBbGxMaXN0ZW5hYmxlc0VtaXR0ZWQoam9pbik7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZW1pdElmQWxsTGlzdGVuYWJsZXNFbWl0dGVkKGpvaW4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpvaW4ubnVtYmVyT2ZMaXN0ZW5hYmxlczsgaSsrKSB7XG4gICAgICAgIGlmICgham9pbi5saXN0ZW5hYmxlc0VtaXR0ZWRbaV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBqb2luLmNhbGxiYWNrLmFwcGx5KGpvaW4ubGlzdGVuZXIsam9pbi5hcmdzKTtcbiAgICByZXNldChqb2luKTtcbn1cbiIsInZhciBSZWZsdXggPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cblxuLyoqXG4gKiBBIG1peGluIGZhY3RvcnkgZm9yIGEgUmVhY3QgY29tcG9uZW50LiBNZWFudCBhcyBhIG1vcmUgY29udmVuaWVudCB3YXkgb2YgdXNpbmcgdGhlIGBMaXN0ZW5lck1peGluYCxcbiAqIHdpdGhvdXQgaGF2aW5nIHRvIG1hbnVhbGx5IHNldCBsaXN0ZW5lcnMgaW4gdGhlIGBjb21wb25lbnREaWRNb3VudGAgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7QWN0aW9ufFN0b3JlfSBsaXN0ZW5hYmxlIEFuIEFjdGlvbiBvciBTdG9yZSB0aGF0IHNob3VsZCBiZVxuICogIGxpc3RlbmVkIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byByZWdpc3RlciBhcyBldmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gZGVmYXVsdENhbGxiYWNrIFRoZSBjYWxsYmFjayB0byByZWdpc3RlciBhcyBkZWZhdWx0IGhhbmRsZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCB0byBiZSB1c2VkIGFzIGEgbWl4aW4sIHdoaWNoIHNldHMgdXAgdGhlIGxpc3RlbmVyIGZvciB0aGUgZ2l2ZW4gbGlzdGVuYWJsZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0ZW5hYmxlLGNhbGxiYWNrLGluaXRpYWwpe1xuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdXAgdGhlIG1peGluIGJlZm9yZSB0aGUgaW5pdGlhbCByZW5kZXJpbmcgb2NjdXJzLiBJbXBvcnQgbWV0aG9kcyBmcm9tIGBMaXN0ZW5lck1ldGhvZHNgXG4gICAgICAgICAqIGFuZCB0aGVuIG1ha2UgdGhlIGNhbGwgdG8gYGxpc3RlblRvYCB3aXRoIHRoZSBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGZhY3RvcnkgZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvcih2YXIgbSBpbiBSZWZsdXguTGlzdGVuZXJNZXRob2RzKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1ttXSAhPT0gUmVmbHV4Lkxpc3RlbmVyTWV0aG9kc1ttXSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzW21dKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3QgaGF2ZSBvdGhlciBwcm9wZXJ0eSAnXCIrbStcIicgd2hlbiB1c2luZyBSZWZsdXgubGlzdGVuVG8hXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpc1ttXSA9IFJlZmx1eC5MaXN0ZW5lck1ldGhvZHNbbV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saXN0ZW5UbyhsaXN0ZW5hYmxlLGNhbGxiYWNrLGluaXRpYWwpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYW5zIHVwIGFsbCBsaXN0ZW5lciBwcmV2aW91c2x5IHJlZ2lzdGVyZWQuXG4gICAgICAgICAqL1xuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudDogUmVmbHV4Lkxpc3RlbmVyTWV0aG9kcy5zdG9wTGlzdGVuaW5nVG9BbGxcbiAgICB9O1xufTtcbiIsInZhciBSZWZsdXggPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbi8qKlxuICogQSBtaXhpbiBmYWN0b3J5IGZvciBhIFJlYWN0IGNvbXBvbmVudC4gTWVhbnQgYXMgYSBtb3JlIGNvbnZlbmllbnQgd2F5IG9mIHVzaW5nIHRoZSBgbGlzdGVuZXJNaXhpbmAsXG4gKiB3aXRob3V0IGhhdmluZyB0byBtYW51YWxseSBzZXQgbGlzdGVuZXJzIGluIHRoZSBgY29tcG9uZW50RGlkTW91bnRgIG1ldGhvZC4gVGhpcyB2ZXJzaW9uIGlzIHVzZWRcbiAqIHRvIGF1dG9tYXRpY2FsbHkgc2V0IHVwIGEgYGxpc3RlblRvTWFueWAgY2FsbC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbGlzdGVuYWJsZXMgQW4gb2JqZWN0IG9mIGxpc3RlbmFibGVzXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3QgdG8gYmUgdXNlZCBhcyBhIG1peGluLCB3aGljaCBzZXRzIHVwIHRoZSBsaXN0ZW5lcnMgZm9yIHRoZSBnaXZlbiBsaXN0ZW5hYmxlcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0ZW5hYmxlcyl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB1cCB0aGUgbWl4aW4gYmVmb3JlIHRoZSBpbml0aWFsIHJlbmRlcmluZyBvY2N1cnMuIEltcG9ydCBtZXRob2RzIGZyb20gYExpc3RlbmVyTWV0aG9kc2BcbiAgICAgICAgICogYW5kIHRoZW4gbWFrZSB0aGUgY2FsbCB0byBgbGlzdGVuVG9gIHdpdGggdGhlIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZmFjdG9yeSBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yKHZhciBtIGluIFJlZmx1eC5MaXN0ZW5lck1ldGhvZHMpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW21dICE9PSBSZWZsdXguTGlzdGVuZXJNZXRob2RzW21dKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNbbV0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBoYXZlIG90aGVyIHByb3BlcnR5ICdcIittK1wiJyB3aGVuIHVzaW5nIFJlZmx1eC5saXN0ZW5Ub01hbnkhXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpc1ttXSA9IFJlZmx1eC5MaXN0ZW5lck1ldGhvZHNbbV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ub01hbnkobGlzdGVuYWJsZXMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYW5zIHVwIGFsbCBsaXN0ZW5lciBwcmV2aW91c2x5IHJlZ2lzdGVyZWQuXG4gICAgICAgICAqL1xuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudDogUmVmbHV4Lkxpc3RlbmVyTWV0aG9kcy5zdG9wTGlzdGVuaW5nVG9BbGxcbiAgICB9O1xufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1peChkZWYpIHtcbiAgICB2YXIgY29tcG9zZWQgPSB7XG4gICAgICAgIGluaXQ6IFtdLFxuICAgICAgICBwcmVFbWl0OiBbXSxcbiAgICAgICAgc2hvdWxkRW1pdDogW11cbiAgICB9O1xuXG4gICAgdmFyIHVwZGF0ZWQgPSAoZnVuY3Rpb24gbWl4RGVmKG1peGluKSB7XG4gICAgICAgIHZhciBtaXhlZCA9IHt9O1xuICAgICAgICBpZiAobWl4aW4ubWl4aW5zKSB7XG4gICAgICAgICAgICBtaXhpbi5taXhpbnMuZm9yRWFjaChmdW5jdGlvbiAoc3ViTWl4aW4pIHtcbiAgICAgICAgICAgICAgICBfLmV4dGVuZChtaXhlZCwgbWl4RGVmKHN1Yk1peGluKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBfLmV4dGVuZChtaXhlZCwgbWl4aW4pO1xuICAgICAgICBPYmplY3Qua2V5cyhjb21wb3NlZCkuZm9yRWFjaChmdW5jdGlvbiAoY29tcG9zYWJsZSkge1xuICAgICAgICAgICAgaWYgKG1peGluLmhhc093blByb3BlcnR5KGNvbXBvc2FibGUpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9zZWRbY29tcG9zYWJsZV0ucHVzaChtaXhpbltjb21wb3NhYmxlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWl4ZWQ7XG4gICAgfShkZWYpKTtcblxuICAgIGlmIChjb21wb3NlZC5pbml0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdXBkYXRlZC5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBjb21wb3NlZC5pbml0LmZvckVhY2goZnVuY3Rpb24gKGluaXQpIHtcbiAgICAgICAgICAgICAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChjb21wb3NlZC5wcmVFbWl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdXBkYXRlZC5wcmVFbWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VkLnByZUVtaXQucmVkdWNlKGZ1bmN0aW9uIChhcmdzLCBwcmVFbWl0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gcHJlRW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsdWUgPT09IHVuZGVmaW5lZCA/IGFyZ3MgOiBbbmV3VmFsdWVdO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoY29tcG9zZWQuc2hvdWxkRW1pdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIHVwZGF0ZWQuc2hvdWxkRW1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgcmV0dXJuICFjb21wb3NlZC5zaG91bGRFbWl0LnNvbWUoZnVuY3Rpb24gKHNob3VsZEVtaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXNob3VsZEVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgT2JqZWN0LmtleXMoY29tcG9zZWQpLmZvckVhY2goZnVuY3Rpb24gKGNvbXBvc2FibGUpIHtcbiAgICAgICAgaWYgKGNvbXBvc2VkW2NvbXBvc2FibGVdLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdXBkYXRlZFtjb21wb3NhYmxlXSA9IGNvbXBvc2VkW2NvbXBvc2FibGVdWzBdO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdXBkYXRlZDtcbn07XG4iLCIvKlxuICogaXNPYmplY3QsIGV4dGVuZCwgaXNGdW5jdGlvbiwgaXNBcmd1bWVudHMgYXJlIHRha2VuIGZyb20gdW5kZXNjb3JlL2xvZGFzaCBpblxuICogb3JkZXIgdG8gcmVtb3ZlIHRoZSBkZXBlbmRlbmN5XG4gKi9cbnZhciBpc09iamVjdCA9IGV4cG9ydHMuaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG59O1xuXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICB2YXIgc291cmNlLCBwcm9wO1xuICAgIGZvciAodmFyIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3ApO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIHByb3BlcnR5RGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcblxuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudGVtaXR0ZXIzJyk7XG5cbmV4cG9ydHMubmV4dFRpY2sgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xufTtcblxuZXhwb3J0cy5jYXBpdGFsaXplID0gZnVuY3Rpb24oc3RyaW5nKXtcbiAgICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK3N0cmluZy5zbGljZSgxKTtcbn07XG5cbmV4cG9ydHMuY2FsbGJhY2tOYW1lID0gZnVuY3Rpb24oc3RyaW5nKXtcbiAgICByZXR1cm4gXCJvblwiK2V4cG9ydHMuY2FwaXRhbGl6ZShzdHJpbmcpO1xufTtcblxuZXhwb3J0cy5vYmplY3QgPSBmdW5jdGlvbihrZXlzLHZhbHMpe1xuICAgIHZhciBvPXt9LCBpPTA7XG4gICAgZm9yKDtpPGtleXMubGVuZ3RoO2krKyl7XG4gICAgICAgIG9ba2V5c1tpXV0gPSB2YWxzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gbztcbn07XG5cbmV4cG9ydHMuUHJvbWlzZSA9IHJlcXVpcmUoXCJuYXRpdmUtcHJvbWlzZS1vbmx5XCIpO1xuXG5leHBvcnRzLmNyZWF0ZVByb21pc2UgPSBmdW5jdGlvbihyZXNvbHZlcikge1xuICAgIHJldHVybiBuZXcgZXhwb3J0cy5Qcm9taXNlKHJlc29sdmVyKTtcbn07XG5cbmV4cG9ydHMuaXNBcmd1bWVudHMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICgnY2FsbGVlJyBpbiB2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XG59O1xuXG5leHBvcnRzLnRocm93SWYgPSBmdW5jdGlvbih2YWwsbXNnKXtcbiAgICBpZiAodmFsKXtcbiAgICAgICAgdGhyb3cgRXJyb3IobXNnfHx2YWwpO1xuICAgIH1cbn07XG4iXX0=
