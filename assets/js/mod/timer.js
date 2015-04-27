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

module.exports = Timer;