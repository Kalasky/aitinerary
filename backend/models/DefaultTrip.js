const { object, string, array, number } = require("yup");

const DefaultTripValidationSchema = object().shape({
  preferences: object().shape({
    destinationCity: string().required("Trip destination is required"),
    duration: string().required("Trip duration is required"),
    prompt: string().required("Trip prompt is required"),
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

async function validateDefaultTrip(data) {
  return await DefaultTripValidationSchema.validate(data);
}

module.exports = validateDefaultTrip;
