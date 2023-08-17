import PropTypes from "prop-types";
import * as Form from "@radix-ui/react-form";
import SimpleToast from "../../ui/Toast";
import { useState } from "react";

const Step2 = ({
  preferences,
  handleInputChange,
  handleNext,
  next,
  handleBack,
  back,
}) => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (preferences.prompt && preferences.prompt.length >= 100) {
      setShowToast(false);
      handleNext();
    } else {
      setShowToast(true);
    }
  };

  const remainingCharacters = 100 - (preferences.prompt?.length || 0);

  return (
    <>
      <SimpleToast
        title="Please enter a prompt with at least 100 characters"
        description="This will help us find the best trip for you"
        buttonText="Close"
        onButtonClick={() => setShowToast(false)}
        duration={3000}
        openState={showToast}
        setOpenState={setShowToast}
      />

      <div className="p-5 m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:w-full flex items-center max-sm:justify-center">
        <div onClick={handleBack} className="cursor-pointer mr-4">
          <img src={back} alt="back" className="w-[30px] h-[30px] max-w-none" />
        </div>
        <Form.Root onSubmit={handleSubmit}>
          <Form.Field name="prompt">
            <Form.Control asChild>
              <div className="relative box-border w-full">
                <div className="relative bg-[#7e7e7e] bg-opacity-80 ring-1 ring-white shadow-blackA9 inline-flex h-[55px] appearance-none items-center justify-between rounded-[14px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9">
                  <input
                    className="lg:w-[850px] sm:w-[500px] max-sm:w-full bg-transparent focus:outline-none text-xl "
                    type="text"
                    required
                    name="prompt"
                    value={preferences.prompt}
                    onChange={handleInputChange}
                    placeholder="Describe your perfect trip"
                    autoComplete="off"
                  />
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-lg text-mauve6">
                  {remainingCharacters > 0 ? `${remainingCharacters}` : ""}
                </div>
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

Step2.propTypes = {
  preferences: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  next: PropTypes.string.isRequired,
  handleBack: PropTypes.func.isRequired,
  back: PropTypes.string.isRequired,
};

export default Step2;
