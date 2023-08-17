import PropTypes from "prop-types";
import { useState } from "react";
import SimpleToast from "../../ui/Toast";

const Step5 = ({
  preferences,
  handleSelectChange,
  handleBack,
  handleNext,
  back,
  next,
  THEME_OPTIONS,
  arrowTopRight,
}) => {
  const [isDropdownOpen] = useState(true);
  const selectedOption = THEME_OPTIONS.find(
    (option) => option.value === preferences.theme
  ) || { label: "Select trip theme" };

  const handleThemeChange = (value) => {
    handleSelectChange("theme", value);
  };

  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    if (preferences.theme) {
      setShowToast(false);
      handleNext();
    } else {
      setShowToast(true);
    }
  };

  return (
    <>
      <SimpleToast
        title="Please choose a theme type"
        description="What kind of trip do you want?"
        buttonText="Close"
        onButtonClick={() => setShowToast(false)}
        duration={3000}
        openState={showToast}
        setOpenState={setShowToast}
      />
      <div className="m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:w-full flex items-center max-sm:justify-center">
        <div onClick={handleBack} className="cursor-pointer mr-4">
          <img src={back} alt="back" className="w-[30px] h-[30px] max-w-none" />
        </div>
        <div className="relative box-border w-full">
          <div className="mb-4 relative top-full z-10 w-full bg-[#7e7e7e] inline-flex bg-opacity-80 ring-1 ring-white shadow-blackA9 border-[1px] border-gray-400 rounded-[14px] px-4 py-4 mt-4 text-base appearance-none justify-between text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9">
            <span className="lg:w-[850px] sm:w-[500px] max-sm:w-full bg-transparent focus:outline-none text-xl ">
              {selectedOption.label}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full z-10 w-full bg-[#9c9c9c] bg-opacity-80 border-[1px] border-gray-400 rounded-[14px] px-4 py-4 text-base">
              {THEME_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex justify-between p-[5px] cursor-pointer hover:bg-gray-300 hover:bg-opacity-30 rounded-[8px]"
                  onClick={() => handleThemeChange(option.value)}
                >
                  <span>{option.label}</span>
                  <img src={arrowTopRight} alt="Arrow Top Right" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div onClick={handleClick} className="cursor-pointer ml-4">
          <img src={next} alt="next" className="w-[30px] h-[30px] max-w-none" />
        </div>
      </div>
    </>
  );
};

Step5.propTypes = {
  preferences: PropTypes.object.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  back: PropTypes.string.isRequired,
  next: PropTypes.string.isRequired,
  THEME_OPTIONS: PropTypes.array.isRequired,
  arrowTopRight: PropTypes.string.isRequired,
};

export default Step5;
