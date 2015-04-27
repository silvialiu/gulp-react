//var React = require('react');
var Dropdown = require('../mod/ui_dropdown');
//var Todos = require('../mod/todo');
import Todos from '../mod/todo'

console.log('index.js');
      
      var colours = [{
        name: "Red",
        hex: "#F21B1B"
      }, {
        name: "Blue",
        hex: "#1B66F2"
      }, {
        name: "Green",
        hex: "#07BA16"
      }];
/*
React.render(<Dropdown list={colours} selectedIndex={0} />,
  document.getElementById('my-dropdown')
);
*/

var data = [
  {
    url: 'http://tinyurl.com/lkevsb9',
    caption: 'Hong Kong!'
  },
  {
    url: 'http://tinyurl.com/mxkwh56',
    caption: 'Cows'
  },
  {
    url: 'http://tinyurl.com/nc7jv28',
    caption: 'Scooters'
  }
];
/*
React.render(<PhotoGallery photos={data}/>,
  document.getElementById('test1'));
*/

var Timer = React.createClass({
  getInitialState: function() {
    return {
      time: 0 
    };
  },
  componentDidMount: function() {
    this.timer = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    this.timer && clearInterval(this.timer);
  },
  tick: function(){
    this.setState({time: this.state.time + 1})
  },
  render: function(){
    return (<div>Time: {this.state.time}</div>)
  }
});
/*
React.render(
    <Timer />,
    document.getElementById('test1'));
*/

React.render(
    <Todos />,
    document.getElementById('test1'));
