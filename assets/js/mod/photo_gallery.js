var Photo = React.createClass({
  getInitialState: function() {
    return {
      liked: false 
    };
  },
  toggleLiked: function(){
    this.setState({liked: !this.state.liked})
  },
  render: function() {
    var buttonClass = this.state.liked ? 'active' : '';
    return (
      <div className="photo">
        <img width="100%" src={this.props.src}/>
        <div>
          <button onClick={this.toggleLiked} className={buttonClass}>♥</button>
          <span>{this.props.caption}</span>
        </div>
      </div>
    );
  }
});

var PhotoGallery = React.createClass({
  render: function() {
    var photos = this.props.photos.map(function(photo){
      console.log(photo.url);
      return <Photo src={photo.url} caption={photo.caption} />
    });
    return (
      <div className="photo-gallery">
        {photos}
      </div>
    );
  }
});

module.exports = PhotoGallery;