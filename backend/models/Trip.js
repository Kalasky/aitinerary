const { object, string, array, number } = require("yup");

const TripValidationSchema = object().shape({
  preferences: object().shape({
    departureCity: string().required("Departure city is required"),
    destination: string().required("Destination is required"),
    duration: string().required("Duration is required"),
    numberOfPeople: string().required("Number of people is required"),
    budget: string().required("Budget is required"),
    landscapes: string().required("Landscapes is required"),
    theme: string(),
  }),
  itinerary: string(),
  detailedItinerary: array().of(
    object().shape({
      day: string(),
      locations: array().of(
        object().shape({
          location: string(),
          lat: number(),
          lng: number(),
        })
      ),
      detailedItinerary: string(),
    })
  ),
  user: string(),
});

async function validateTrip(data) {
  return await TripValidationSchema.validate(data);
}

module.exports = validateTrip;
