const express = require("express");
const router = express.Router();
const { autoComplete } = require("../controllers/mapController");

router.post("/autoComplete", autoComplete);

module.exports = router;
