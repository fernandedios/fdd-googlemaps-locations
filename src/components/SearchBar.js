import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class SearchBar extends Component {
  static propTypes = {
    placeholder: React.PropTypes.string,
    onPlacesChanged: React.PropTypes.func,
    doSeach: React.PropTypes.func
  }

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged.bind(this));
  }
  componentWillUnmount() {
    this.searchBox.removeListener('places_changed', this.onPlacesChanged.bind(this));
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.doSearch(this.refs.input.value);
  }

  onPlacesChanged() {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }

  render() {
    return (
      <div className="row" id="searchbar-container">
        <div className="container">
          <div className="col-md-12">
            <form onSubmit={this.onFormSubmit.bind(this)} className="input-group">
              <input
                ref="input"
                className="form-control"
                placeholder="Type in the address or city"
              />
              <span className="input-group-btn">
                <button type="submit" className="btn btn-secondary">Search</button>
              </span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;
