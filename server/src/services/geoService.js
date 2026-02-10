const axios = require("axios");
const GeoCache = require("../models/geoCacheModel");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getLatLng = async (area, city) => {
  const normalizedArea = area.toLowerCase();
  const normalizedCity = city.toLowerCase();

  const cached = await GeoCache.findOne({
    area: normalizedArea,
    city: normalizedCity,
  });

  if (cached) {
    return { lat: cached.lat, lng: cached.lng };
  }

  const query = `${area}, ${city}, India`;

  try {
    // IMPORTANT: rate limiting
    await sleep(1100);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: query, format: "json", limit: 1 },
        headers: {
          "User-Agent": "CityRentPredictor/1.0 (contact: your-email@example.com)",
        },
        timeout: 10000,
      }
    );

    if (!response.data?.length) return null;

    const latLng = {
      lat: Number(response.data[0].lat),
      lng: Number(response.data[0].lon),
    };

    await GeoCache.create({
      area: normalizedArea,
      city: normalizedCity,
      lat: latLng.lat,
      lng: latLng.lng,
    }).catch(err => {
      if (err.code !== 11000) console.error(err);
    });

    return latLng;
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
};

module.exports = { getLatLng };
