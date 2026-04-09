import React from "react";
import footerimg from "../../assets/footerimg.svg";

const Footer = () => {
  return (
    <footer className="w-full bg-[white] flex flex-col items-center overflow-hidden">
      {/* Top Divider */}
      <div className="w-full h-1 bg-sand-350" />

      {/* Image Section (Dominant) */}
      <div className="w-full flex justify-center py-2 sm:py-3 [@media(max-height:700px)]:py-1 [@media(max-height:700px)]:sm:py-2">
        <img
          src={footerimg}
          alt="Footer Details"
          className="w-full h-10 sm:h-14 md:h-18 lg:h-20 [@media(max-height:700px)]:h-10 [@media(max-height:700px)]:sm:h-12 [@media(max-height:700px)]:md:h-14 [@media(max-height:700px)]:lg:h-16 object-cover object-center"
        />
      </div>

      {/* Divider */}
      <div className="w-[90%] border-t border-gray-100"></div>

      {/* Text Section (Small) */}
      <div className="w-full px-4 py-2 sm:py-3 [@media(max-height:700px)]:py-1 [@media(max-height:700px)]:sm:py-1.5 flex justify-center">
        <p
          className="text-[9px] sm:text-[10px] md:text-[11px] 
                      text-gray-400 text-center leading-relaxed"
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
