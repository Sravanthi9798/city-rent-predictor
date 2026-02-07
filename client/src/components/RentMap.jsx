// src/components/RentMap.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define colored marker icons
const getMarkerIcon = (level) => {
  const color = 
    level === "HIGH" ? "red" :
    level === "MED" ? "orange" :
    "green"; // LOW
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const RentMap = ({ mapData }) => {
  if (!mapData || !mapData.areas || !mapData.areas.length) return <p>Loading map...</p>;

  const areas = mapData.areas;
  const center = [areas[0].lat, areas[0].lng];

  return (
    <MapContainer center={center} zoom={10.5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {areas.map((area, idx) => (
        <Marker key={idx} position={[area.lat, area.lng]} icon={getMarkerIcon(area.level)}> 
          <Popup>
            <strong>{area.area}</strong><br />
            Avg Rent: ₹{area.avgRent.toLocaleString()}<br />
            Level: {area.level}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RentMap;
