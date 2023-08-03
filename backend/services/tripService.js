// Desc: Service for handling data from the TripAdvisor API functions in utils/tripAdvisorApi.js
const {
  getLocationDetails,
  getLocationsforDestination,
  getLocationReviews,
} = require("../utils/tripAdvisorApi");

const fetchTripAdvisorData = async (itinerary) => {
  let detailedLocations = [];

  // Extract location names surrounded by ** from the itinerary
  const locationNames = itinerary
    .match(/\*\*(.*?)\*\*/g)
    .map((name) => name.replace(/\*\*/g, ""));

  for (let locationName of locationNames) {
    let locationIds = await getLocationsforDestination(
      locationName,
      "attractions"
    );

    for (let locationId of locationIds) {
      let locationDetails = await getLocationDetails(locationId);
      let locationReviews = await getLocationReviews(locationId);

      detailedLocations.push({
        ...locationDetails,
        reviews: locationReviews,
      });
    }
  }

  return detailedLocations;
};

module.exports = fetchTripAdvisorData;

module.exports = {
  fetchTripAdvisorData,
};
