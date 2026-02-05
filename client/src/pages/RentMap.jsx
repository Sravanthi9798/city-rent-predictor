// src/components/RentMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const RentMap = ({ city }) => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/map/rent-map/${city}`
        );
        setAreas(res.data.areas);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [city]);

  if (!areas.length) return <p>Loading...</p>;

  // Default center = first area's coordinates
  const center = [areas[0].lat, areas[0].lng];

  return (
    <MapContainer center={center} zoom={11} style={{ height: "80vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
