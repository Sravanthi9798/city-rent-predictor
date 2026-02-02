const Regression = require("ml-regression-multivariate-linear");
const { getData } = require("../utils/csvLoader");

// constants
const furnishingMap = {
  unfurnished: 0,
  "semi-furnished": 1,
  semifurnished: 1,
  furnished: 2
};

const normalize = (v) => (v ? v.trim().toLowerCase() : "");

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

// Area,city = global filter
  let filtered = data.filter(
    d =>
      normalize(d.city) === normalize(city) &&
      normalize(d.area) === normalize(area)
  );
  let level = "area";

  if (filtered.length === 0) {
    filtered = data.filter(d => normalize(d.city) === normalize(city));
    level = "city";
  }

  if (filtered.length === 0) {
    filtered = data;
    level = "global";
  }

  // single row(No ML)
  if (filtered.length === 1) {
    const d = filtered[0];
    const ppsf = d.rent / d.size;
    const predicted = ppsf * size;

    const minEstimatedRent = Math.round(predicted * 0.9);
    const maxEstimatedRent = Math.round(predicted * 1.1);

    let result = "Fair";
    if (rent > maxEstimatedRent) result = "Too High";
    else if (rent < minEstimatedRent) result = "Too Low";

    return {
      levelUsed: level,
      confidence: "Low",
      input: { city, area, bhk, size, bathroom, furnished, rent },
      predictedRent: Math.round(predicted),
      estimatedRange: {
        min: minEstimatedRent,
        max: maxEstimatedRent
      },
      result,
      explanation: `Prediction based on:
- Single listing in ${level}
- Price-per-sqft method
- ML disabled due to insufficient data`
    };
  }

// median price / SQFT
  const ppsfList = filtered
    .filter(d => d.size > 0 && d.rent > 0)
    .map(d => d.rent / d.size)
    .sort((a, b) => a - b);

  const medianPpsf =
    ppsfList[Math.floor(ppsfList.length / 2)];

  let predictedRent = medianPpsf * size;

// bhk adjustment
  const BASE_BHK = 2;
  const BHK_RATE = 0.1;

  predictedRent *=
    1 + Math.max(0, bhk - BASE_BHK) * BHK_RATE;

// Ml Regression(safe)
  let confidence = "Medium";

  if (filtered.length >= 3) {
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
          furnishingMap[d.furnishing] ?? 0
        ]);
        Y.push([d.rent]);
      }
    });

    if (X.length >= 3) {
      const model = new Regression(X, Y);

      const mlPred = model.predict([[
        bhk,
        size,
        bathroom,
        furnishingMap[furnished] ?? 0
      ]])[0][0];

      // blend (prevents overfit)
      predictedRent = predictedRent * 0.8 + mlPred * 0.2;
      confidence = "High";
    }
  }

  // Estimated Range
  const minEstimatedRent = Math.round(predictedRent * 0.9);
  const maxEstimatedRent = Math.round(predictedRent * 1.1);

  let result = "Fair";
  if (rent > maxEstimatedRent) result = "Too High";
  else if (rent < minEstimatedRent) result = "Too Low";

  // Final Response
  return {
    levelUsed: level,
    confidence,
    input: { city, area, bhk, size, bathroom, furnished, rent },

    predictedRent: Math.round(predictedRent),

    estimatedRange: {
      min: minEstimatedRent,
      max: maxEstimatedRent
    },

    result,

    explanation: `Prediction based on:
- ${level}-level market data
- Median price per sqft
- BHK premium adjustment
- ML regression (used only when safe)`
  };
};

module.exports = { evaluateRent };
