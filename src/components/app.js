import React, { Component } from 'react';
import { geolocated } from 'react-geolocated';

import GoogleMaps from './GoogleMaps';

const API_KEY = 'YOUR API KEY HERE';
const DEFAULT_COORD = { lat: 40.78, lng: -73.96 };

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { term: '' };
  }

  doLocation() {
    let lat;
    let lng;

    const { isGeolocationAvailable, isGeolocationEnabled, coords } = this.props;

    if (isGeolocationEnabled && isGeolocationAvailable && coords !== null) {
      lat = coords.latitude;
      lng = coords.longitude;
    }
    else {
      lat = DEFAULT_COORD.lat;
      lng = DEFAULT_COORD.lng;
    }

    return { lat, lng };
  }

  render() {
    const coords = this.doLocation();

    return (
      <GoogleMaps apiKey={API_KEY} defaultCenter={DEFAULT_COORD} center={coords} />
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(App);
