import React from "react";
import GoogleMapReact from "google-map-react";
import styleVet from "../../styles/Vet.module.css";

const Map = ({ vetPlaces, setSelectedVet, center }) => {
  const defaultProps = {
    zoom: 14,
  };

  const showVet = (e) => {
    console.log(vetPlaces);
    setSelectedVet(vetPlaces.find((place) => place.place_id === e));
  };

  return (
    <div className={styleVet.googleMap}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
        center={{
          lat: center.lat !== "" ? center.lat : 48.87,
          lng: center.long !== "" ? center.long : 2.37,
        }}
        defaultZoom={defaultProps.zoom}
      >
        {vetPlaces.map((place) => (
          <img
            className={styleVet.img}
            src="marker.svg"
            alt=""
            style={styleVet.img}
            key={place.geometry.place_id}
            lat={place.geometry.location.lat}
            lng={place.geometry.location.lng}
            onClick={() => showVet(place.place_id)}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
