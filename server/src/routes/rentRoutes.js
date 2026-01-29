const express = require("express");
const router = express.Router();
const {evaluateRentController} = require("../controllers/rentController");

router.post("/evaluate", evaluateRentController);

module.exports = router;
