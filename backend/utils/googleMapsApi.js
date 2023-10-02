const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const getLocationsFromGoogle = async (activity, destination) => {
  try {
    const response = await client.textSearch({
      params: {
        query: `${activity} in ${destination}`,
        key: process.env.VITE_GOOGLE_MAPS_API_KEY,
      },
    });

    return response.data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
};

module.exports = {
  getLocationsFromGoogle,
};
