import React from "react";
import "./Nav.css";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <div className="nav-global">
      <ul className="nav-list2">
        <NavLink
          exact
          activeClassName="current"
          to="/Home"
          style={{ textDecoration: "none" }}
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          exact
          activeClassName="current"
          to="/Profile"
          style={{ textDecoration: "none" }}>
          <li>Profile</li>
        </NavLink>
        <NavLink
          exact
          activeClassName="current"
          to="/"
          style={{ textDecoration: "none" }}>
          <li>Log out</li>
        </NavLink>
      </ul>
    </div>
  );
}
