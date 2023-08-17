const getLocationIDforDestination = async (destination) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    "User-Agent": "Triplio",
  };

  let response = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${destination}`,
    options
  );

  let data = await response.json();
  console.log(data);
  return data.data[0].location_id;
};

const getLocationDetails = async (locationId) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    "User-Agent": "Triplio",
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
    latitude: data.latitude,
    longitude: data.longitude,
  };

  return filteredData;
};

const getActivitiesInDestinationRadius = async (
  activity,
  latitude,
  longitude
) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    "User-Agent": "Triplio",
  };

  let response = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${activity}&language=en&key=${process.env.TRIPADVISOR_API_KEY}&radius=100&radiusUnit=mi&latLong=${latitude},${longitude}`,
    options
  );

  let data = await response.json();

  if (data.data && data.data.length > 0) {
    return data.data[0];
  } else {
    console.error("No data found for activity", activity);
    return null;
  }
};

const getLocationReviews = async (locationId) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    "User-Agent": "Triplio",
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
  getLocationIDforDestination,
  getLocationDetails,
  getLocationReviews,
  getActivitiesInDestinationRadius,
};
