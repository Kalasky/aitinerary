// Desc: API requests that directly interact with TripAdvisor
const redis = require("../utils/redisClient");

const getLocationsforDestination = async (searchQuery, category) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  let response = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${searchQuery}&category=${category}`,
    options
  );

  let data = await response.json();
  return data.data.map((location) => location.location_id);
};

const getLocationDetails = async (locationId) => {
  const cachedLocationDetails = await redis.get(locationId);

  if (cachedLocationDetails) {
    console.log("Retrieved location details from cache");
    return JSON.parse(cachedLocationDetails);
  }

  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  let response = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${process.env.TRIPADVISOR_API_KEY}`,
    options
  );

  let data = await response.json();

  let filteredData = {
    location_id: data.location_id,
    name: data.name,
    description: data.description,
    price_level: data.price_level,
    hours: data.hours,
    latitude: data.latitude,
    longitude: data.longitude,
  };

  await redis.set(
    locationId,
    JSON.stringify(filteredData),
    "EX",
    60 * 60 * 24 * 7
  );

  return filteredData;
};

const getLocationReviews = async (locationId) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  let response = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews?key=${process.env.TRIPADVISOR_API_KEY}`,
    options
  );

  let data = await response.json();

  let filteredReviews = data.data.map((review) => {
    return {
      title: review.title,
      text: review.text,
      rating: review.rating,
    };
  });

  return filteredReviews;
};

module.exports = {
  getLocationsforDestination,
  getLocationDetails,
  getLocationReviews,
};
