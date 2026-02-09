const normalize = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
};

module.exports = { normalize };
