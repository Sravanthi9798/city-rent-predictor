const axios = require("axios");
const GeoCache = require("../models/geoCacheModel");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//  Fetch latitude and longitude for a given area and city
// Check local MongoDB cache first, If not found, call external geocoding API, Store result in cache for future requests

const getLatLng = async (area, city) => {

  // Normalize input to avoid case-sensitive duplicates in cache
  const normalizedArea = area.toLowerCase();
  const normalizedCity = city.toLowerCase();

  // Check if coordinates already exist in local cache (MongoDB)
  const cached = await GeoCache.findOne({
    area: normalizedArea,
    city: normalizedCity,
  });

  // If cached data exists, return it immediately (fast path)
  if (cached) {
    return { lat: cached.lat, lng: cached.lng };
  }

  // Build a geocoding query string
  const query = `${area}, ${city}, India`;

  try {
    // IMPORTANT: Enforce delay to stay within free API rate limits
    await sleep(1100);

    // Call OpenStreetMap Nominatim API for geocoding
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,        // Search query
          format: "json",  // Response format
          limit: 1         // Only need the top result
        },
        headers: {
          // Required by Nominatim to identify the application
          "User-Agent": "CityRentPredictor/1.0 (contact: your-email@example.com)",
        },
        timeout: 10000, // Fail fast if API is slow/unresponsive
      }
    );

    // If no results are returned, geocoding failed
    if (!response.data?.length) return null;

    // Extract and convert latitude/longitude to numbers
    const latLng = {
      lat: Number(response.data[0].lat),
      lng: Number(response.data[0].lon),
    };

    // Store coordinates in MongoDB cache for future requests
    // Duplicate insert errors are safely ignored
    await GeoCache.create({
      area: normalizedArea,
      city: normalizedCity,
      lat: latLng.lat,
      lng: latLng.lng,
    }).catch(err => {
      // Ignore duplicate key error (already cached)
      if (err.code !== 11000) console.error(err);
    });

    // Return newly fetched coordinates
    return latLng;

  } catch (err) {
    // Handle API/network errors gracefully
    console.error("Geocode error:", err.message);
    return null;
  }
};

module.exports = { getLatLng };

// “Before calling any external geocoding API, I check MongoDB for cached coordinates. If not found, I fetch them 
// using OpenStreetMap 
// with rate limiting, store them in cache, and reuse them for future heatmap requests.”