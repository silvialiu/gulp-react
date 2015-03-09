/*
var hello = require('../mod/hello_com'),
	Foo = require('../mod/foo');
hello.invoke();
*/
//console.log(HelloMessage);
/*
React.renderComponent(HelloMessage(), 
    document.getElementById('body'));
*/
//Foo();
var Cookies = require('cookies-js');
var HelloMessage = require('../mod/hello_com');
    React.renderComponent(
        <HelloMessage name="abc" />,
        document.querySelector('#test')
    );
var Counter = React.createClass({
    incrementCount: function(){
        this.setState({
            count: this.state.count + 1
        })
    },
    getInitialState: function(){
        return {
            count: 0
        }
    },
    render: function(){
        return (
            <div class="my-component">
              <h1>Count: {this.state.count}</h1>
              <button type="button" onClick={this.incrementCount}>Increment</button>
            </div>
        )
    }
});


var FilteredList = React.createClass({
    filterList: function(event){
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function(item){
            return item.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({items: updatedList});
    },
    getInitialState: function(){
        return {
            initialItems: [
                "Apples",
                'Broccoli',
                'Chicken',
                'Duck',
                'Eggs',
                'Fish',
                'Granola',
                'Hash Browns'
            ],
            items: []
        }
    },
    componentWillMount: function() {
        this.setState({items: this.state.initialItems})
    },
    render: function(){
        return(
            <div className="filter-list">
                <input type="text" placeholder="Search"
                    onChange={this.filterList}/>
                <List items={this.state.items}/>
            </div>

        );
    }
});
var List = React.createClass({
    render: function(){
        return (
            <ul>
                {
                    this.props.items.map(function(item){
                        return <li key={item}>{item}</li>
                    })
                }
            </ul>
        )
    }
});
React.render(
    <FilteredList />,
    document.getElementById('myDiv')
);
Cookies.set('key', 'silvia');
console.log(a);
