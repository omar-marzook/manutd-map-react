import React, { Component } from "react";
import "./index.css";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import mapStyle from "./map-style.json";

const foursquare = require("react-foursquare")({
  clientID: "GOCZGJUBBXCSCUFF4QTUIH0FTXP35RXALJOFHL22DHVBGR5Q",
  clientSecret: "WKSOXP1FDMQI2V4P552VEVYO2XBPKQVKA114NUYFTBFWXH2P"
});

const params = {
  ll: "53.4631,-2.29139",
  query: "Manchester United",
  limit: "6"
};

export class MapApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    };
  }

  componentDidMount() {
    foursquare.venues.getVenues(params).then(res => {
      this.setState({ items: res.response.venues });
    });
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
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
    const style = { width: "100%", height: "100%" };
    return (
      <div>
        <header className="header-bar">
          <h1>Manchester United Map</h1>
        </header>
        <aside className="right-section">
          {this.state.items.map(item => {
            return (
              <a key={item.id}>
                {item.name}
              </a>
            );
          })}
        </aside>

        <div className="map-canvas">
          <Map
            google={this.props.google}
            style={style}
            styles={mapStyle}
            initialCenter={{ lat: 53.4631, lng: -2.29139 }}
            zoom={16}
            onClick={this.onMapClicked}
          >
            {this.state.items.map(item => {
              return (
                <Marker
                  name={item.name}
                  position={{ lat: item.location.lat, lng: item.location.lng }}
                  onClick={this.onMarkerClick}
                />
              );
            })}

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
              <div>
                <h3>{this.state.selectedPlace.name}</h3>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDr2mpFQ0YiKrf8bW71BurYN_QIl6uylys",
  v: "3.30"
})(MapApp);

//res.response.venues[1].location.lat
