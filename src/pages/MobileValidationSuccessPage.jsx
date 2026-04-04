import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProceedButton from '../components/ProceedButton'
import ValidationIcon from "../assets/ValidationIcon.png"

const MobileValidationSuccessPage = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/aadhaar-details');
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4 md:px-0 font-sans">
      
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-8 tracking-wide text-center">
        Mobile Number Validation*
      </h2>
      
      <div className="w-64 h-64 md:w-72 md:h-72 mx-auto border-4 border-green-500 rounded-full flex items-center justify-center mb-6 overflow-hidden bg-white/50 relative shadow-inner">
        <img 
          src={ValidationIcon} 
          alt="Validation Icon Placeholder" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-3xl font-extrabold text-center mb-4 tracking-wider">
        100%
      </div>

      <div className="h-4 bg-[#EAB875] rounded-full mx-auto w-72 md:w-96 mb-6 shadow-sm">
        <div className="h-full bg-[#EAB875] rounded-full w-full"></div>
      </div>

      <p className="text-center font-medium md:text-lg mb-8 text-gray-900 tracking-wide">
        Data has been captured Successfully.
      </p>

      {/* Checkbox */}
      <div className="flex items-start justify-center mb-16 gap-3 max-w-md mx-auto">
        <input 
          type="checkbox" 
          id="confirm-non-aadhaar" 
          className="mt-1 w-5 h-5 accent-black border-gray-400 rounded cursor-pointer shrink-0"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
        />
        <label 
          htmlFor="confirm-non-aadhaar" 
          className="text-sm md:text-base font-medium cursor-pointer text-gray-900 leading-tight"
        >
          I confirm that i am using my Non-Aadhaar Mobile Number to open the account
        </label>
      </div>

      {/* Proceed Button */}
      <ProceedButton 
        onClick={handleProceed}
        disabled={!isConfirmed}
        className="w-full max-w-xs mb-8"
      />

    </div>
  );
};

export default MobileValidationSuccessPage;
