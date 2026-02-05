import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import ChartBlock from "../components/ChartBlock";

function MarketComparisonDashboard() {
  const navigate = useNavigate();
  const input =
    location.state?.input || JSON.parse(localStorage.getItem("rentInput"));
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!input) {
      navigate("/");
      return;
    }

    const query = new URLSearchParams({
      city: input.city,
      area: input.area,
      bhk: input.bhk,
      size: input.size,
      rent: input.rent,
    });

    fetch(`http://localhost:3001/api/market/compare?${query}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [input, navigate]);

  if (!data) return <div className="p-6">Loading...</div>;

  const goToHeatmap = async () => {
  if (!input?.city) return alert("City not available");

  try {
    // Fetch map data from your API
    const res = await fetch(
      `http://localhost:3001/api/map/rent-map/${input.city}`
    );

    if (!res.ok) throw new Error("Failed to fetch map data");

    const mapData = await res.json();

    // Navigate to heatmap page with state
    navigate("/rent-heatmap", {
      state: {
        city: input.city,
        mapData,
      },
    });
  } catch (err) {
    alert("Failed to load heatmap data: " + err.message);
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-balck-600 hover:underline flex items-center gap-1"
      >
        ← Back to Rent Predictor
      </button>
      <h2 className="text-xl font-bold">
        Market Comparison – {input.city} / {input.area}
      </h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Your Rent" value={`₹ ${input.rent}`} />
        <SummaryCard
          title="Area Avg Rent"
          value={`₹ ${data.areaComparison.avgMarketRent}`}
        />
        <SummaryCard
          title="City Avg Rent"
          value={`₹ ${data.cityComparison.avgMarketRent}`}
        />
      </div>

      {/* AREA */}
      <ChartBlock
        title="Area Comparison"
        avg={data.areaComparison.avgMarketRent}
        yourRent={input.rent}
        verdict={data.areaComparison.verdict}
        insight={data.areaComparison.insight}
      />

      {/* CITY */}
      <ChartBlock
        title="City Comparison"
        avg={data.cityComparison.avgMarketRent}
        yourRent={input.rent}
        verdict={data.cityComparison.verdict}
        insight={data.cityComparison.insight}
      />
      {/* HEATMAP NAVIGATION */}
     <div className="flex justify-center pt-6">
  <button
    onClick={goToHeatmap}
    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
  >
    View Rent Heatmap for {input.city}
  </button>
</div>

    </div>
  );
}

export default MarketComparisonDashboard;
