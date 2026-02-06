import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function RentPrediction() {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [bhk, setBhk] = useState("");
  const [size, setSize] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [rent, setRent] = useState("");
  const [prediction, setPrediction] = useState(null);

  const navigate=useNavigate();

  useEffect(() => {
    localStorage.removeItem("rentInput");
  }, []);

  // Fetch cities
  useEffect(() => {
    fetch("http://localhost:3001/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch areas when city changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedArea("");
    if (!selectedCity) return;

    fetch(
      `http://localhost:3001/api/areas?city=${encodeURIComponent(selectedCity)}`,
    )
      .then((res) => res.json())
      .then((data) => setAreas(data))
      .catch((err) => console.error(err));
  }, [selectedCity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedCity ||
      !selectedArea ||
      !bhk ||
      !size ||
      !bathroom ||
      !furnishing
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/rent/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          area: selectedArea,
          bhk: Number(bhk),
          size: Number(size),
          bathroom: Number(bathroom),
          furnished: furnishing.toLowerCase(),
          rent: rent ? Number(rent) : undefined,
        }),
      });

      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      alert("Prediction failed", err);
    }
  };

const goToMarketComparison = () => {
  if (!prediction) return alert("Please predict rent first");

  const inputData = {
    city: selectedCity,
    area: selectedArea,
    bhk: Number(bhk),
    size: Number(size),
    bathroom: Number(bathroom),
    rent: rent ? Number(rent) : prediction.predictedRent,
  };

  // Save to localStorage so refresh works
  localStorage.setItem("rentInput", JSON.stringify(inputData));

  navigate("/marketcomparison", {
    state: { input: inputData },
  });
};



  return (
    
    <div className="w-full font-sans-serif flex justify-center">
      
      <div className="container rounded-sm mt-15 w-120 p-4 shadow-md bg-white/30 backdrop-blur-md border border-white/90">
        
        {/* Logo */}
        {/* <div className="flex justify-center">
          <img className="w-20" src={person} alt="logo" />
        </div> */}

        {/* Heading */}
        <div className="flex justify-center mb-3">
          <h2 className="font-semibold text-xl text-black">Rent Predictor</h2>
        </div>

        {/* Form */}
        <form className="flex flex-col p-3" onSubmit={handleSubmit}>
          {/* City */}
          <label className="font-semibold my-1 text-left">City</label>
          <select
            className="border rounded-sm h-9 p-2"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Area */}
          <label className="font-semibold my-1 text-left">Area</label>
          <select
            className="border rounded-sm h-9 p-2"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            required
          >
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* BHK */}
          <label className="font-semibold my-1 text-left">BHK</label>
          <input
            className="border rounded-sm h-9 p-2"
            type="number"
            min="1"
            value={bhk}
            onChange={(e) => setBhk(e.target.value)}
            required
          />

          {/* Size */}
          <label className="font-semibold my-1 text-left">Size (sqft)</label>
          <input
            className="border rounded-sm h-9 p-2"
            type="number"
            min="1"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />

          {/* Bathrooms */}
          <label className="font-semibold my-1 text-left">Bathrooms</label>
          <input
            className="border rounded-sm h-9 p-2"
            type="number"
            min="1"
            value={bathroom}
            onChange={(e) => setBathroom(e.target.value)}
            required
          />

          {/* Furnishing */}
          <label className="font-semibold my-1 text-left">Furnishing</label>
          <select
            className="border rounded-sm h-9 p-2"
            value={furnishing}
            onChange={(e) => setFurnishing(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Furnished">Furnished</option>
          </select>

          {/* Rent */}
          <label className="font-semibold my-1 text-left">
            Current Rent (optional)
          </label>
          <input
            className="border rounded-sm h-9 p-2"
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />

          <button
            className="bg-sky-500 text-white font-semibold rounded-sm mt-5 h-9"
            type="submit"
          >
            Predict Rent
          </button>
        </form>

        {/* Result */}
        {prediction && (
          <div className="mt-5 bg-white border rounded-md shadow p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Prediction Result
            </h3>

            {/* Predicted Rent */}
            <div className="text-3xl font-bold text-sky-700">
              ₹ {prediction.predictedRent.toLocaleString()}
            </div>

            {/* Range */}
            <p className="text-sm text-gray-600 mt-1">
              Estimated range: ₹{" "}
              {prediction.estimatedRange.min.toLocaleString()} – ₹{" "}
              {prediction.estimatedRange.max.toLocaleString()}
            </p>

            {/* Result Badge */}
            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full
          ${
            prediction.result === "Too Low"
              ? "bg-red-100 text-red-700"
              : prediction.result === "Too High"
                ? "bg-orange-100 text-orange-700"
                : "bg-green-100 text-green-700"
          }
        `}
              >
                {prediction.result}
              </span>
            </div>
            <button
  type="button"
  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-sm px-4 py-2"
  onClick={goToMarketComparison}
>
  Go to Market Comparison
</button>
          </div>
          
        )}
      </div>
      
    </div>
  );
}

export default RentPrediction;
