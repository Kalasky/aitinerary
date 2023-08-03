const express = require("express");
const router = express.Router();
const { addTrip, getTrip } = require("../controllers/tripController");

router.post("/addTrip", addTrip);
router.get("/getTrip/:tripId", getTrip);

module.exports = router;
