(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var foo = require('../mod/foo');
foo();

var TextBoxList = React.createClass({displayName: "TextBoxList",
    getInitialState: function(){
        return {count: 1};
    },
    add: React.autoBind(function(){
        this.setState({count: this.state.count + 1});
    }),
    render: function(){
    }
})

//alert('33123');

},{"../mod/foo":2}],2:[function(require,module,exports){
module.exports = function() {
	console.log(111);
    //console.log(a);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2lsdmlhL2NvZGVfY2ovZ3VscC1uZXcvYXNzZXRzL2pzL2FwcC9saXN0LmpzIiwiL1VzZXJzL3NpbHZpYS9jb2RlX2NqL2d1bHAtbmV3L2Fzc2V0cy9qcy9tb2QvZm9vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2hDLEdBQUcsRUFBRSxDQUFDOztBQUVOLElBQUksaUNBQWlDLDJCQUFBO0lBQ2pDLGVBQWUsRUFBRSxVQUFVO1FBQ3ZCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckI7SUFDRCxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoRCxDQUFDO0lBQ0YsTUFBTSxFQUFFLFVBQVU7S0FDakI7QUFDTCxDQUFDLENBQUM7O0FBRUY7OztBQ2RBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUM1QixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZvbyA9IHJlcXVpcmUoJy4uL21vZC9mb28nKTtcbmZvbygpO1xuXG52YXIgVGV4dEJveExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4ge2NvdW50OiAxfTtcbiAgICB9LFxuICAgIGFkZDogUmVhY3QuYXV0b0JpbmQoZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y291bnQ6IHRoaXMuc3RhdGUuY291bnQgKyAxfSk7XG4gICAgfSksXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIH1cbn0pXG5cbi8vYWxlcnQoJzMzMTIzJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coMTExKTtcbiAgICAvL2NvbnNvbGUubG9nKGEpO1xufSJdfQ==
