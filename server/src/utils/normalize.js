const normalize = (value) => {
    // It is for Filtering, Data consistency and Preventing duplicates
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
};

module.exports = { normalize };
