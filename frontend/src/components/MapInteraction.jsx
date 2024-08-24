import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const carIcon = new L.DivIcon({
  html: `<div style="font-size: 48px; transform: scaleX(-1);">🚗</div>`,
  className: "car-icon",
  iconSize: [48, 48],
  iconAnchor: [55,55],
});

const MapClickHandler = ({ setClickedPosition }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setClickedPosition([lat, lng]);
      console.log("Clicked location:", [lat, lng]);
    },
  });
  return null;
};

const MyLeafletMap = () => {
  const [vehiclePosition, setVehiclePosition] = useState([17.385044, 78.486671]);
  const [data, setData] = useState([]);
  const [route, setRoute] = useState([[17.385044, 78.486671]]);
  const [clickedPosition, setClickedPosition] = useState(null);

  const api = import.meta.env.VITE_REACT_APP_API_KEY;

  async function fetchApi(api) {
    try {
      const res = await axios.get(api);
      const data = await res.data;
      setData(data);
      setRoute(data.map(point => [point.latitude, point.longitude]));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchApi(api);
  }, []);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (data.length > 0) {
        if (count >= data.length) {
          count
        }

        const { latitude, longitude } = data[count];

        if (latitude !== null && longitude !== null) {
          setVehiclePosition([latitude, longitude]);
        } else {
          console.error("Invalid coordinates:", data[count]);
        }

        count++;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <MapContainer
      center={vehiclePosition}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler setClickedPosition={setClickedPosition} />
      <Marker position={vehiclePosition} icon={carIcon} />
      <Polyline positions={route} color="blue" />
      {clickedPosition && (
        <Marker position={clickedPosition}>
          <div style={{ color: "red" }}>Clicked here!</div>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MyLeafletMap;
