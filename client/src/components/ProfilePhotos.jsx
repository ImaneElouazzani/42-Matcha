import React from "react";
import "../css/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconButton, Fab } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { useState } from "react";
import profileImg from "../photos/profile-img.jpg";
import AddPhoto from "./AddPhoto";
import DeleteIcon from "@material-ui/icons/Delete";
import Location from "./Location";

export default function ProfilePhotos() {
  var [imgs, setImgs] = useState([]);
  var [img, setImg] = useState(profileImg);

  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState == 2) setImg(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <div className="photos">
      <div className="profilePhoto">
        <div className="card card-1">
          <div className="card-body">
            <Fab color="primary" aria-label="add" className="trash">
              <DeleteIcon />
            </Fab>
            <img src={img} className="profile-img" />
          </div>
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={imageHandler}
          />
          <label htmlFor="icon-button-file" className="camera">
            <IconButton
              color="default"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </div>
      </div>
      <div className="otherPhotos">
        <section className="other-Photos">
          {imgs.length > 0 &&
            imgs.map((image) => (
              <div className="fortrash">
                <img src={image} />
                <Fab color="primary" aria-label="add" className="trash">
                  <DeleteIcon />
                </Fab>
              </div>
            ))}
          <div>
            {imgs.length < 4 && <AddPhoto setImgs={setImgs} imgs={imgs} />}
          </div>
        </section>
      </div>
      <div>
        <Location />
      </div>
    </div>
  );
}
