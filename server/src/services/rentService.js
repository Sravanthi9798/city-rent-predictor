const Regression = require("ml-regression-multivariate-linear");
const { getData } = require("../utils/csvLoader");
const { normalize } = require("../utils/normalize");

// constants, beacause ml cannot understand strings
const furnishingMap = {
  unfurnished: 0,
  semifurnished: 1,
  furnished: 2
};


// main service
const evaluateRent = async (
  city,
  area,
  bhk,
  size,
  bathroom = 1,
  furnished = "unfurnished",
  rent
) => {
  const data = getData();

  // Filter by area + city
  let filtered = data.filter(
    d =>
      normalize(d.city) === normalize(city) &&
      normalize(d.area) === normalize(area)
  );

  let level = "area";

  // fallback to city
  if (filtered.length < 3) {
    filtered = data.filter(d =>
      normalize(d.city) === normalize(city)
    );
    level = "city";
  }

  // fallback to global
  if (filtered.length < 3) {
    filtered = data;
    level = "global";
  }

  // HARD STOP: ML requires at least 3 rows
  if (filtered.length < 3) {
    throw new Error(
      "Insufficient data: At least 3 listings are required for ML prediction"
    );
  }

  // Prepare ML data
  const X = [];
  const Y = [];

  filtered.forEach(d => {
    if (
      Number.isFinite(d.bhk) &&
      Number.isFinite(d.size) &&
      Number.isFinite(d.bathroom) &&
      Number.isFinite(d.rent)
    ) {
      X.push([
        d.bhk,
        d.size,
        d.bathroom,
        furnishingMap[normalize(d.furnishing)] ?? 0
      ]);
      Y.push([d.rent]);
    }
  });

  // extra safety
  if (X.length < 3) {
    throw new Error(
      "Insufficient valid rows for ML regression"
    );
  }

  // Train ML model
  const model = new Regression(X, Y);

  // Predict rent
  const predictedRent = model.predict([[
    bhk,
    size,
    bathroom,
    furnishingMap[normalize(furnished)] ?? 0
  ]])[0][0];

  // Estimated range
  const minEstimatedRent = Math.round(predictedRent * 0.9);  // -10%
  const maxEstimatedRent = Math.round(predictedRent * 1.1);  // +10%

  let result = "Fair";
  if (rent > maxEstimatedRent) result = "Too High";
  else if (rent < minEstimatedRent) result = "Too Low";

  // Final response
  return {
    levelUsed: level,
    confidence: "High",
    input: { city, area, bhk, size, bathroom, furnished, rent },
    predictedRent: Math.round(predictedRent),
    estimatedRange: {
      min: minEstimatedRent,
      max: maxEstimatedRent
    },
    result,
    explanation: `Prediction based on:
- ${level}-level data
- Multivariate Linear Regression
- Minimum 3 listings enforced`
  };
};

module.exports = { evaluateRent };
