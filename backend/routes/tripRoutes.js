const express = require("express");
const router = express.Router();
const { getTrip, getPexelsImage } = require("../controllers/tripController");
const addSurpriseTrip = require("../controllers/surpriseController");
const addDefaultTrip = require("../controllers/defaultController");

router.post("/addSurpriseTrip", addSurpriseTrip);
router.post("/addDefaultTrip", addDefaultTrip);
router.get("/getTrip/:tripId", getTrip);
router.post("/pexelsUrl", getPexelsImage);

module.exports = router;
