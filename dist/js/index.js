(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Hello = require('../mod/hello_com'),
	Foo = require('../mod/foo');
Hello.invoke();
console.log($('body'));
Foo();

},{"../mod/foo":2,"../mod/hello_com":3}],2:[function(require,module,exports){
module.exports = function() {
	console.log(111);
}

},{}],3:[function(require,module,exports){
//var React = require('react');
var HelloMessage = React.createClass({displayName: "HelloMessage",
	render: function(){
		return React.createElement("div", null, "Hello ", this.props.name)
	}
});
module.exports = {
	invoke: function(){
		React.renderComponent(
			React.createElement(HelloMessage, {name: "111"}),
			document.querySelector('body')
		)
	}
}
console.log(2)


},{}]},{},[1]);
