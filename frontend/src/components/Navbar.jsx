import main_logo from "../assets/main_logo.svg";
import plane_logo_white from "../assets/plane_logo_white.svg";
import beta_badge from "../assets/beta_badge.svg";
import { GlowDarkPrimary, GlowBluePrimary } from "./ui/Buttons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 z-[9999] mb-[2rem] ${
        isSticky ? "glass-overlay bg-transparent" : "bg-transparent"
      }`}
    >
      <div className="max-sm:container mx-auto sm:py-8 flex justify-between items-center sm:px-14">
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center"
        >
          <img
            className="h-8 w-auto sm:h-10 max-sm:hidden"
            src={main_logo}
            alt="Logo"
          />{" "}
          <img
            className="w-auto max-sm:mt-4 sm:hidden ml-2"
            src={plane_logo_white}
            alt="Logo"
          />
          <img
            className="w-auto max-sm:mt-4 sm:hidden ml-2"
            src={beta_badge}
            alt="Logo"
          />
          <img
            className="w-auto max-sm:mt-4 max-sm:hidden ml-2"
            src={beta_badge}
            alt="Logo"
          />
        </Link>
        <div className="flex space-x-4">
          <GlowDarkPrimary styling={"px-4 py-2 rounded-3xl w-auto"}>
            About aitinerary
          </GlowDarkPrimary>
          <GlowBluePrimary styling={"px-4 py-2 rounded-3xl w-auto"}>
            Whitelist
          </GlowBluePrimary>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
