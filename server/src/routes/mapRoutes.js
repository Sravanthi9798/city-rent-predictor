const express = require("express");
const { getCityMapData } = require("../services/mapService");

const router = express.Router();

router.get("/rent-map/:city", async (req, res) => {
  try {
    const city = req.params.city; // dynamic city
    const data = await getCityMapData(city);

    res.json({
      city,
      areas: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
