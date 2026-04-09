import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import verification from '../../../assets/verification.gif';

const SuccessOverlay = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); 
    }, 3000); 

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#302F2D]/98 flex flex-col gap-10 sm:gap-14 md:gap-20 items-center justify-center z-50 animate-in fade-in duration-500 p-4">
      <h1
        className="text-[#36B34A] text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] text-center drop-shadow-2xl animate-in zoom-in-50 duration-500"
        style={{ textShadow: "0 4px 15px rgba(0,0,0,0.6)" }}
      >
        CONGRATULATIONS!
      </h1>

      <div className="w-48 sm:w-64 md:w-80 animate-in zoom-in-75 duration-700 delay-100">
        <img src={verification} alt="verification" className="w-full h-auto drop-shadow-2xl" />
      </div>

      <div className="flex flex-col gap-3 items-center text-center px-6 py-6 sm:py-8 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom-10 duration-700 delay-200">
        <p className="text-white text-[16px] sm:text-[19px] md:text-[21px] font-bold tracking-wide drop-shadow-sm leading-relaxed">
          Your application is submitted successfully!
        </p>
        <div className="h-px w-12 bg-white/20 my-1"></div>
        <p className="text-white text-[15px] sm:text-[18px] md:text-[20px] font-bold tracking-wide mt-1 drop-shadow-sm opacity-90">
          Application ID: <span className="text-[#36B34A]">XXXXXXXXXXXXXXX</span>
        </p>
      </div>
    </div>
  );
};

export default SuccessOverlay;