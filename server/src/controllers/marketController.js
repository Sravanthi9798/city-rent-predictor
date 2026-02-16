// Import market comparison business logic from service layer
const { compareMarket } = require("../services/marketService");

//  Controller to handle market rent comparison requests
//  Reads query parameters, validates input, invokes service logic,
// and returns a structured comparison response

const marketComparisonController = (req, res) => {
  try {
    // Extract required query parameters from request URL
    const { city, area, bhk, size, rent } = req.query;

    // Validate mandatory fields
    // Area is optional; city, bhk, size, and rent are required
    if (!city || !bhk || !size || !rent) {
      return res.status(400).json({
        message: "city, bhk, size and rent are required"
      });
    }

    // Call service layer to perform market comparison logic
    const result = compareMarket({ city, area, bhk, size, rent });

    // Send successful comparison result to client
    res.json(result);

  } catch (err) {
    // Handle known business errors (e.g., insufficient market data)
    // Return 404 when comparison cannot be performed due to lack of data
    const statusCode = err.message.includes("Not enough") ? 404 : 500;

    res.status(statusCode).json({
      message: "Market comparison failed",
      error: err.message
    });
  }
};

module.exports = { marketComparisonController };
