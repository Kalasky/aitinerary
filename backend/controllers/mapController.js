const autoComplete = async (req, res) => {
  const { input } = req.body;
  // list of types:  https://developers.google.com/maps/documentation/places/web-service/supported_types

  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(regions)&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`,
    headers: {},
  };

  try {
    const response = await fetch(config.url, config);
    const data = await response.json();
    res.status(200).json(data.predictions);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  autoComplete,
};
