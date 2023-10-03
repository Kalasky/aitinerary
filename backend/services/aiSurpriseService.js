const { ObjectId } = require("mongodb");
const { getLocationsFromGoogle } = require("../utils/googleMapsApi");

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const {
  ROMANTIC_ACTIVITIES,
  PARTY_ACTIVITIES,
  RELAXATION_ACTIVITIES,
  CULTURAL_ACTIVITIES,
} = require("../constants/activities");

const abroadLocation = async (departureCity) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Provide a single travel destination wrapped in ** that is out of the country from the location: ",
        },
        {
          role: "user",
          content: departureCity,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0.8,
    });

    let response = completion.choices[0].message.content;
    console.log("response", response);
    response = response.match(/\*\*(.*?)\*\*/)[1];
    return response.trim();
  } catch (error) {
    console.error("Error generating abroad destination: ", error);
    return [];
  }
};

const inCountryLocation = async (departureCity) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Provide a single travel destination wrapped in ** that is in the same country as: ",
        },
        {
          role: "user",
          content: departureCity,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0.8,
    });

    let response = completion.choices[0].message.content;
    response = response.match(/\*\*(.*?)\*\*/)[1];
    return response.trim();
  } catch (error) {
    console.error("Error generating local destination: ", error);
    return [];
  }
};

const fetchLocationsForActivities = async (activities, destination) => {
  const locationPromises = activities.map(async (activity) => {
    const locations = await getLocationsFromGoogle(activity, destination);
    const selectedLocation =
      locations[Math.floor(Math.random() * locations.length)];

    if (selectedLocation) {
      return {
        location: selectedLocation.name,
        lat: selectedLocation.geometry.location.lat,
        lng: selectedLocation.geometry.location.lng,
      };
    } else {
      console.error(`Selected location is undefined for activity: ${activity}`);
      return null;
    }
  });

  return Promise.all(locationPromises);
};

const generateSurpriseItinerary = async (db, tripId, preferences) => {
  try {
    if (!preferences) {
      console.error("preferences are missing");
      return [];
    }

    const userPrompt = `
    Departure City: ${preferences.departureCity},
	  Destination: ${preferences.destination}
	  Budget: ${preferences.budget}, 
	  Duration: ${preferences.duration} days,
	  ambience: ${preferences.ambience},  
	  Number of Travelers: ${preferences.numberOfTravelers}, 
	  Theme: ${preferences.theme}.`;

    let activities;
    switch (preferences.theme) {
      case "romantic":
        activities = ROMANTIC_ACTIVITIES;
        break;
      case "party":
        activities = PARTY_ACTIVITIES;
        break;
      case "cultural":
        activities = CULTURAL_ACTIVITIES;
        break;
      case "relaxation":
        activities = RELAXATION_ACTIVITIES;
        break;
      default:
        console.error("Invalid theme");
        return [];
    }

    const randomActivities = activities
      .sort(() => 0.5 - Math.random())
      .slice(0, preferences.duration * 5);

    const locations = await fetchLocationsForActivities(
      randomActivities,
      preferences.destination
    );

    const flattenedLocations = locations.filter(Boolean);

    const itineraryPrompt = `Preferences: ${userPrompt} and locations: ${flattenedLocations
      .map((location) => `${location.location}`)
      .join("\n")}`;

    const detailedItineraryCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a travel agent who provides personalized activities for travelers based off of their trip preferences and provided locations:",
        },
        {
          role: "user",
          content: itineraryPrompt,
        },
      ],
      max_tokens: 2048,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0.8,
    });

    const detailedItinerary =
      detailedItineraryCompletion.choices[0]?.message?.content;
      console.log("detailedItinerary", detailedItinerary)

    if (!detailedItinerary) {
      throw new Error("GPT-3 did not return a valid itinerary.");
    }

    const updateDoc = {
      $set: {
        locations: flattenedLocations,
        detailedItinerary: detailedItinerary,
      },
    };

    await db
      .collection("trips")
      .updateOne({ _id: new ObjectId(tripId) }, updateDoc);

    return detailedItinerary;
  } catch (error) {
    console.error("An error occurred while generating the itinerary:", error);
    return null;
  }
};

module.exports = {
  generateSurpriseItinerary,
  abroadLocation,
  inCountryLocation,
};
