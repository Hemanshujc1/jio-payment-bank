import React from "react";
import jio from "../../assets/jio.svg";
import vakrangeelogo from "../../assets/vakrangee.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full min-h-16 sm:min-h-20 py-2 sm:py-0 bg-white flex flex-col sm:flex-row justify-center sm:justify-between items-center px-2 sm:px-6 md:px-12 shadow-md shrink-0 border-b border-neutral-light gap-2 sm:gap-0">
      <Link to="/" className="w-full sm:w-auto flex justify-center sm:justify-start shrink-0">
        <div className="flex items-center h-full gap-3 sm:gap-4">
          <img src={jio} alt="jio logo" className="h-8 sm:h-10 w-auto shrink-0" />
          <div className="h-6 sm:h-8 w-px bg-neutral-light shrink-0"></div>
          <img
            src={vakrangeelogo}
            alt="vakrangee logo"
            className="h-8 sm:h-10 w-auto shrink-0"
          />
        </div>
      </Link>

      <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end shrink-0">
        <span className="font-bold text-black text-xs sm:text-sm md:text-base text-center whitespace-nowrap">Username - VL0000000</span>
      </div>
    </nav>
  );
};

export default Navbar;
