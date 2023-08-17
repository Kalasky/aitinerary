const { object, string, array, number } = require("yup");

const TripValidationSchema = object().shape({
  preferences: object().shape({
    departureCity: string().required("Trip departure city is required"),
    destination: string().required("Trip destination is required"),
    duration: string().required("Trip duration is required"),
    numberOfTravelers: number().required("Number of travelers is required"),
    budget: string().required("Trip budget is required"),
    ambience: string().required("Trip ambience is required"),
    theme: array().of(string()),
    ambience: array().of(string()),
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

async function validateSurpriseTrip(data) {
  return await TripValidationSchema.validate(data);
}

module.exports = validateSurpriseTrip;
