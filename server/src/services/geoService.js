const axios = require("axios");
const GeoCache = require("../models/geoCacheModel");

// Get lat/lng from MongoDB if exists, else fetch from OpenStreetMap
const getLatLng = async (area, city) => {
  const normalizedArea = area.toLowerCase();
  const normalizedCity = city.toLowerCase();

  // Check MongoDB cache
  const cached = await GeoCache.findOne({ area: normalizedArea, city: normalizedCity });
  if (cached) {
    return { lat: cached.lat, lng: cached.lng };
  }

  // Fetch from OpenStreetMap
  const query = `${area}, ${city}, India`;
  const url = "https://nominatim.openstreetmap.org/search";

  try {
    const response = await axios.get(url, {
      params: { q: query, format: "json", limit: 1 },
      headers: { "User-Agent": "rent-map-app" }
    });

    if (!response.data.length) return null;

    const latLng = {
      lat: Number(response.data[0].lat),
      lng: Number(response.data[0].lon)
    };

    // Save to MongoDB
    const doc = new GeoCache({
      area: normalizedArea,
      city: normalizedCity,
      lat: latLng.lat,
      lng: latLng.lng
    });
    await doc.save().catch(err => {
      // Ignore duplicate key error
      if (err.code !== 11000) console.error(err);
    });

    return latLng;
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
};

module.exports = { getLatLng };
