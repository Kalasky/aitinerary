import PropTypes from "prop-types";
import * as Form from "@radix-ui/react-form";
import SimpleToast from "../../ui/Toast";
import { useState } from "react";
import { Link } from "react-router-dom";

const Step1 = ({
  preferences,
  handleInputChange,
  handleCurrentLocation,
  displaySuggestions,
  autoCompleteSuggestions,
  handleSelectSuggestion,
  handleNext,
  currentLocation,
  next,
  arrowTopRight,
}) => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (preferences.departureCity) {
      setShowToast(false);
      handleNext();
    } else {
      setShowToast(true);
    }
  };

  return (
    <>
      <SimpleToast
        title="Please enter a departure city"
        description="For example: Paris, France or Siciy, Italy"
        buttonText="Close"
        onButtonClick={() => setShowToast(false)}
        duration={3000}
        openState={showToast}
        setOpenState={setShowToast}
      />

      <div className="p-5 m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:w-full flex items-center max-sm:justify-center">
        <div className="buttons-container">
          <Link to="/default">
            <button className="bg-slate-700 rounded-md p-2">Default</button>
          </Link>
          <Link to="/surprise">
            <button className="bg-slate-700 rounded-md p-2">Surprise Me</button>
          </Link>
        </div>
        <Form.Root onSubmit={handleSubmit}>
          <Form.Field name="departureCity">
            <Form.Control asChild>
              <div className="relative box-border w-full">
                <div className="relative bg-[#7e7e7e] bg-opacity-80 ring-1 ring-white shadow-blackA9 inline-flex h-[55px] appearance-none items-center justify-between rounded-[14px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9">
                  <input
                    className="lg:w-[850px] sm:w-[500px] max-sm:w-full bg-transparent focus:outline-none text-xl "
                    type="text"
                    required
                    name="departureCity"
                    value={preferences.departureCity}
                    onChange={handleInputChange}
                    placeholder="Departure City"
                    autoComplete="off"
                  />
                  <div
                    onClick={handleCurrentLocation}
                    className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2"
                  >
                    <img
                      src={currentLocation}
                      alt="current location"
                      className="w-[30px] h-[30px] max-w-none"
                    />
                  </div>
                </div>
                {displaySuggestions && (
                  <div className="absolute top-full z-10 w-full bg-[#9c9c9c] bg-opacity-80 border-[1px] border-gray-400 rounded-[14px] px-4 py-4 mt-4 text-base">
                    {autoCompleteSuggestions?.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="flex justify-between p-[5px] cursor-pointer hover:bg-gray-300 hover:bg-opacity-30 rounded-[8px]"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <span>{suggestion.description}</span>
                        <img src={arrowTopRight} alt="Arrow Top Right" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Control>
          </Form.Field>
        </Form.Root>
        <div onClick={handleSubmit} className="cursor-pointer ml-4">
          <img src={next} alt="next" className="w-[30px] h-[30px] max-w-none" />
        </div>
      </div>
    </>
  );
};

Step1.propTypes = {
  preferences: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleCurrentLocation: PropTypes.func.isRequired,
  displaySuggestions: PropTypes.bool.isRequired,
  autoCompleteSuggestions: PropTypes.array.isRequired,
  handleSelectSuggestion: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  currentLocation: PropTypes.string.isRequired,
  next: PropTypes.string.isRequired,
  arrowTopRight: PropTypes.string.isRequired,
};

export default Step1;
