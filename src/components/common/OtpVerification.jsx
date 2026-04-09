import React, { useState, useRef } from 'react';

const OtpVerification = ({ length = 6, onComplete }) => {
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
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">        
      <div className="flex justify-center gap-2 sm:gap-3 w-full mb-2">
        {otp.map((data, index) => {
          return (
            <input
              className={`w-10 h-12 sm:w-12 sm:h-14 bg-primary/90 hover:bg-primary border-transparent text-center rounded-xl text-gray-900 text-lg sm:text-xl font-bold transition-all shadow-sm shadow-black/10 outline-none caret-brown-800 focus:ring-2 focus:ring-brown-700 focus:bg-primary ${
                data !== "" ? "bg-primary ring-1 ring-brown-700/30" : ""
              }`}
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
      
      <div className="flex items-center justify-between w-full max-w-70 text-[13px] text-gray-500 mt-4 px-2 font-medium">
        <span>Resend OTP in 30 sec</span>
        <button className="text-brown-700 font-bold hover:text-brown-900 transition-colors">
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
