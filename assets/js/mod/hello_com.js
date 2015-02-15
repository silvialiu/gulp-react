//var React = require('react');
var HelloMessage = React.createClass({
	render: function(){
		return <div>Hello s</div>
	}
});
/*
module.exports = {
	invoke: function(){
		React.renderComponent(
			<HelloMessage name="111" />,
			document.querySelector('body')
		)
	}
}
*/

module.exports = HelloMessage;
console.log('module hello_com');

