import PropTypes from "prop-types";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import plane from "../assets/loading_plane.svg";
import drinkIcon from "../assets/drinkIcon.svg";
import foodIcon from "../assets/foodIcon.svg";
import burgerIcon from "../assets/burgerIcon.svg";

const LoadingTrip = ({ destination }) => {
  const [stopImageOne, setStopImageOne] = useState("");
  const [stopImageTwo, setStopImageTwo] = useState("");
  const [stopImageThree, setStopImageThree] = useState("");
  const generating = "GENERATING";
  const destinationProp = destination
    ? `${destination}`
    : "Creating your adventure...";

  const generatingSentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        repeat: Infinity,
        repeatType: "restart",
        repeatDelay: 0.5,
      },
    },
  };

  const generatingLetter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        yoyo: 5,
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
    exit: { opacity: 0 },
  };

  const controls = useAnimation();
  const lineControls = useAnimation();
  const stopControlsOne = useAnimation();
  const stopControlsTwo = useAnimation();
  const stopControlsThree = useAnimation();
  const pausePoints = useMemo(() => [0, 25, 50, 75, 100], []);

  const combinedVariants = {
    initial: { plane: { x: "0%" }, line: { width: "0%" } },
    animate: pausePoints.map((point) => ({
      plane: { x: `${point}vw` },
      line: { width: `${point}%` },
    })),
  };

  const stopImageVariants = {
    hidden: { opacity: 0 },
    fadeIn: { opacity: 1, transition: { duration: 1, ease: "easeIn" } },
    fadeOut: { opacity: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      for (const [index] of pausePoints.entries()) {
        if (!isMounted) return;

        await Promise.all([
          controls.start(combinedVariants.animate[index].plane),
          lineControls.start(combinedVariants.animate[index].line),
        ]);

        if (index === 0) {
          stopControlsOne.start("hidden");
          stopControlsTwo.start("hidden");
          stopControlsThree.start("hidden");
        }

        const x = combinedVariants.animate[index].plane.x;
        const xVal = parseInt(x, 10);

        if (xVal === 25) {
          setStopImageOne(drinkIcon);
          stopControlsOne.start("fadeIn");
        } else if (xVal === 50) {
          setStopImageTwo(foodIcon);
          stopControlsTwo.start("fadeIn");
          stopControlsOne.start("fadeOut");
        } else if (xVal === 75) {
          setStopImageThree(burgerIcon);
          stopControlsThree.start("fadeIn");
          stopControlsTwo.start("fadeOut");
        }

        await new Promise((r) => setTimeout(r, 350));
      }

      controls.start(combinedVariants.initial.plane);
      lineControls.start(combinedVariants.initial.line);
      setStopImageOne("");
      setStopImageTwo("");
      setStopImageThree("");

      if (isMounted) {
        setTimeout(sequence, 1000);
      }
    };

    sequence();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div>
      <motion.div className="m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:w-full flex items-center max-sm:justify-center">
        <div className="hero-text-container">
          <motion.div
            className="hero-item sm"
            variants={generatingSentence}
            initial="hidden"
            animate="visible"
          >
            {destinationProp.split("").map((char, index) => (
              <motion.span key={char + "-" + index} variants={generatingLetter}>
                {char}
              </motion.span>
            ))}
          </motion.div>
          <motion.div
            className="hero-item sm"
            variants={generatingSentence}
            initial="hidden"
            animate="visible"
          >
            {generating.split("").map((char, index) => (
              <motion.span key={char + "-" + index} variants={generatingLetter}>
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <motion.img
        src={plane}
        className="moving-image"
        style={{
          position: "absolute",
          top: "90%",
          left: "0%",
          transform: "translateY(-50%)",
        }}
        variants={combinedVariants}
        initial="initial"
        animate={controls}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "94%",
          left: "0%",
          height: "2px",
          width: "100vw",
          background:
            "repeating-linear-gradient(to right, #fff, #fff 5px, transparent 2px, transparent 14px)",
        }}
        variants={combinedVariants}
        initial="initial"
        animate={lineControls}
      />
      <motion.img
        src={stopImageOne}
        className="moving-image"
        style={{
          position: "absolute",
          top: "94%",
          left: "25%",
          transform: "translateY(-50%)",
        }}
        variants={stopImageVariants}
        initial="hidden"
        animate={stopControlsOne}
      />
      <motion.img
        src={stopImageTwo}
        className="moving-image"
        style={{
          position: "absolute",
          top: "94%",
          left: "50%",
          transform: "translateY(-50%)",
        }}
        variants={stopImageVariants}
        initial="hidden"
        animate={stopControlsTwo}
      />
      <motion.img
        src={stopImageThree}
        className="moving-image"
        style={{
          position: "absolute",
          top: "94%",
          left: "75%",
          transform: "translateY(-50%)",
        }}
        variants={stopImageVariants}
        initial="hidden"
        animate={stopControlsThree}
      />
    </motion.div>
  );
};

export default LoadingTrip;

LoadingTrip.propTypes = {
  destination: PropTypes.string.isRequired,
};
