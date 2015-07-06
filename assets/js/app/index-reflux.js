
var Reflux = require('reflux');
console.log(React);

var toggleGem = Reflux.createAction();
/*
var isGemActivated = true;

toggleGem.listen(function(status){
  isGemActivated = !isGemActivated;
  var strActivated = isGemActivated ? 'act' : 'dea';
  console.log('Gem is ' + strActivated);
  console.log(status);
});

*/

var gemStore = Reflux.createStore({

    // Initial setup
    init: function() {
        this.isGemActivated = false;

        // Register statusUpdate action
        this.listenTo(toggleGem, this.handleToggleGem);
    },

    // Callback
    handleToggleGem: function() {
        this.isGemActivated = !this.isGemActivated;

        // Pass on to listeners through 
        // the DataStore.trigger function
        this.trigger(this.isGemActivated);
    }

});
var Gem = React.createClass({  
    getInitialState: function() {
      return {
      };
    },
    componentDidMount: function() {
        this.unsubscribe = gemStore.listen(this.onGemChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    // The listening callback
    onGemChange: function(gemStatus) {
        this.setState({gemStatus: gemStatus});
    },

    render: function() {
        var gemStatusStr = this.state.gemStatus ?
            "activated" :
            "deactivated";    
        return (<div> gem is {gemStatusStr}</div>);
    }
});


React.render(<Gem />, document.getElementById('result'));

toggleGem();
/*
// create an action
var textUpdate = Reflux.createAction();
var statusUpdate = Reflux.createAction();

// create a DataStore - listening to textUpdate action
var textStore = Reflux.createStore({
  init: function() {
    this.listenTo(textUpdate, this.output);
  },
  output: function() {
    var i, args = Array.prototype.slice.call(arguments, 0);
    for (i = 0; i < args.length; i++) {
      this.writeOut(args[i]);
    }
  },
  writeOut: function(text) {
    this.trigger(text);
  }
});

// creating a DataStore
var statusStore = Reflux.createStore({
  init: function() {
    this.listenTo(statusUpdate, this.output);
  },
  output: function(flag) {
    var status = flag ? 'ONLINE' : 'OFFLINE';
    this.trigger(status);
  }
});

// create a aggregate DataStore that is listening to textStore and statusStore
var storyStore = Reflux.createStore({
  init: function(){
    this.listenTo(statusStore, this.statusChanged);
    this.listenTo(textStore, this.textUpdated);
    this.storyArr = [];
  },
  statusChanged: function(flag) {
    console.log('--------');
    console.log(flag);
    if (flag === "OFFLINE") {
      this.trigger('once upon a time the user did the following: ' + this.storyArr.join(', '));
      // empty storyArr
      this.storyArr.splice(0, this.storyArr.length);
    }
  },
  textUpdated: function(text) {
    this.storyArr.push(text);
  }
});

// simple view component that ouputs to console
function ConsoleComponent() {
  textStore.listen(function(text) {
    //console.log(1);
    console.log('text: ', text);
  });
  statusStore.listen(function(status) {
    //console.log(2);
    console.log('status: ', status);
  });
  storyStore.listen(function(story) {
    //console.log(3);
    console.log('story: ', story);
  });
}
new ConsoleComponent();

// invoking actions with arbitrary param
statusUpdate(true);
textUpdate('testing', 1337, {'test': 1337});
statusUpdate(false);
*/