// Import map service that prepares city-wise rent data with lat/lng
const { getCityMapData } = require("../services/mapService");

// Controller to handle API request for rent map data by city
// Route example: GET /api/map/:city
const getRentMapByCity = async (req, res) => {
  try {
    // Extract city name from URL parameters
    const { city } = req.params;

    // Validate required input
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    // Fetch processed map-ready data from service layer
    // Includes area-wise average rent, rent level, and coordinates
    const areas = await getCityMapData(city);

    // Send successful response to frontend
    // Used by Leaflet / Map UI to plot markers or heatmaps
    res.status(200).json({
      success: true,
      city,
      areas,
    });
  } catch (error) {
    // Log server-side error for debugging and monitoring
    console.error("Rent map error:", error.message);

    // Return generic server error response
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export controller for route binding
module.exports = {
  getRentMapByCity,
};
