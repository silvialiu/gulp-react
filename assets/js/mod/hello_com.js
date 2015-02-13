//var React = require('react');
var HelloMessage = React.createClass({
	render: function(){
		return <div>Hello {this.props.name}</div>
	}
});
module.exports = {
	invoke: function(){
		React.renderComponent(
			<HelloMessage name="111" />,
			document.querySelector('body')
		)
	}
}
console.log(2)
