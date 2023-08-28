const { Configuration, OpenAIApi } = require("openai");
const { ObjectId } = require("mongodb");
const { getLocationsFromGoogle } = require("../utils/googleMapsApi");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const abroadLocation = async (departureCity) => {
  try {
    const completion = await openai.createChatCompletion({
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

    let response = completion.data.choices[0].message.content;
    response = response.match(/\*\*(.*?)\*\*/)[1];
    return response.trim();
  } catch (error) {
    console.error("Error generating abroad destination: ", error);
    return [];
  }
};

const inCountryLocation = async (departureCity) => {
  try {
    const completion = await openai.createChatCompletion({
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

    let response = completion.data.choices[0].message.content;
    response = response.match(/\*\*(.*?)\*\*/)[1];
    return response.trim();
  } catch (error) {
    console.error("Error generating local destination: ", error);
    return [];
  }
};

const generateSurpriseItinerary = async (db, tripId, preferences) => {
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

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Make a trip itinerary with 5 activities max for each day. You must always include a type of activity surrounded by **. You must always provide 5 activities surrounded by **. Activities must be things like: **Gelato**, **ancient ruins**, **art museum**, and much more. Do it based on the following preferences:",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    max_tokens: 2048,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0.8,
    presence_penalty: 0.8,
  });

  if (!completion.data.choices || !completion.data.choices[0].message.content) {
    console.error(
      "Unexpected completion data from OpenAI",
      completion.data.choices[0].message.content
    );
    return [];
  }

  const itineraryText = completion.data.choices[0].message.content;

  const itineraryPromises = itineraryText
    .split("\n\n")
    .filter((dayText) => dayText.startsWith("Day "))
    .map(async (day) => {
      const dayNumber = day.split("\n")[0];
      const activities = day.split("\n").slice(1);

      const fetchLocations = activities.map(async (activity) => {
        const match = activity.match(/\*\*(.*?)\*\*/);
        if (match) {
          const locations = await getLocationsFromGoogle(
            match[1],
            preferences.destination
          );

          const selectedLocation =
            locations[Math.floor(Math.random() * locations.length)];

          if (selectedLocation) {
            return {
              location: selectedLocation.name,
              lat: selectedLocation.geometry.location.lat,
              lng: selectedLocation.geometry.location.lng,
            };
          } else {
            console.error("Selected location is undefined");
            return null;
          }
        }
        return null;
      });

      const locations = await Promise.all(fetchLocations);

      const itineraryPrompt = `The following are the selected activities and their locations for ${dayNumber.replace(
        ":",
        ""
      )}:
      ${locations
        .map((location, index) =>
          location
            ? `${activities[index]}: ${location.name}`
            : `${activities[index]}: Location not found.`
        )
        .join("\n")}
      `;

      const detailedItineraryCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Provide a detailed itinerary with time frames based on the following selected activities and their locations.",
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
        detailedItineraryCompletion.data.choices[0]?.message?.content;

      // filter out nulls (activities without a location)
      return {
        day: dayNumber.replace(":", ""),
        locations: locations.filter((location) => location),
        detailedItinerary:
          detailedItinerary || "Detailed itinerary not available.",
      };
    });

  const completedItinerary = await Promise.all(itineraryPromises);

  const updateDoc = {
    $set: {
      itinerary: itineraryText,
      detailedItinerary: completedItinerary,
    },
  };

  await db
    .collection("trips")
    .updateOne({ _id: new ObjectId(tripId) }, updateDoc);

  return completedItinerary;
};

module.exports = {
  generateSurpriseItinerary,
  abroadLocation,
  inCountryLocation,
};
