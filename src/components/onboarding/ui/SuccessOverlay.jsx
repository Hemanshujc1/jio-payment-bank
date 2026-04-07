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
    <div className="fixed inset-0 bg-[#302F2D]/95 flex flex-col gap-20 items-center justify-center z-50 animate-in fade-in duration-300">
      <h1
        className="text-[#36B34A] text-4xl md:text-5xl font-black tracking-widest text-center drop-shadow-2xl"
        style={{ textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
      >
        CONGRATULATIONS!
      </h1>

      <div>
        <img src={verification} alt="verification" />
      </div>

      <div className="flex flex-col gap-1 items-center text-center px-6 py-4 rounded-xl border border-white/5 bg-black/10">
        <p className="text-white text-[19px] md:text-[21px] font-bold tracking-wide drop-shadow-sm">
          Your application is submitted successfully..!
        </p>
        <p className="text-white text-[19px] md:text-[21px] font-bold tracking-wide mt-1 drop-shadow-sm">
          Application ID: XXXXXXXXXXXXXXX
        </p>
      </div>
    </div>
  );
};

export default SuccessOverlay;