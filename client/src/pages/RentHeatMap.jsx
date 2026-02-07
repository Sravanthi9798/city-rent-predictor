import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RentMap from "../components/RentMap";
import Header from "../components/Header";

function RentHeatmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const { city, mapData } = location.state || {};

  if (!city || !mapData) {
    return (
      <div className="p-6">
        <p>City or map data missing</p>
        <button onClick={() => navigate("/")} className="mt-4 text-blue-600 underline">
          Back to Rent Predictor
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <Header/>
      <h2 className="text-xl font-bold mb-4">Rent Heatmap – {city}</h2>
      <RentMap mapData={mapData} />
    </div>
  );
}

export default RentHeatmap;
