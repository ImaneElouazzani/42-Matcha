import React, {useState} from 'react'
import Nav from "./Nav/Nav1";

export default function Change() {
    const [password, setPassword] = useState("")

    return (
       <div className="global">
         <Nav/>
        <div className="reset-box">
        <div id="change-text">
            <h5>Change your password</h5>
        </div>
           <form className="form-group">
           <div className="form-group">
          <label htmlFor="">Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => {
              setPassword(e.target.value)}}
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
              if (password != e.target.value)
                document.getElementById("error").style.display = "block";
              else document.getElementById("error").style.display = "none";
    
            }}
            placeholder="Password"
            maxLength="64"
            minLength="7"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
          />
          <div id="error" style={{ color: "red", display: "none" }}>incorrect password</div>
        </div>
        <button type="submit" className="btn-brown">
          Change
        </button>
               </form> 
        </div>
        </div>
    )
}
