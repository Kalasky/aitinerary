const { generateSurpriseItinerary } = require("../services/aiSurpriseService");
const {
  abroadLocation,
  inCountryLocation,
} = require("../services/aiSurpriseService");

const addSurpriseTrip = async (req, res) => {
  let {
    departureCity,
    destination,
    budget,
    duration,
    ambience,
    numberOfTravelers,
    theme,
  } = req.body.preferences;

  try {
    if (destination === "abroad") {
      destination = await abroadLocation(departureCity);
    } else if (destination === "local") {
      destination = await inCountryLocation(departureCity);
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
      ambience,
      numberOfTravelers,
      theme,
    },
    itinerary: [],
    user: "",
  };

  try {
    const tripRes = await req.app.locals.db.collection("trips").insertOne(trip);

    const db = req.app.locals.db;
    generateSurpriseItinerary(db, tripRes.insertedId.toString(), trip.preferences);

    res.status(201).json({ tripId: tripRes.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = addSurpriseTrip;
