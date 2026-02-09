import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import ChartBlock from "../components/ChartBlock";
import Header from "../components/Header";

function MarketComparisonDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [input, setInput] = useState(null);
  const [data, setData] = useState(null);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  // Prevent duplicate API calls (React 18 Strict Mode)
  const fetchedRef = useRef(false);

  // STEP 1: Load input ONCE
  useEffect(() => {
    const storedInput =
      location.state?.input ||
      JSON.parse(localStorage.getItem("rentInput"));

    if (!storedInput) {
      navigate("/");
      return;
    }

    setInput(storedInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!input || fetchedRef.current) return;

    fetchedRef.current = true;

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
      .catch((err) => {
        console.error(err);
        fetchedRef.current = false;
      });
  }, [input]);

  const goToHeatmap = async () => {
    if (!input?.city) {
      alert("City not available");
      return;
    }

    setLoadingHeatmap(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/map/rent-map/${input.city}`
      );

      if (!res.ok) throw new Error("Failed to fetch map data");

      const mapData = await res.json();

      navigate("/rent-heatmap", {
        state: {
          city: input.city,
          mapData,
        },
      });
    } catch (err) {
      alert("Failed to load heatmap data: " + err.message);
    } finally {
      setLoadingHeatmap(false);
    }
  };

  if (!input || !data) {
    return <div className="p-6">Loading market comparison...</div>;
  }

  return (
    <div>
      <Header title="Market Comparison Dashboard" showBack />
      <div className="max-w-5xl mx-auto p-6 space-y-6">

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

        {/* AREA COMPARISON */}
        <ChartBlock
          title="Area Comparison"
          avg={data.areaComparison.avgMarketRent}
          yourRent={input.rent}
          verdict={data.areaComparison.verdict}
          insight={data.areaComparison.insight}
        />

        {/* CITY COMPARISON */}
        <ChartBlock
          title="City Comparison"
          avg={data.cityComparison.avgMarketRent}
          yourRent={input.rent}
          verdict={data.cityComparison.verdict}
          insight={data.cityComparison.insight}
        />

        {/* HEATMAP BUTTON */}
        <div className="flex justify-center pt-6">
          <button
            onClick={goToHeatmap}
            disabled={loadingHeatmap}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition ${
              loadingHeatmap ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingHeatmap
              ? "Loading Heatmap..."
              : `View Rent Heatmap for ${input.city}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarketComparisonDashboard;
