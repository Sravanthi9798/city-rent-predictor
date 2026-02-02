const { evaluateRent } = require("../services/rentService");
const { getData } = require("../utils/csvLoader");

// Normalize strings
// const normalize = (str) => str?.trim().toLowerCase();

// Evaluate rent API
const evaluateRentController = async (req, res) => {
  try {
    const { city, area, bhk, size, bathroom = 1, furnished = "unfurnished", rent } = req.body;

    if (!city || !bhk || !size || !rent) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const response = await evaluateRent(
      city,
      area || "",
      Number(bhk),
      Number(size),
      Number(bathroom),
      furnished,
      Number(rent)
    );

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};

const normalize = (str) => (str ? str.trim().toLowerCase() : "");

// Get all unique cities
const getCitiesController = (req, res) => {
  try {
    const cities = [
      ...new Set(
        getData()
          .map(d => d.city)
          .filter(Boolean)          // remove empty/undefined
          .map(c => c.trim())       // remove extra spaces
      )
    ].sort();

    res.json(cities);
  } catch (err) {
    console.error("Error getting cities:", err);
    res.status(500).json({ message: "Failed to fetch cities", error: err.message });
  }
};

// Get all areas for a given city
const getAreasController = (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // Filter rows matching the city (normalized)
    const filteredRows = getData().filter(
      (d) => normalize(d.city) === normalize(city)
    );

    if (filteredRows.length === 0) {
      return res.json([]); // return empty array if city not found
    }

    // Extract unique areas
    const areas = [
      ...new Set(
        filteredRows
          .map(d => d.area)
          .filter(Boolean)  // remove empty/undefined areas
          .map(a => a.trim()) // remove extra spaces
      )
    ].sort();

    res.json(areas);
  } catch (err) {
    console.error("Error getting areas:", err);
    res.status(500).json({ message: "Failed to fetch areas", error: err.message });
  }
};


module.exports = {
  evaluateRentController,
  getCitiesController,
  getAreasController
};
