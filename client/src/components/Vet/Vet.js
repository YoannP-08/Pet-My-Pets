import React, { useEffect, useState } from "react";
import Map from "./Map";
import styleVet from "../../styles/Vet.module.css";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";


const Vet = () => {
  const [userLocation, setUserLocation] = useState({ lat: "", long: "" });
  const [vetPlaces, setVetPlaces] = useState([]);
  const [selectedVet, setSelectedVet] = useState(false);

  useEffect(() => {
    document.body.style.background = "#2f3542"
  }, [])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoords);
    } else {
      alert("GeoLocation not enabled");
    }
  };

  const getCoords = (pos) => {
    setUserLocation({
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    });
  };

  const getDistanceFromLatLonInKm = (lat1, long1, lat2, long2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLong = deg2rad(long2 - long1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Math.round(d * 100) / 100;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(`https://back-petsmypets.herokuapp.com/api/vet`, {
      method: "POST",
      body: JSON.stringify(userLocation),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((res) => setVetPlaces(res));
  }, [userLocation]);


  return (
    <div className={styleVet.containerAll}>
      <div className={styleVet.containerVet}>
        {selectedVet && (
          <div className={styleVet.vetCard}>
            <div className={styleVet.vetCardContent}>
              <img src={selectedVet.icon} alt=""></img>
              <div>Name: {selectedVet.name}</div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "6em" }}>
                  Rating: {selectedVet.rating}{" "}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>Address: {selectedVet.vicinity}</div>
              <div>
                Distance from location:{" "}
                {getDistanceFromLatLonInKm(
                  selectedVet.geometry.location.lat,
                  selectedVet.geometry.location.lng,
                  userLocation.lat,
                  userLocation.long,
                ) + "km"}
              </div>
            </div>
          </div>
        )}
        <Map vetPlaces={vetPlaces} setSelectedVet={setSelectedVet} center={userLocation}></Map>
      </div>
      <div className={styleVet.flexInput}>
        <GooglePlacesAutocomplete setUserLocation={setUserLocation}></GooglePlacesAutocomplete>
      </div>
    </div>
  );
};

export default Vet;
