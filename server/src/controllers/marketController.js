const { compareMarket } = require("../services/marketService");

const marketComparisonController = (req, res) => {
  try {
    const { city, area, bhk, size, rent } = req.query;

    if (!city || !bhk || !size || !rent) {
      return res.status(400).json({
        message: "city, bhk, size and rent are required"
      });
    }

    const result = compareMarket({ city, area, bhk, size, rent });

    res.json(result);
  } catch (err) {
    res.status(err.message.includes("Not enough") ? 404 : 500).json({
      message: "Market comparison failed",
      error: err.message
    });
  }
};

module.exports = { marketComparisonController };
