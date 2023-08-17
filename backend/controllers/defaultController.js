const { generateDefaultItinerary } = require("../services/aiDefaultService");

const addDefaultTrip = async (req, res) => {
  let { destinationCity, prompt, duration } = req.body.preferences;

  const trip = {
    preferences: {
      destinationCity,
      duration,
      prompt,
    },
	itinerary: [],
  };

  try {
    const tripRes = await req.app.locals.db.collection("trips").insertOne(trip);

    const db = req.app.locals.db;
    generateDefaultItinerary(
      db,
      tripRes.insertedId.toString(),
      trip.preferences
    );

    res.status(201).json({ tripId: tripRes.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = addDefaultTrip;
