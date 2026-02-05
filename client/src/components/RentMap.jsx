// src/components/RentMap.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RentMap = ({ mapData }) => {
  if (!mapData || !mapData.areas || !mapData.areas.length) return <p>Loading map...</p>;

  const areas = mapData.areas;
  const center = [areas[0].lat, areas[0].lng];

  return (
    <MapContainer center={center} zoom={11} style={{ height: "80vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {areas.map((area, idx) => (
        <Marker key={idx} position={[area.lat, area.lng]}>
          <Popup>
            <strong>{area.area}</strong><br />
            Avg Rent: ₹{area.avgRent}<br />
            Level: {area.level}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RentMap;
