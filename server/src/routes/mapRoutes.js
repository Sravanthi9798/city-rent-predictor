const express = require("express");
const { getRentMapByCity } = require("../controllers/mapController");

const router = express.Router();

router.get("/rent-map/:city", getRentMapByCity);

module.exports = router;
