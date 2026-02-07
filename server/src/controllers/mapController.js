const { getCityMapData } = require("../services/mapService");

const getRentMapByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }
    const areas = await getCityMapData(city);
    res.status(200).json({
      success: true,
      city,
      areas,
    });
  } catch (error) {
    console.error("Rent map error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rent map data",
    });
  }
};

module.exports = {
  getRentMapByCity,
};
