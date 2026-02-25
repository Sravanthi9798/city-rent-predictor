const Regression = require("ml-regression-multivariate-linear");
const { getData } = require("../utils/csvLoader");
const { normalize } = require("../utils/normalize");

// ML cannot understand strings → convert to numbers
const furnishingMap = {
  unfurnished: 0,
  semifurnished: 1,
  furnished: 2
};

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

  //  Filter by area + city
  let filtered = data.filter(d =>
    normalize(d.city) === normalize(city) &&
    normalize(d.area) === normalize(area)
  );

  let level = "area";

  // Fallback to city level
  if (filtered.length < 3) {
    filtered = data.filter(d =>
      normalize(d.city) === normalize(city)
    );
    level = "city";
  }

  // Fallback to global level
  if (filtered.length < 3) {
    filtered = data;
    level = "global";
  }

  // HARD STOP: Need minimum 3 rows
  if (filtered.length < 3) {
    throw new Error(
      "Insufficient data: At least 3 listings required for ML prediction"
    );
  }

  // Prepare ML matrices
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
        furnishingMap[normalize(d.furnished)] ?? 0
      ]);

      Y.push([d.rent]);
    }
  });

  if (X.length < 3) {
    throw new Error("Insufficient valid rows for ML regression");
  }

  // Train ML Model
  const model = new Regression(X, Y);

  // Calculate R² Score
  let ssRes = 0;
  let ssTot = 0;

  const actual = Y.map(v => v[0]);

  const mean =
    actual.reduce((sum, val) => sum + val, 0) / actual.length;

  actual.forEach((y, i) => {
    const predicted = model.predict([X[i]])[0][0];

    ssRes += Math.pow(y - predicted, 2);
    ssTot += Math.pow(y - mean, 2);
  });

  const r2 = 1 - (ssRes / ssTot);

  // Predict rent for user input
  const predictedRent = model.predict([[
    bhk,
    size,
    bathroom,
    furnishingMap[normalize(furnished)] ?? 0
  ]])[0][0];

  const minEstimatedRent = Math.round(predictedRent * 0.9);
  const maxEstimatedRent = Math.round(predictedRent * 1.1);

  let result = "Fair";
  if (rent > maxEstimatedRent) result = "Too High";
  else if (rent < minEstimatedRent) result = "Too Low";

  // Confidence based on R²
  let confidence = "Low";
  if (r2 > 0.75) confidence = "High";
  else if (r2 > 0.6) confidence = "Medium";

  // Final Response
  return {
    levelUsed: level,
    r2Score: Number(r2.toFixed(3)),
    confidence,
    input: { city, area, bhk, size, bathroom, furnished, rent },
    predictedRent: Math.round(predictedRent),
    estimatedRange: {
      min: minEstimatedRent,
      max: maxEstimatedRent
    },
    result
  };
};

// ML library solves this equation:
// W=(XTX)−1XTY

module.exports = { evaluateRent };
