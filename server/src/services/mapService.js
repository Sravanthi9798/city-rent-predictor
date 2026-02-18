const { getRows } = require("../utils/csvLoader");
const { getLatLng } = require("./geoService");

const getRentLevel = (rent, cityAvg) => {
  if (rent < cityAvg * 0.8) return "LOW";// LOW  → 20% below city average
  if (rent > cityAvg * 1.2) return "HIGH";// HIGH → 20% above city average
  return "MED";// MED  → within normal range
};

// Main service to prepare map-ready rent data for a city
const getCityMapData = async (cityInput) => {
  const city = cityInput.toLowerCase();

  // Filter all CSV rows belonging to the selected city
  const rows = getRows().filter(r => r.city === city);

  // If no data exists for the city, return empty response
  if (!rows.length) return [];

  // Group rent values by area
  // Example:
  // {
  //   "whitefield": [18000, 19000, 20000],
  //   "btm": [22000, 23000]
  // }
  const areaMap = {};
  rows.forEach(({ area, rent }) => {
    if (!areaMap[area]) areaMap[area] = [];
    areaMap[area].push(rent);
  });

  // Calculate average rent of the entire city
  // Used as a baseline for LOW / MED / HIGH classification
  const cityAvg = rows.reduce((sum, r) => sum + r.rent, 0) / rows.length;

  // Fetch latitude & longitude for each area in parallel
  // Promise.all improves performance by avoiding sequential API calls
  const results = await Promise.all(
    Object.keys(areaMap).map(async (area) => {
      const rents = areaMap[area];

      // Calculate average rent for this area
      const avgRent =
        rents.reduce((a, b) => a + b, 0) / rents.length;

      // Fetch geo coordinates (from DB cache or API)
      const latLng = await getLatLng(area, city);

      // Skip area if coordinates could not be resolved
      if (!latLng) return null;

      // Return map-ready object for frontend
      return {
        area,                                 // Area name
        avgRent: Math.round(avgRent),         // Rounded average rent
        level: getRentLevel(avgRent, cityAvg),// LOW / MED / HIGH
        lat: latLng.lat,                      // Latitude
        lng: latLng.lng                       // Longitude
      };
    })
  );

  // Remove null entries (areas with missing geo data)
  return results.filter(Boolean);
};

// Export service for controller usage
module.exports = { getCityMapData };
