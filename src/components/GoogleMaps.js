import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

import SearchBar from './SearchBar';

let currentMap;
let infoWindow;
let currentCenter;

class GoogleMaps extends Component {
  getPlaces() {
    const service = new google.maps.places.PlacesService(currentMap);
    infoWindow = new google.maps.InfoWindow();
    currentCenter = currentMap.getCenter();

    setTimeout(() => {
      service.nearbySearch({
            location: currentCenter,
            radius: 10000,
            type: ['store']
          }, this.placesCallback.bind(this));
    }, 1000);
  }

  placesCallback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(result => this.createMarker(result));
    }
  }

  createMarker(place) {
    const placeLoc = place.geometry.location;
    const marker = new google.maps.Marker({
      map: currentMap,
      position: placeLoc
    });

    google.maps.event.addListener(marker, 'click', () => {
      // console.log(place);
      infoWindow.setContent(`
        <div class="icon-container">
          <img src="${place.icon}" class="icon" />
        </div>
        <div class="text-container">
          <span>${place.name}</span>
          <br>${place.vicinity}
        </div>
      `);
      infoWindow.open(currentMap, marker);
    });
  }

  doSearch(term) {
    const ROOT_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    // console.log(encodeURIComponent(term));
    const params = {
      key: this.props.apiKey,
      address: term
    };

    axios.get(ROOT_URL, { params })
      .then((response) => {
        const loc = response.data.results[0].geometry.location;

        // console.log(response.data.results[0].geometry.location);
        currentMap.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const params = {
      zoom: 13,
      center: this.props.center,
      defaultCenter: this.props.defaultCenter
    };

    return (
      <div id="main">
        <SearchBar doSearch={this.doSearch.bind(this)} />
        <div id="map-container">
          <GoogleMapReact
            defaultCenter={params.defaultCenter}
            center={params.center}
            defaultZoom={params.zoom}
            onGoogleApiLoaded={({ map }) => {
              // console.log(map, maps);
              currentMap = map;
              this.getPlaces();

              currentMap.addListener('center_changed', () => {
                this.getPlaces();
              });
            }}
            bootstrapURLKeys={{
              key: this.props.apiKey
          }}
          />
        </div>
      </div>
    );
  }
}

export default GoogleMaps;
