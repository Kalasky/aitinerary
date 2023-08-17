import * as AlertDialog from "@radix-ui/react-alert-dialog";
import PropTypes from "prop-types";
import { Cross1Icon } from "@radix-ui/react-icons";

const SimpleAlertDialog = ({
  title,
  titleStyling,
  description,
  descriptionStyling,
  mainButtonText,
  mainButtonStyling,
  closeButton,
  closeButtonStyling,
  actionButton,
  actionButtonStyling,
  alertStyling,
  svgIcon,
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button
        className={`${mainButtonStyling} btn-global text-white hover:bg-mauve3 shadow-blackA7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white bg-opacity-[30%] px-[15px] font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-none`}
      >
        {mainButtonText}
      </button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="glass-overlay data-[state=open]:animate-overlayShow fixed inset-0 z-[200]" />
      <AlertDialog.Content
        className={`${alertStyling} z-[500] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[70vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] p-[25px] shadow-md focus:outline-none flex flex-col items-center`}
      >
        <div className="relative w-full">
          {svgIcon && (
            <div className="absolute top-[-80px] left-0 w-full flex justify-center">
              <div className="-mt-4">{svgIcon}</div>
            </div>
          )}
          <AlertDialog.Cancel asChild>
            <button className="absolute top-[-40px] right-[-40px] w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <Cross1Icon className="w-4 h-4 text-black" />
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Title
            className={`${titleStyling} text-mauve12 m-0 text-[17px] max-sm:text-[1rem]`}
          >
            {title}
          </AlertDialog.Title>
        </div>
        <AlertDialog.Description className={`${descriptionStyling} w-full`}>
          {description}
        </AlertDialog.Description>
        <div className="flex justify-end gap-[25px]">
          {closeButton && (
            <AlertDialog.Cancel asChild>
              <button
                className={`${closeButtonStyling} text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-none`}
              >
                {closeButton}
              </button>
            </AlertDialog.Cancel>
          )}
          {actionButton && (
            <AlertDialog.Action asChild>
              <button
                className={`${actionButtonStyling} text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-none`}
              >
                {actionButton}
              </button>
            </AlertDialog.Action>
          )}
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default SimpleAlertDialog;

SimpleAlertDialog.propTypes = {
  mainButtonText: PropTypes.string.isRequired,
  mainButtonStyling: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  actionButton: PropTypes.string,
  closeButton: PropTypes.string,
  actionButtonStyling: PropTypes.string,
  closeButtonStyling: PropTypes.string,
  titleStyling: PropTypes.string,
  descriptionStyling: PropTypes.string,
  alertStyling: PropTypes.string,
  svgIcon: PropTypes.element,
};
