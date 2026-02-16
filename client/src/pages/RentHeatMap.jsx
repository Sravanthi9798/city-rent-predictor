import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RentMap from "../components/RentMap";
import Header from "../components/Header";
import { useEffect } from "react";

function RentHeatmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const { city, mapData } = location.state || {};

  if (!city || !mapData) {
    return (
      <div className="p-6">
        <p>City or map data missing</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 underline"
        >
          Back to Rent Predictor
        </button>
      </div>
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    window.scrollTo(0, 0);
    // Or for smooth scrolling:
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []); // Empty dependency array runs once on mount

  return (
    <div className="mx-auto">
      <Header title="Rent HeatMap" showBack />
      <div className="relative w-full h-screen">
        {/* MAP HEADING OVERLAY */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 bg-white/80 backdrop-blur-md px-6 py-2 rounded-lg shadow">
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
