const Regression = require("ml-regression-multivariate-linear");
const { getData } = require("../utils/csvLoader");

function evaluateRent(city, area, bhk, size, rent) {
  const allData = getData();

  // area level filtering
  let filtered = allData.filter(
    d => d.city === city && d.area === area
  );

  let level = "area";

  // city-level filtering
  if (filtered.length < 5) {
    filtered = allData.filter(d => d.city === city);
    level = "city";
  }

  // Global fallback
  if (filtered.length < 5) {
    filtered = allData;
    level = "global";
  }

  const X = [];
  const Y = [];

  filtered.forEach(d => {
    X.push([d.bhk, d.size]);
    Y.push([d.rent]);
  });

  const model = new Regression(X, Y);
  const predicted = model.predict([[bhk, size]])[0][0];

  let result = "Fair";
  if (rent > predicted * 1.1) result = "Too High";
  else if (rent < predicted * 0.9) result = "Too Low";

  return {
    predictedRent: Math.round(predicted),
    result,
    predictionLevel: level
  };
}

module.exports = { evaluateRent };
