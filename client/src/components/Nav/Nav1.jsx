import React from "react";
import "./Nav.css";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <div className="nav-global">
      <ul className="nav-list">
        <NavLink
          exact
          activeClassName="current"
          to="/"
          style={{ textDecoration: "none" }}
        >
          <li>Login</li>
        </NavLink>
        <NavLink
          exact
          activeClassName="current"
          to="/Register"
          style={{ textDecoration: "none" }}
        >
          <li>Sign Up</li>
        </NavLink>
      </ul>
    </div>
  );
}
