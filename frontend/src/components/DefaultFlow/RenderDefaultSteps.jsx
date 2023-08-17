import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../utils/constants";
import { useState, useEffect } from "react";
import back from "../../assets/back.svg";
import next from "../../assets/next.svg";
import arrowTopRight from "../../assets/arrowTopRight.svg";
import currentLocation from "../../assets/currentLocation.svg";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";

// pexel default urls
import venice_sunset from "../../assets/pexelDefaults/venice_sunset.jpeg";
import sunset from "../../assets/pexelDefaults/sunset.webp";
import croatia from "../../assets/pexelDefaults/croatia.jpeg";
import downtown_area from "../../assets/pexelDefaults/downtown_area.jpeg";
import france from "../../assets/pexelDefaults/france.jpeg";
import germany from "../../assets/pexelDefaults/germany.jpeg";
import hollywood from "../../assets/pexelDefaults/hollywood.jpeg";
import night_lights_city from "../../assets/pexelDefaults/night_lights_city.jpeg";
import norway from "../../assets/pexelDefaults/norway.jpeg";
import singapore from "../../assets/pexelDefaults/singapore.jpeg";

function RenderDefaultSteps({
  currentStep,
  setCurrentStep,
  preferences,
  setPreferences,
  handleSubmit,
}) {
  const navigate = useNavigate();
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const defaultPexelUrls = [
    venice_sunset,
    sunset,
    croatia,
    downtown_area,
    france,
    germany,
    hollywood,
    night_lights_city,
    norway,
    singapore,
  ];
  const [pexelsUrl, setPexelsUrl] = useState(
    defaultPexelUrls[Math.floor(Math.random() * defaultPexelUrls.length)]
  );

  useEffect(() => {
    async function fetchAndSetPexelsUrl() {
      try {
        if (preferences.destination.trim() !== "") {
          const url = await getPexelsUrl(preferences.destination);
          setPexelsUrl(url);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAndSetPexelsUrl();
  }, [preferences.destination]);

  const handleNext = () => {
    if (currentStep < 2) {
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

  const handleDestinationChange = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const city = data.results[0].formatted_address;
          const url = await getPexelsUrl(city);
          setPexelsUrl(url);

          setPreferences((prev) => ({ ...prev, destination: city }));
        }
      } catch (error) {
        console.error(error);
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

  const getPexelsUrl = async (destination) => {
    try {
      const response = await fetch(`${API_URL}/trip/pexelsUrl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        console.error(message);
        return;
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = async (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "destinationCity") {
      if (event.target.value.trim() !== "") {
        const autoCompleteSuggestions = await autoComplete(event.target.value);
        setAutoCompleteSuggestions(autoCompleteSuggestions);

        if (autoCompleteSuggestions.length > 0) {
          const destination = autoCompleteSuggestions[0].description;

          setPexelsUrl(await getPexelsUrl(destination));
        }
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
      destinationCity: suggestion.description,
    });
    setDisplaySuggestions(false);
  };

  const variants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 100 : -100,
    }),
  };

  const renderStep = () => (
    <AnimatePresence initial={false} custom={currentStep}>
      <motion.div
        key={currentStep}
        custom={currentStep}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="m-auto absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:w-full flex items-center max-sm:justify-center"
      >
        {currentStep === 1 && (
          <Step1
            preferences={preferences}
            handleInputChange={handleInputChange}
            handleDestination={handleDestinationChange}
            displaySuggestions={displaySuggestions}
            autoCompleteSuggestions={autoCompleteSuggestions}
            handleSelectSuggestion={handleSelectSuggestion}
            handleNext={handleNext}
            next={next}
            arrowTopRight={arrowTopRight}
            currentLocation={currentLocation}
          />
        )}
        {currentStep === 2 && (
          <Step2
            preferences={preferences}
            handleInputChange={handleInputChange}
            handleBack={handleBack}
            handleNext={handleNext}
            back={back}
            next={next}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="overflow-hidden items-center justify-center flex">
      {pexelsUrl && (
        <>
          <img
            src={pexelsUrl}
            alt="background"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <svg
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "black", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "white", stopOpacity: 1 }}
                />
              </linearGradient>
              <mask id="mask1" maskUnits="objectBoundingBox">
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#grad1)"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              style={{ fill: "#333333", mask: "url(#mask1)" }}
            />
          </svg>
        </>
      )}
      <div className="hero-text-container">
        <div className="hero-item sm">Plan Your Trips</div>
        <div className="hero-item sm">in seconds</div>
        <div className="hero-item sm last-item">
          <span className="font-bold">With </span>
          <span className="font-bold bg-gradient-to-r from-[#A2D2FF] to-white inline-block text-transparent bg-clip-text">
            Ai Magic
          </span>
        </div>
      </div>

      {renderStep()}
    </div>
  );
}

export default RenderDefaultSteps;

RenderDefaultSteps.propTypes = {
  currentStep: PropTypes.number.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  preferences: PropTypes.object.isRequired,
  setPreferences: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
