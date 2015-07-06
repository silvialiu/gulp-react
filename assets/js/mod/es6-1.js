var React = require('react');

class HelloComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {wording: 'hello'};
  }
  render() {
    return (<div>{this.state.xxx}</div>)
  }
}

module.exports = HelloComponent;