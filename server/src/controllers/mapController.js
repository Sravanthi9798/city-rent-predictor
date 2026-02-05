const { getCityMapData } = require("../services/mapService");

const getMapAreas = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: "City is required" });

    const result = await getCityMapData(city);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Map data fetch failed" });
  }
};

module.exports = { getMapAreas };
