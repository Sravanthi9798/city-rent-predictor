const { getData } = require("../utils/csvLoader");
const { normalize } = require("../utils/normalize");

const calculateMarketStats = (listings, rent, level) => {

  // Extract rent values from comparable listings
  const rents = listings.map(d => d.rent);

  // Calculate average market rent
  const avgRent = Math.round(
    rents.reduce((a, b) => a + b, 0) / rents.length
  );

  // Find minimum and maximum rent in the market sample
  const minRent = Math.min(...rents);
  const maxRent = Math.max(...rents);

  // Default assumptions
  let verdict = "Fair";
  let differencePercent = 0;

  // Compare user rent with market average
  if (rent > avgRent) {
    // Calculate how much higher the rent is compared to market average
    differencePercent = ((rent - avgRent) / avgRent) * 100;

    // Mark as overpriced if difference exceeds tolerance threshold
    if (differencePercent > 5) verdict = "Overpriced";
  } else {
    // Calculate how much lower the rent is compared to market average
    differencePercent = ((avgRent - rent) / avgRent) * 100;

    // Mark as underpriced if difference exceeds tolerance threshold
    if (differencePercent > 5) verdict = "Underpriced";
  }

  // Return structured market comparison result
  return {
    levelUsed: level,                     // Area-level or city-level comparison
    listingsCompared: listings.length,    // Sample size used for analysis
    avgMarketRent: avgRent,               // Average market rent
    minMarketRent: minRent,               // Lowest observed rent
    maxMarketRent: maxRent,               // Highest observed rent
    differencePercent: Number(differencePercent.toFixed(1)),
    verdict,                              // Fair / Overpriced / Underpriced
    insight: `Your rent is ${differencePercent.toFixed(1)}% ${
      verdict === "Overpriced" ? "above" : "below"
    } the ${level}-level market average.`
  };
};

const compareMarket = ({ city, area, bhk, size, rent }) => {

  // Fetch entire normalized dataset
  const data = getData();

  // Convert input values to numbers for accurate comparison
  const bhkNum = Number(bhk);
  const sizeNum = Number(size);
  const rentNum = Number(rent);

  // Filter comparable listings at AREA level
  const areaListings = data.filter(
    d =>
      // City and area match (case-insensitive)
      normalize(d.city) === normalize(city) &&
      normalize(d.area) === normalize(area) &&

      // Allow ±1 BHK variation for comparability
      Math.abs(d.bhk - bhkNum) <= 1 &&

      // Allow ±300 sq ft variation to account for layout differences
      Math.abs(d.size - sizeNum) <= 300
  );

  // Filter comparable listings at CITY level
  const cityListings = data.filter(
    d =>
      // City match
      normalize(d.city) === normalize(city) &&

      // Allow ±1 BHK variation
      Math.abs(d.bhk - bhkNum) <= 1
  );

  // Ensure sufficient data for meaningful comparison
  if (areaListings.length < 3 && cityListings.length < 3) {
    throw new Error("Not enough market data");
  }

  // Return comparison summary
  return {
    // Echo back sanitized user input
    input: {
      city,
      area,
      bhk: bhkNum,
      size: sizeNum,
      rent: rentNum
    },

    // Area-level market comparison (if data available)
    areaComparison:
      areaListings.length >= 1
        ? calculateMarketStats(areaListings, rentNum, "area")
        : { message: "Insufficient area-level data" },

    // City-level market comparison (requires more data)
    cityComparison:
      cityListings.length >= 3
        ? calculateMarketStats(cityListings, rentNum, "city")
        : { message: "Insufficient city-level data" }
  };
};

module.exports = { compareMarket };