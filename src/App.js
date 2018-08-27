import React, { Component } from "react";
import classnames from "classnames";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import "./index.css";
import SideBar from "./Sidebar.js";
import mapStyle from "./map-style.json";

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

  // `classList.toggle` showed Errors so Used 'classnames' to handle it & Burger Menu `aria-expanded` handling
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
    fetch(
      "https://api.foursquare.com/v2/venues/explore?client_id=GOCZGJUBBXCSCUFF4QTUIH0FTXP35RXALJOFHL22DHVBGR5Q&client_secret=WKSOXP1FDMQI2V4P552VEVYO2XBPKQVKA114NUYFTBFWXH2P&v=20180323&limit=6&ll=53.4631,-2.291398&query=Manchester United",
      {
        method: "GET"
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          // When FourSquare API fails >> alert
          alert("FourSquare API can't load!");
        }
      })
      .then(res => {
        this.setState({
          items: res.response.groups[0].items
        });
      })
      // When Response error >> alert and console
      .catch(error => {
        console.log("Error! " + error);
        alert("Error! " + error);
      });

    // When Google Maps API fails >> alert
    window.gm_authFailure = () => {
      alert("Error loading Google Maps, Check The API Key!");
    };
  }

  // When click on Marker: Open InfoWindow
  onMarkerClick = (props, marker) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  // When click on Map: Close active InfoWindow
  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  // When Click On Side Nav Location
  onListClick = e => {
    let markers;

    // `.gmnoprint` works fine on touch screens & `.gmnoprint map area` works fine on Desktop
    (() => {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        markers = [...document.querySelectorAll(".gmnoprint")];
      } else {
        markers = [...document.querySelectorAll(".gmnoprint map area")];
      }
    })();

    this.setState({ markers: markers });
    const click = markers.find(marker => marker.title === e.innerText);
    click.click();
  };

  // Search filtering locations
  filterList = () => {
    let input, inputVal, a, i, filtered;
    input = document.querySelector("#search");
    inputVal = input.value.toLowerCase();
    a = document.querySelectorAll(".nav-item");

    for (i = 0; i < a.length; i++) {
      filtered = a[i];

      if (filtered.innerHTML.toLowerCase().indexOf(inputVal) > -1) {
        filtered.style.display = "";
      } else {
        filtered.style.display = "none";
      }
    }
  };

  render() {
    const style = { width: "100%", height: "100%" };
    // `classList.toggle` showed Errors so Used 'classnames' to handle it
    let activeClass = classnames("nav-section ", {
      active: this.state.active
    });
    let fullClass = classnames("map-canvas ", {
      full: this.state.full
    });

    return <div>
        <header className="header-bar" role="banner">
          {/* Burger Menu */}
          <nav className="buttonNav" role="presentation">
            <button className={"toggleButton"} aria-controls="menu" aria-expanded={this.state.ariaExpanded} onClick={this.toggleMenu.bind(this)}>
              <span />
              <span />
              <span />
            </button>
          </nav>

          <h1>Manchester United Map</h1>
        </header>

        <SideBar items={this.state.items} onListClick={this.onListClick} filterList={this.filterList} activeClass={activeClass} />

        <div className={fullClass} aria-label="Google Map" role="application">
          <Map google={this.props.google} style={style} styles={mapStyle} initialCenter={{ lat: 53.4631, lng: -2.29139 }} zoom={16} onClick={this.onMapClicked} aria-hidden="true">
            {/* Create Location List of Markers from fetching API data */}
            {this.state.items.map(item => {
              return <Marker name={item.venue.name} title={item.venue.name} key={item.venue.name} address={item.venue.location.formattedAddress} className="marker-pin" position={{ lat: item.venue.location.lat, lng: item.venue.location.lng }} animation={this.state.activeMarker ? (this.state.activeMarker.name === item.venue.name ? "1" : "0") : "0"} onClick={this.onMarkerClick} />;
            })}

            <InfoWindow tabIndex="0" aria-label="Info window" marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
              <div tabIndex="1">
                <h4 tabIndex="1">{this.state.selectedPlace.name}</h4>
                <p tabIndex="1">{this.state.selectedPlace.address}</p>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </div>;
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDr2mpFQ0YiKrf8bW71BurYN_QIl6uylys",
  v: "3.30"
})(MapApp);
