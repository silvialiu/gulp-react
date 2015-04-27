var Dropdown = React.createClass({
        getInitialState: function() {
          return {
            listVisible: false,
            selectedIndex: this.props.selectedIndex
          };
        },
        show: function() {
          this.setState({ listVisible: true });
          document.addEventListener("click", this.hide);
        },
        
        hide: function() {
          this.setState({ listVisible: false });
          document.removeEventListener("click", this.hide);
        },
      
        render: function() {
          var selected = this.props.list[this.state.selectedIndex];

          return <div className={"dropdown-container" + (this.state.listVisible ? " show" : "")}>
            <div className={"dropdown-display" + (this.state.listVisible ? " clicked": "")} onClick={this.show}>
              <span style={{ color: selected.hex }}>{selected.name}</span>
              <i className="fa fa-angle-down"></i>
            </div>
            <div className="dropdown-list">
              <div>
                {this.renderListItems()}
              </div>
            </div>
          </div>;
        },
        handleClick: function(param, event){
          this.setState({selectedIndex: param});
        },

        renderListItems: function() {
          var items = [];
          for (var i = 0; i < this.props.list.length; i++) {
            var item = this.props.list[i];
            
            items.push(<div onClick={this.handleClick.bind(this, i)} >
              <span style={{ color: item.hex }}>{item.name}</span>
              <i className="fa fa-check" style={{display: (i==this.state.selectedIndex ? "block" : "none")}}></i>
            </div>);
          }
          return items;
        }
      });

console.log(Dropdown);

module.exports = Dropdown;