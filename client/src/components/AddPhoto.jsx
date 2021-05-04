import React from "react";
import { Add } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export default function AddPhoto({ setImgs, imgs }) {
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState == 2) setImgs([...imgs, reader.result]);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="photo-wrapper">
      <input
        accept="image/*"
        id="icon-button-file-image"
        type="file"
        style={{ display: "none" }}
        onChange={imageHandler}
      />
      <label htmlFor="icon-button-file-image" className="photo-add">
        <IconButton
          color="default"
          aria-label="upload picture"
          component="span"
          size="medium"
        >
          <Add color="action" fontSize="large" />
        </IconButton>
      </label>
    </div>
  );
}