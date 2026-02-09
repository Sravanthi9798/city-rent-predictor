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
      <Header title="Rent HeatMap" showBack />
     <div className="relative w-full h-screen">
  {/* MAP HEADING OVERLAY */}
  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] 
                  bg-white/80 backdrop-blur-md px-6 py-2 rounded-lg shadow">
    <h2 className="text-lg font-bold text-gray-800">
      Rent Heatmap – {city}
    </h2>
  </div>

  {/* MAP */}
  <RentMap mapData={mapData} />
</div>

    </div>
  );
}

export default RentHeatmap;
