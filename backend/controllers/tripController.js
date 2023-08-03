// Desc: Handling of trip related requests (e.g. add trip, get trip, etc.)
const { generateItinerary } = require("../services/aiService");
const { abroadLocation, inCountryLocation } = require("../services/aiService");
const { ObjectId } = require("mongodb");

const addTrip = async (req, res) => {
  let {
    departureCity,
    destination,
    budget,
    duration,
    landscapes,
    numberOfPeople,
    theme,
  } = req.body.preferences;

  try {
    if (destination === "abroad") {
      destination = await abroadLocation(departureCity);
      console.log(destination);
    } else if (destination === "local") {
      destination = await inCountryLocation(departureCity);
      console.log(destination);
    }
  } catch (error) {
    console.error("Error generating destination: ", error);
    return [];
  }

  const trip = {
    preferences: {
      departureCity,
      destination,
      budget,
      duration,
      landscapes,
      numberOfPeople,
      theme,
    },
    itinerary: [],
    user: "",
  };

  try {
    const tripRes = await req.app.locals.db.collection("trips").insertOne(trip);

    const db = req.app.locals.db;
    generateItinerary(db, tripRes.insertedId.toString(), trip.preferences);

    res.status(201).json({ tripId: tripRes.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const getTrip = async (req, res) => {
  const tripId = req.params.tripId;

  try {
    const trip = await req.app.locals.db
      .collection("trips")
      .findOne({ _id: new ObjectId(tripId) });

    if (!trip) {
      res.status(404).json({ message: "Trip not found." });
      return;
    }

    res.status(200).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  addTrip,
  getTrip,
};
