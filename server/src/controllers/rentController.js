const { evaluateRent } = require("../services/rentService");
const { getData } = require("../utils/csvLoader");
const { normalize } = require("../utils/normalize");

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
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};


// Get all unique cities
const getCitiesController = (req, res) => {
  try {
    const cities = [
      ...new Set(
        getData()
          .map(d => d.city)
          .filter(Boolean) // remove empty/undefined
          .map(c => c.trim()) // remove extra spaces
      )
    ].sort();

    res.json(cities);
  } catch (error) {
    console.error("Error getting cities:", error);
    res.status(500).json({ message: error.message});
  }
};

// Get all areas for a given city
const getAreasController = (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const cityRows = getData().filter(
      d => normalize(d.city) === normalize(city)
    );

    if (cityRows.length === 0) {
      return res.json([]);
    }

    // Count listings per area
    const areaCountMap = {};

    cityRows.forEach(d => {
      const area = d.area?.trim();
      if (!area) return;
    // Increments listing count per area
      areaCountMap[area] = (areaCountMap[area] || 0) + 1;
    });

    //  Keep only areas with 3 or more listings
    const areas = Object.keys(areaCountMap)
      .filter(area => areaCountMap[area] >= 3)
      .sort();

    res.json(areas);
  } catch (err) {
    console.error("Error getting areas:", err);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  evaluateRentController,
  getCitiesController,
  getAreasController
};
