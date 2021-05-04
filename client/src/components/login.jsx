import React, { useState } from "react";
import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./Nav/Nav1";

export default function Login() {
  const [username, setUsename] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="global">
      <Nav />
      <div className="container-form">
        <form>
          <div className="form-group">
            <label htmlFor="">Username</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                setUsename(e.target.value);
              }}
              placeholder="username"
              maxLength="20"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              maxLength="64"
              minLength="7"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            />
            <a className="forgot-password" href="/Forget">
              i forgot my password
            </a>
          </div>
          <button type="submit" className="btn-brown">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
