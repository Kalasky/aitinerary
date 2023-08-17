import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RenderSurpriseSteps from "./RenderSurpriseSteps";
import { API_URL } from "../../utils/constants";

function SurpriseForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    departureCity: "",
    destination: "",
    budget: "",
    duration: "",
    ambience: "",
    numberOfTravelers: "",
    theme: "",
  });

  const createTrip = async () => {
    try {
      const response = await fetch(`${API_URL}/trip/addSurpriseTrip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      return data.tripId;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const tripId = await createTrip();
    if (!tripId) {
      return;
    }

    navigate(`/trip/${tripId}/${preferences.duration}`);
  };

  return (
    <RenderSurpriseSteps
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      preferences={preferences}
      setPreferences={setPreferences}
      handleSubmit={handleSubmit}
    />
  );
}

export default SurpriseForm;
