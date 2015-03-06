var foo = require('../mod/foo');
foo();

var TextBoxList = React.createClass({
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