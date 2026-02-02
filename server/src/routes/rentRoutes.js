const express = require("express");
const router = express.Router();
const {evaluateRentController,getCitiesController,getAreasController} = require("../controllers/rentController");

router.post("/rent/predict", evaluateRentController);

router.get("/cities", getCitiesController);

router.get("/areas", getAreasController);

module.exports = router;
