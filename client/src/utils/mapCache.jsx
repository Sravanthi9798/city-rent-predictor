// Global in-memory cache object
// Stores map data temporarily during app runtime
// Key   -> city name
// Value -> map data response for that city
const mapCache = {};

// getCachedMap
// Purpose:
//   Retrieve cached map data for a given city

export const getCachedMap = (city) => {
  return mapCache[city];
};

// setCachedMap
// Purpose:
//   Store map data in cache for a given city

export const setCachedMap = (city, data) => {
  mapCache[city] = data;
};
