'use strict';
var TodoList = React.createClass({
  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },
  render: function() {
    var items = this.props.items;
    var len = items.length;
    var list = [];
    for (var i = 0; i < len; i++) {
      list.push(<li key={i}>{items[i]}</li>);
    }
      /*
         {items.map(function(item, index){
           return (<li key={index}>{item}</li>)
         })}
      */
    return (
      <ul>

         { items.map((item, index) => {return (<li key={index}>{item}</li>)})

         }
      </ul>
    );

  }
});
var TodoForm = React.createClass({
  propsTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      text: '' 
    };
  },
  onTextChange: function(e){
    this.setState({text: e.target.value});
  },
  onSubmit: function(e){
    e.preventDefault();
    if (this.state.text.trim()) {
      this.props.onSubmit(this.state.text);
      this.setState({text: ''});
    }
  },
  render: function() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={this.state.text} onChange={this.onTextChange} />
        <input type="submit" value="add" />
      </form>
    );
  }
});
var Todos = React.createClass({
  getInitialState: function() {
    return {
      items: [] 
    };
  },
  onSubmitTodo: function(newTodo) {
    var nextItems = this.state.items;
    nextItems.push(newTodo);
    this.setState({items: nextItems});
  },
  //render: function() {
  render() {
    return (
      <div className="Todos">
        <h3>Todo</h3>
        <TodoList items={this.state.items} />
        <TodoForm onSubmit={this.onSubmitTodo} />
      </div>
    );
  }
});

module.exports = Todos;