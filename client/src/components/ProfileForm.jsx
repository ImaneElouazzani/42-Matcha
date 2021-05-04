import React, { useState } from "react";
import "../css/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ChipInput from "material-ui-chip-input";

export default function ProfileForm() {
  var [tags, setTags] = useState([]);
  console.log(tags);
  return (
    <div className="profileHome">
      <p id="p">Your informations</p>
      <form >
      <div className="names">
        <div className="form-group">
          <label htmlFor="">First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            maxLength="20"
            minLength="2"
            pattern="^[a-zA-Z]*$"
            title="your firstname must contain only alphabets and must not exceed 20 characters"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            maxLength="20"
            minLength="2"
            pattern="^[a-zA-Z]*$"
            title="your last name must contain only alphabets and must not exceed 20 characters"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            maxLength="20"
            minLength="2"
            pattern="^[a-zA-Z]*$"
            title="your username must contain only alphabets and must not exceed 20 characters"
          />
        </div>
      </div>
      <div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
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
            placeholder="password"
            maxLength="64"
            minLength="7"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          />
        </div>
        <div className="form-group birthday" > 
        <label for="birthday">Birthday</label>
       <input type="date" id="birthday" name="birthday" className="form-control"/>
        </div>
      </div>
      <div className="names">
        <div className="form-group">
          <label for="sel1">Gender</label>
          <select className="form-control" id="sel1">
            <option>man</option>
            <option>woman</option>
          </select>
        </div>
        <div className="form-group">
          <label for="sel1">Sexual preferences</label>
          <select className="form-control" id="sel1">
            <option>Asexual</option>
            <option>Bisexual</option>
            <option>Heterosexual</option>
            <option>Homosexual</option>
          </select>
        </div>
      </div>
      <div>
        <div className="form-group">
          <label for="biography">Biography</label>
          <textarea className="form-control" rows="5" id="biography"></textarea>
        </div>
       
      </div>
      <div className="form-group"> 
          <ChipInput
          label="Tags"
          value={tags}
          onAdd={(tag) => {
            setTags([...tags, tag]);
          }}
          onDelete={(tag) => {}}
        />
      </div>
      <button type="submit" className="btn-brown">
        Update
      </button>
      </form>
    </div>
  );
}
