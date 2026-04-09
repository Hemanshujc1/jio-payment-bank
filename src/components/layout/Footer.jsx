import React from "react";
import footerimg from "../../assets/footerimg.svg";

const Footer = () => {
  return (
    <footer className="w-full bg-[white] flex flex-col items-center overflow-hidden">
      {/* Top Divider */}
      <div className="w-full h-[4px] bg-[#EBC080]" />

      {/* Image Section (Dominant) */}
      <div className="w-full flex justify-center py-2 sm:py-4">
        <img
          src={footerimg}
          alt="Footer Details"
          className="w-full h-16 sm:h-20 md:h-24 object-cover object-center"
        />
      </div>

      {/* Divider */}
      <div className="w-full sm:w-[90%] border-t border-gray-300"></div>

      {/* Text Section (Small) */}
      <div className="w-full px-2 py-2 sm:py-4 flex justify-center">
        <p
          className="text-[8px] sm:text-[10px] md:text-[11px] 
                      text-gray-500 text-center leading-snug"
        >
          &copy; 2026 Vakrangee Limited & Jio Payments Bank.{" "}
          <br className="sm:hidden" />
          <span className="font-medium sm:ml-1">All Rights Reserved</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
