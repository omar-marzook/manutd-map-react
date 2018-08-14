import React, { Component } from 'react';
import './index.css';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import mapStyle from './map-style.json';

const foursquare = require('react-foursquare')({
  clientID: 'GOCZGJUBBXCSCUFF4QTUIH0FTXP35RXALJOFHL22DHVBGR5Q',
  clientSecret: 'WKSOXP1FDMQI2V4P552VEVYO2XBPKQVKA114NUYFTBFWXH2P'
});

const params = {
  'll': '53.4631,-2.29139',
  'query': 'Manchester United',
  'limit': '5'
};

export class MapApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    foursquare.venues.getVenues(params)
      .then(res => {
        this.setState({ items: res.response.venues });
      });
  }

    // componentDidMount() {
    //   fetch('https://api.foursquare.com/v2/users/510483378/list/manutdmapreact')
    //     .then(response => response.json())
    //     .then((data) => {
    //       this.setState({
    //         venues: data.response.venues
    //       })
    //     })
    //     .catch((error) => {
    //       alert('Error getting data from the FourSquare API. Check the key.')
    //       console.log('Error getting data from the FourSquare API. Check the key.')
    //     })
    // }

  render() {
    const style = { width: '100vw', height: '100vh' };
    return (
      <Map
        google={this.props.google}
        style={style}
        styles={mapStyle}
        initialCenter={{
          lat: 53.4631,
          lng: -2.29139
        }}
        zoom={15}
        onClick={this.onMapClicked}
      >
        <Marker onClick={this.onMarkerClick} name={'Current location'} />

        
        <Marker onClick={this.onMarkerClick} name={'Current location'} />

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            {/* <h1>{this.state.selectedPlace.name}</h1> */}
            <h1>unknown</h1>
          </div>
        </InfoWindow>
        <div>
          <div>Items:</div>
          {this.state.items.map(item => { return <div key={item.id}>{item.name}</div> })}
        </div>

      </Map>

    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDr2mpFQ0YiKrf8bW71BurYN_QIl6uylys',
  v: '3.30'
})(MapApp);
