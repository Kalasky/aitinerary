import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { API_URL } from "../../utils/constants";
import { useState } from "react";
import { Input, Box, Select, Button } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

function Steps({
  currentStep,
  setCurrentStep,
  preferences,
  setPreferences,
  handleSubmit,
}) {
  const navigate = useNavigate();
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
  const [displaySuggestions, setDisplaySuggestions] = useState(false);

  const handleChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value,
    });
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const handleCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );
      const data = await response.json();
      console.log(data);

      if (data.results && data.results.length > 0) {
        const city = data.results[0].formatted_address;
        setPreferences((prev) => ({ ...prev, departureCity: city }));
      }
    });
  };

  const autoComplete = async (inputValue) => {
    try {
      const response = await fetch(`${API_URL}/map/autocomplete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleInputChange = async (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "departureCity") {
      if (event.target.value.trim() !== "") {
        const autoCompleteSuggestions = await autoComplete(event.target.value);
        setAutoCompleteSuggestions(autoCompleteSuggestions);
      }
    }

    if (autoCompleteSuggestions.length > 0) {
      setDisplaySuggestions(true);
    }

    if (event.target.value.trim() === "") {
      setDisplaySuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setPreferences({
      ...preferences,
      departureCity: suggestion.description,
    });
    setDisplaySuggestions(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <Button onClick={handleCurrentLocation} backgroundColor="none">
              <Search2Icon color="blue.500" /> Use Current Location
            </Button>
            <label>
              Departure City:
              <Input
                type="text"
                name="departureCity"
                value={preferences.departureCity}
                onChange={handleInputChange}
                required
                placeholder="Departure City"
              />
              {displaySuggestions && (
                <Box
                  position="absolute"
                  zIndex="1"
                  width="100%"
                  backgroundColor="gray.400"
                  border="1px solid #ccc"
                  borderRadius="10px"
                >
                  {autoCompleteSuggestions?.map((suggestion) => (
                    <Box
                      key={suggestion.place_id}
                      padding="5px"
                      cursor="pointer"
                      _hover={{ backgroundColor: "gray.300" }}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion.description}
                    </Box>
                  ))}
                </Box>
              )}
            </label>
          </div>
        );
      case 2:
        return (
          <div>
            <label>
              Destination:
              <Select
                type="text"
                name="destination"
                value={preferences.destination}
                onChange={handleChange}
                required
              >
                <option value="abroad">Abroad</option>
                <option value="local">In My Country</option>
              </Select>
            </label>
          </div>
        );

      case 3:
        return (
          <div>
            <label>
              Budget:
              <input
                type="text"
                name="budget"
                value={preferences.budget}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );

      case 4:
        return (
          <div>
            <label>
              Duration:
              <input
                type="text"
                name="duration"
                value={preferences.duration}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      case 5:
        return (
          <div>
            <label>
              Landscapes:
              <input
                type="text"
                name="landscapes"
                value={preferences.landscapes}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      case 6:
        return (
          <div>
            <label>
              Number of People:
              <input
                type="text"
                name="numberOfPeople"
                value={preferences.numberOfPeople}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      case 7:
        return (
          <div>
            <label>
              Theme:
              <input
                type="text"
                name="theme"
                value={preferences.theme}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}
      <button onClick={handleBack}>Back</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Steps;

Steps.propTypes = {
  currentStep: PropTypes.number.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  preferences: PropTypes.object.isRequired,
  setPreferences: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
