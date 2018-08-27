import React, { Component } from "react";

export class Sidebar extends Component {
  render() {
    return (
      <aside className={this.props.activeClass}>
        <label className="search-label" htmlFor="search">
          Search Locations: <br />
          <input
            id="search"
            type="text"
            name="search"
            aria-label="Search"
            placeholder="Search Location"
            value={this.props.value}
            onChange={this.props.filterList}
          />
        </label>

        <nav className="location-list">
          <ul>
            {this.props.items.map(item => {
              return (
                <li key={item.venue.id}>
                  <a
                    className="nav-item"
                    tabIndex="0"
                    role="button"
                    onClick={e => this.props.onListClick(e.target)}
                    onKeyPress={e => this.props.onListClick(e.target)}
                  >
                    {item.venue.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
