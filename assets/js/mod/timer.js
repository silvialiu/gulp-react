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

var setIntervalMixin = {
  componentWillMount() {
    this.intervals = [];
  },
  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnMount() {
    this.intervals.forEach(clearInterval);
  }
};

var Timer = React.createClass({
  mixins: [setIntervalMixin],
  getInitialState() {
    return {
      time: 0
    };
  },
  componentDidMount() {
    this.setInterval(this.tick, 1000);
  },
  tick() {
    this.setState({time: this.state.time + 1});
  },
  render() {
    return <div>Time: {this.state.time}</div>
  }
});

module.exports = Timer;