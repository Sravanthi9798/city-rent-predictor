const express = require("express");
const router = express.Router();
const {
  marketComparisonController
} = require("../controllers/marketController");

router.get("/market/compare", marketComparisonController);

module.exports = router;
