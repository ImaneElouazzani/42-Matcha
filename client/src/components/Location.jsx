import React from "react";
import "../css/profile.css";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import "@reach/combobox/styles.css"
const libraries = ["places"];
const mapContainerStyle = {
    width: "40vw",
    height: "20vh",
};

const center= {
    lat: 31.792305849269,
    lng: -7.080168000000015,
}

export default function Location() {
  var {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: "AIzaSyCgoTq9s_wEgv25IRebAnlDYJmC2a2HWcY",
      libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps"

  return <div>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}>

      </GoogleMap>
  </div>;
}
