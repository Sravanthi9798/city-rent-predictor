const { getRows } = require("../utils/csvLoader");
const { getLatLng } = require("./geoService");

const getRentLevel = (rent, cityAvg) => {
  if (rent < cityAvg * 0.8) return "LOW";
  if (rent > cityAvg * 1.2) return "HIGH";
  return "MED";
};

const getCityMapData = async (cityInput) => {
  const city = cityInput.toLowerCase();
  const rows = getRows().filter(r => r.city === city);

  if (!rows.length) return [];

  // Group by area
  const areaMap = {};
  rows.forEach(({ area, rent }) => {
    if (!areaMap[area]) areaMap[area] = [];
    areaMap[area].push(rent);
  });

  const cityAvg = rows.reduce((sum, r) => sum + r.rent, 0) / rows.length;

  // Parallelize lat/lng fetching from MongoDB / API
  const results = await Promise.all(
    Object.keys(areaMap).map(async (area) => {
      const rents = areaMap[area];
      const avgRent = rents.reduce((a, b) => a + b, 0) / rents.length;

      const latLng = await getLatLng(area, city);
      if (!latLng) return null;

      return {
        area,
        avgRent: Math.round(avgRent),
        level: getRentLevel(avgRent, cityAvg),
        lat: latLng.lat,
        lng: latLng.lng
      };
    })
  );

  return results.filter(Boolean);
};

module.exports = { getCityMapData };
