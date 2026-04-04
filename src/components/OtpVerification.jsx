import React, { useState, useRef } from 'react';
import mobileotpicon from "../assets/mobileotpicon.svg"

// The phone icon with stars used in the Figma design

const OtpVerification = ({ length = 6, onComplete, message = "Enter the OTP Code sent to your Registered Mobile Number" }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input automatically
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }

    // Check if complete
    if (newOtp.join("").length === length && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to focus previous input
    if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-center mb-4">
       <img src={mobileotpicon} alt="mobileotp" />
        <h3 className="font-extrabold text-xl tracking-wider p-2">
          OTP VERIFICATION
        </h3>
      </div>
      
      <p className="text-sand-900 mb-8 text-center font-medium max-w-md">
        {message}
      </p>
      
      <div className="flex justify-center gap-3 md:gap-4 mb-4">
        {otp.map((data, index) => {
          return (
            <input
              className="w-12 h-14 md:w-16 md:h-16 bg-[#F6BE6B] text-center rounded-lg text-white text-2xl font-bold focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary-dark caret-white shadow-sm"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              ref={el => inputRefs.current[index] = el}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between w-full max-w-90 md:max-w-105 text-sm text-sand-900 mt-2 font-medium">
        <span>Resend OTP in 30 sec</span>
        <button className="text-primary font-bold hover:text-primary-dark transition-colors">
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
