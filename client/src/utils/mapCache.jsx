// Global in-memory cache for map data
const mapCache = {};

export const getCachedMap = (city) => {
  return mapCache[city];
};

export const setCachedMap = (city, data) => {
  mapCache[city] = data;
};
