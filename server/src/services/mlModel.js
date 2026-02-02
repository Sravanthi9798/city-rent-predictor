const Regression = require("ml-regression-multivariate-linear");
const { getData } = require("../utils/csvLoader");

const furnishingMap = {
  unfurnished: 0,
  "semi-furnished": 1,
  semifurnished: 1,
  furnished: 2
};

let model = null;

const trainModel = () => {
  const data = getData();

  const X = [];
  const Y = [];

  data.forEach(d => {
    // make sure all inputs are numbers
    const bhk = Number(d.bhk);
    const size = Number(d.size);
    const bathroom = Number(d.bathroom || bhk); // fallback
    const rent = Number(d.rent);
    const furnishing = furnishingMap[d.furnishing?.toLowerCase()] ?? 0;

    if ([bhk, size, bathroom, rent].some(v => isNaN(v))) {
      return; // skip invalid rows
    }

    X.push([bhk, size, bathroom, furnishing]);
    Y.push([rent]);
  });

  if (X.length < 3) {
    console.log("Not enough valid data to train ML model");
    return;
  }

  model = new Regression(X, Y);
  console.log(`ML Model trained on ${X.length} rows`);
};

const predictRentML = (features) => {
  if (!model) return null;

  const [bhk, size, bathroom, furnishing] = features.map(Number);
  if ([bhk, size, bathroom, furnishing].some(v => isNaN(v))) return null;

  return model.predict([[bhk, size, bathroom, furnishing]])[0][0];
};

module.exports = { trainModel, predictRentML, furnishingMap };
