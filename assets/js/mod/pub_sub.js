var events = (function(){
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function(topic, listener) {
      if(!hOP.call(topics.topic)) topics[topic] = [];
      var index = topics[topic].push(listener) - 1;
      return {
        remove: function(){
          delete topics[topic][index];
        }
      }
    },
    publish: function(topic, info) {
      if(!hOP.call(topics, topic)) return;
      topics[topic].forEach(function(item) {
        item(info != undefined ? info : {});
      });
    }
  }
})();

var EventBus = {
  topics: {},
  subscribe: function(topic, listener) {
    if (!this.topics[topic]) this.topics[topic] = [];
    this.topics[topic].push(listener);
  },
  publish: function(topic, data) {
    if (!this.topics[topic] || this.topics[topic].length < 1) return;
    this.topics[topic].forEach(function(listener){
      listener(data || {});
    })
  }
}

