import React, { useState } from "react";
import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./Nav/Nav1";

export default function Register() {
  const [user, setUser] = useState({});

  console.log(user);

  return (
    <div className="global">
      <Nav/>
    <div className="container-form">
      <form>
        <div className="form-group">
          <label htmlFor="">First name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => {
              setUser({
                ...user,
                firstName: e.target.value,
              });
            }}
            placeholder="First name"
            maxLength="20"
            minLength="2"
            pattern="^[a-zA-Z]*$"
            title="your firstname must contain only alphabets and must not exceed 20 characters"
            required
          />
        </div>
        <div className="form-group">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => {
              setUser({
                ...user,
                lastName: e.target.value,
              });
            }}
            placeholder="Last name"
            maxLength="20"
            minLength="2"
            pattern="^[a-zA-Z]*$"
            title="your lastname must contain only alphabets and must not exceed 20 characters"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Username</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => {
              setUser({
                ...user,
                username: e.target.value,
              });
            }}
            placeholder="username"
            maxLength="20"
            minLength="2"
            title="your username must not exceed 20 characters"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) => {
              setUser({
                ...user,
                email: e.target.value,
              });
            }}
            placeholder="Email"
            required
            maxLength="40"
            pattern="^([0-9A-Za-z.]+\@[0-9A-Za-z]+\.[a-z]+(\.[a-z]+)?)$"
            title="your email is not valid"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => {
              setUser({
                ...user,
                password: e.target.value,
              });
            }}
            placeholder="password"
            maxLength="64"
            minLength="7"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
          />
        </div>
        <div className="form-group">
          <label>Repeat Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => {
              if (user.password != e.target.value)
                document.getElementById("error").style.display = "block";
              else document.getElementById("error").style.display = "none";
              setUser({
                ...user,
                repeatPass: e.target.value,
              });
            }}
            placeholder="Password"
            maxLength="64"
            minLength="7"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
          />
          <div id="error" style={{ color: "red", display: "none" }}>
            incorrect password
          </div>
        </div>
        <button type="submit" className="btn-brown">
          Register
        </button>
      </form>
    </div>
    </div>
  );
}
