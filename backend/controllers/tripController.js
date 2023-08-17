const { ObjectId } = require("mongodb");

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

const getPexelsImage = async (req, res) => {
  const { destination } = req.body;

  const config = {
    method: "GET",
    url: `https://api.pexels.com/v1/search?query=${destination}&page=1&per_page=1&orientation=landscape&size=large&per_page=10`,
    headers: {
      Authorization: process.env.PEXELS_API_KEY,
    },
  };

  try {
    const response = await fetch(config.url, config);
    const data = await response.json();

    const sortedPhotos = data.photos.sort((a, b) => {
      const dimensionsA = a.width * a.height;
      const dimensionsB = b.width * b.height;

      if (dimensionsA > dimensionsB) return -1;
      if (dimensionsA < dimensionsB) return 1;
      return 0;
    });

    res.status(200).json(sortedPhotos[0].src.large2x);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  getTrip,
  getPexelsImage,
};
