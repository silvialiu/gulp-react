var foo = require('../mod/foo'),
    React = require('react'),
    jquery = require('jquery');

var TimeExample = React.createClass({
    getInitialState: function(){
        return {elapsed: 0};
    },
    componentDidMount: function(){
        this.timer = setInterval(this.tick, 50);
    },
    componentWillUnmount: function(){
        clearInterval(this.timer);
    },
    tick: function(){
        this.setState({elapsed: new Date() - this.props.start});
    },
    render: function(){
        var elapsed = Math.round(this.state.elapsed / 100);
        var seconds = (elapsed/10).toFixed(1);
        return (<p> started at <b> {seconds} seconds</b> ago.</p>);
    }
});

/*
React.render(
    <TimeExample start={Date.now()} />,
    TimeExample
)*/

var MenuExample = React.createClass({
    getInitialState: function(){
        return {focused: 0};
    },
    clickHandler: function(index, e){
        console.log(e);v
        this.setState({focused: index});
    },
    render: function(){
        var self = this;
        return (
            <div>
                <ul>
                    {this.props.items.map(function(item, index){
                        var style="";
                        if (self.state.focused == index){
                            style="focused";
                        }
                        return <li className={style} onClick={self.clickHandler.bind(self, index,event)}>{item}</li>
                    })}
                </ul>
                <p> select item is {this.props.items[this.state.focused]}</p>
            </div>
        );
    }
});

/*
React.render(<MenuExample items={['Home', 'Service', 'About', 'Contact Us']}/>, menuExample);
*/

var SearchExample = React.createClass({
    getInitialState: function(){
        return {
            searchString: ''
        };
    },
    handleChange: function(e){
        var str = e.target.value;
        this.setState({searchString: str});
    },
    render: function(){
        var libraries = this.props.items,
            searchString = this.state.searchString.trim().toLowerCase();
        console.log(libraries);
        if (searchString.length > 0) {
            libraries = libraries.filter(function(l){
                return l.name.toLowerCase().match(searchString);
            });
        }
        return(
            <div>
                <input type="text" value={this.state.searchString}
                    onChange={this.handleChange} placeholder="Type here" />
                <ul>
                    {libraries.map(function(l){
                        return <li>{l.name}<a href={l.url}>{l.url}</a></li>
                    })}
                </ul>
            </div>
        )
    }
});


var libraries = [
    { name: 'Backbone.js', url: 'http://documentcloud.github.io/backbone/'},
    { name: 'AngularJS', url: 'https://angularjs.org/'},
    { name: 'jQuery', url: 'http://jquery.com/'},
    { name: 'Prototype', url: 'http://www.prototypejs.org/'},
    { name: 'React', url: 'http://facebook.github.io/react/'},
    { name: 'Ember', url: 'http://emberjs.com/'},
    { name: 'Knockout.js', url: 'http://knockoutjs.com/'},
    { name: 'Dojo', url: 'http://dojotoolkit.org/'},
    { name: 'Mootools', url: 'http://mootools.net/'},
    { name: 'Underscore', url: 'http://documentcloud.github.io/underscore/'},
    { name: 'Lodash', url: 'http://lodash.com/'},
    { name: 'Moment', url: 'http://momentjs.com/'},
    { name: 'Express', url: 'http://expressjs.com/'},
    { name: 'Koa', url: 'http://koajs.com/'}
];

//React.render(<SearchExample items={libraries}/>, searchExample);)

var ServiceChooser = React.createClass({
    getInitialState: function(){
        return {total: 0}
    },
    addTotal: function(price) {
        this.setState({total: this.state.total + price});
    },
    render: function(){
        var self = this;
        var services = this.props.items.map(function(s){
            return <Service name={s.name} price={s.price} 
                 addTotal={self.addTotal} />;
        });
        return  <div>
            <h1>Our service</h1>
            <div id="services">
                {services}
                <p id="total">Total <b>{this.state.total.toFixed(2)}</b></p>
            </div> 
        </div>
    }
});

var Service = React.createClass({
    getInitialState: function(){
        return {active: false}
    },
    handleClick: function(){
        var active = !this.state.active;
        this.setState({active: active});

        // 通过调用 addTotal 方法和父组件通信！！！
        this.props.addTotal(active ? this.props.price: -this.props.price);
    },
    render: function(){
        return  <p className={this.state.active ? 'active' : ''}
         onClick={this.handleClick}>{this.props.name}
         <b>{this.props.price.toFixed(2)}</b>
        </p>
    }
});


var ss = [
    { name: 'Web Development', price: 300 },
    { name: 'Design', price: 400 },
    { name: 'Integration', price: 250 },
    { name: 'Training', price: 220 }
];

//React.render(<ServiceChooser items={ ss }/>, document.getElementById('serviceExample'));

React.createClass({
    clickHandler: function(){
        this.props.onClick(this.props.ref);
    },
    render: function(){
        var cls = 'picture' + (this.props.favorite? 'favorite' : '');
        return (
            <div className={cls} onClick={this.clickHandler}>
                <img src={this.props.src} width="200" title={this.props.title} />
            </div>
        );
    }
})

//React.render(<ServiceChooser />, pictureExample);

var TodoList = React.createClass({
    render: function(){
        var newItem = function(text) {
            return <li>{text}</li>
        };
        return <ul>{this.props.items.map(newItem)}</ul>;
    }
})

var TodoApp = React.createClass({
    getInitialState: function(){
        return {items: [], text: ''};
    },
    onChange: function(e){
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var nextItems = this.state.items.concat([this.state.text]);
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
    },
    render: function(){
        return (
            <div>
                <TodoList items={this.state.items} />
                <form onSubmit={this.handleSubmit}>
                  <input onChange={this.onChange} value={this.state.text} />
                  <button>{'add #' + (this.state.items.length + 1)}</button>
                </form>
            </div>
        )
    }
});

React.render(<TodoApp />, todoExample);
