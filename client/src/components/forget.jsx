import React, {useState} from 'react'
import Nav from "./Nav/Nav1";

export default function Forget() {
    const [email, setEmail] = useState("");

    return (
        <div className="global">
        <Nav/>
        <div className="reset-box">
            <div id="reset-text">
                <h4>Reset your password</h4>
            </div>
            <div className="form-group">
            <label>Enter your email</label>
            <input
                type="email"
                className="form-control"
                onChange={(e) => {setEmail(e.target.value)
                }}
                placeholder="Email"
                required
                maxLength="40"
                pattern="^([0-9A-Za-z.]+\@[0-9A-Za-z]+\.[a-z]+(\.[a-z]+)?)$"
                title="your email is not valid"
            />
            </div><button type="submit" className="btn-brown">
                Register
            </button>
        </div>
        </div>
    )
}
