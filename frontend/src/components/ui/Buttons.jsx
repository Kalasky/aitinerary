import PropTypes from "prop-types";
import { useState } from "react";

const buttonClass = `button-text btn-hover max-sm:mt-4 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`;

const useFocusRing = () => {
  const [focusRing, setFocusRing] = useState(false);

  const onFocus = () => {
    setFocusRing(true);
    setTimeout(() => {
      setFocusRing(false);
    }, 500);
  };

  const onBlur = () => {
    setFocusRing(false);
  };

  return {
    onFocus,
    onBlur,
    focusRingClass: focusRing ? "focus-ring" : "focus-ring-hide",
  };
};

export const GlowDarkPrimary = ({ onClick, children, styling }) => {
  const { onFocus, onBlur, focusRingClass } = useFocusRing();

  return (
    <button
      className={`${buttonClass} glow-btn-padding color-dark m-auto ${styling} ${focusRingClass}`}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
};

export const GlowBluePrimary = ({ onClick, children, styling }) => {
  const { onFocus, onBlur, focusRingClass } = useFocusRing();

  return (
    <button
      className={`${buttonClass} color-blue m-auto ${styling} ${focusRingClass}`}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
};

export const GlowLightPrimary = ({ onClick, children, styling }) => {
  const { onFocus, onBlur, focusRingClass } = useFocusRing();

  return (
    <button
      className={`${buttonClass} color-light m-auto ${styling} ${focusRingClass}`}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
};

GlowDarkPrimary.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  padding: PropTypes.string,
  margin: PropTypes.string,
  styling: PropTypes.string,
};

GlowLightPrimary.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  padding: PropTypes.string,
  margin: PropTypes.string,
  styling: PropTypes.string,
};

GlowBluePrimary.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  padding: PropTypes.string,
  margin: PropTypes.string,
  styling: PropTypes.string,
};
