import React, { Component } from "react";
import classnames from "classnames";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import "./index.css";
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
      selectedPlace: {},
      query: "",
      markers: [],
      active: false,
      full: true,
      ariaExpanded: false
    };
  }

  toggleMenu = () => {
    if (
      this.state.active === false &&
      this.state.full === true &&
      this.state.ariaExpanded === false
    ) {
      this.setState({
        active: true,
        full: false,
        ariaExpanded: true
      });
    } else {
      this.setState({
        active: false,
        full: true,
        ariaExpanded: false
      });
    }
  };

  componentDidMount() {
    foursquare.venues
      .getVenues(params)
      .then(res => {
        this.setState({ items: res.response.venues });
      })
      .catch(error => {
        console.log("Error! " + error);
      });

    window.gm_authFailure = () => {
      console.log("Error loading Google Maps!");
    };
  }

  onMarkerClick = (props, marker) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  onListClick = e => {
    let markers = [...document.querySelectorAll(".gmnoprint map area")];
    // let markers = [...document.querySelectorAll(".gmnoprint")];
    this.setState({ markers: markers });
    const click = markers.find(marker => marker.title === e.innerText);
    click.click();
  };

  filterList = () => {
    let input, inputVal, a, i, filtered, markerPin, filteredPin, filteredMarker;
    input = document.querySelector("#search");
    inputVal = input.value.toLowerCase();
    a = document.querySelectorAll(".nav-item");
    markerPin = document.querySelectorAll(".marker-pin");

    for (i = 0; i < a.length; i++) {
      filtered = a[i];
      filteredPin = markerPin[i];
      filteredMarker = this.state.markers[i];

      if (filtered.innerHTML.toLowerCase().indexOf(inputVal) > -1) {
        filtered.style.display = "";
        // filteredMarker.setVisible(true);
      } else {
        filtered.style.display = "none";
        // filteredMarker.setVisible(false);
        // this.state.items.splice(i, 1);
      }

      // if (
      //   filtered.innerHTML.toLowerCase().indexOf(inputVal) > -1
      // ) {
      //   this.state.items.splice(i, 1);
      // }
      // console.log(a[i]);
      // console.log(this.state.items);
    }
  };

  render() {
    const style = { width: "100%", height: "100%" };
    let activeClass = classnames("nav-section ", {
      active: this.state.active
    });
    let fullClass = classnames("map-canvas ", {
      full: this.state.full
    });

    return (
      <div>
        <header className="header-bar" role="banner">
          {/* Burger Menu */}
          <nav className="buttonNav" role="presentation">
            <button
              className={"toggleButton"}
              aria-controls="menu"
              aria-expanded={this.state.ariaExpanded}
              onClick={this.toggleMenu.bind(this)}
            >
              <span />
              <span />
              <span />
            </button>
          </nav>

          <h1>Manchester United Map</h1>
        </header>

        <aside className={activeClass}>
          <label className="search-label" htmlFor="search">
            <input
              id="search"
              type="text"
              name="search"
              aria-label="Search"
              placeholder="Search Location"
              value={this.state.value}
              onChange={this.filterList}
            />
          </label>

          <nav className="location-list" role="list">
            {this.state.items.map(item => {
              return (
                <a
                  className="nav-item"
                  key={item.id}
                  tabIndex="0"
                  role="listitem"
                  onClick={e => this.onListClick(e.target)}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>
        </aside>

        <div className={fullClass} aria-label="Google Map" aria-hidden="true">
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
                  title={item.name}
                  key={item.name}
                  className="marker-pin"
                  position={{ lat: item.location.lat, lng: item.location.lng }}
                  animation={
                    this.state.activeMarker
                      ? this.state.activeMarker.name === item.name
                        ? "1"
                        : "0"
                      : "0"
                  }
                  onClick={this.onMarkerClick}
                />
              );
            })}

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
            >
              <div>
                <h4>{this.state.selectedPlace.name}</h4>
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
