const { getData } = require("../utils/csvLoader");

const normalize = (v) => (v ? v.trim().toLowerCase() : "");

const calculateMarketStats = (listings, rent, level) => {
  const rents = listings.map(d => d.rent);

  const avgRent = Math.round(
    rents.reduce((a, b) => a + b, 0) / rents.length
  );

  const minRent = Math.min(...rents);
  const maxRent = Math.max(...rents);

  let verdict = "Fair";
  let differencePercent = 0;

  if (rent > avgRent) {
    differencePercent = ((rent - avgRent) / avgRent) * 100;
    if (differencePercent > 5) verdict = "Overpriced";
  } else {
    differencePercent = ((avgRent - rent) / avgRent) * 100;
    if (differencePercent > 5) verdict = "Underpriced";
  }

  return {
    levelUsed: level,
    listingsCompared: listings.length,
    avgMarketRent: avgRent,
    minMarketRent: minRent,
    maxMarketRent: maxRent,
    differencePercent: Number(differencePercent.toFixed(1)),
    verdict,
    insight: `Your rent is ${differencePercent.toFixed(1)}% ${
      verdict === "Overpriced" ? "above" : "below"
    } the ${level}-level market average.`
  };
};

const compareMarket = ({ city, area, bhk, size, rent }) => {
  const data = getData();

  const bhkNum = Number(bhk);
  const sizeNum = Number(size);
  const rentNum = Number(rent);

  const areaListings = data.filter(
    d =>
      normalize(d.city) === normalize(city) &&
      normalize(d.area) === normalize(area) &&
      Math.abs(d.bhk - bhkNum) <= 1 &&
      Math.abs(d.size - sizeNum) <= 300
  );

  const cityListings = data.filter(
    d =>
      normalize(d.city) === normalize(city) &&
      Math.abs(d.bhk - bhkNum) <= 1
  );

  if (areaListings.length < 3 && cityListings.length < 3) {
    throw new Error("Not enough market data");
  }

  return {
    input: { city, area, bhk: bhkNum, size: sizeNum, rent: rentNum },

    areaComparison:
      areaListings.length >= 1
        ? calculateMarketStats(areaListings, rentNum, "area")
        : { message: "Insufficient area-level data" },

    cityComparison:
      cityListings.length >= 3
        ? calculateMarketStats(cityListings, rentNum, "city")
        : { message: "Insufficient city-level data" }
  }; 
};

module.exports = { compareMarket };