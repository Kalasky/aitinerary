const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const autoComplete = async (req, res) => {
  const { input } = req.body;

  try {
    const response = await client.placeQueryAutocomplete({
      params: {
        input: input,
        key: process.env.VITE_GOOGLE_MAPS_API_KEY,
      },
    });

    res.status(200).json(response.data.predictions);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  autoComplete,
};
