import React from "react";
import Nav2 from "./Nav/Nav2";
import "../css/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileForm from "./ProfileForm"
import ProfilePhotos from "./ProfilePhotos";

export default function Profile() {
  return (
    <div>
      <Nav2 />
      <div className="profile">
        <div className="right-div">
          <ProfilePhotos />
        </div>
        <div className="left-div">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
