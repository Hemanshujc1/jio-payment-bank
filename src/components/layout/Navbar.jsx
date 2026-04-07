import React from "react";
import jio from "../../assets/jio.svg";
import vakrangeelogo from "../../assets/vakrangee.svg";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="w-full h-20 bg-white flex justify-between items-center px-6 md:px-12 shadow-md shrink-0 border-b border-neutral-light">
      <Link to="/">
        <div className="flex items-center h-full gap-4">
          <img src={jio} alt="jio logo" className="h-10 w-auto" />
          <div className="h-8 w-px bg-neutral-light"></div>
          <img
            src={vakrangeelogo}
            alt="vakrangee logo"
            className="h-10 w-auto"
          />
        </div>
      </Link>

      <div>
        <span className="font-bold text-black">Username - VL0000000</span>
      </div>
    </nav>
  );
};

export default Navbar;
