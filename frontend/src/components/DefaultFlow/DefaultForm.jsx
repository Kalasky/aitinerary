import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RenderDefaultSteps from "./RenderDefaultSteps";
import { API_URL } from "../../utils/constants";

function DefaultForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    destination: "",
    duration: "2",
    prompt: "",
  });

  const createTrip = async () => {
    try {
      const response = await fetch(`${API_URL}/trip/addDefaultTrip`, {
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
    <RenderDefaultSteps
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      preferences={preferences}
      setPreferences={setPreferences}
      handleSubmit={handleSubmit}
    />
  );
}

export default DefaultForm;
