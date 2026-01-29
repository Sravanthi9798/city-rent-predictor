const { evaluateRent } = require("../services/rentService");

function evaluateRentController(req, res) {
  const { city, area, bhk, size, rent } = req.body;

  if (!city || !bhk || !size || !rent) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const response = evaluateRent(
    city,
    area,
    Number(bhk),
    Number(size),
    Number(rent)
  );

  res.json(response);
}

module.exports = { evaluateRentController };
