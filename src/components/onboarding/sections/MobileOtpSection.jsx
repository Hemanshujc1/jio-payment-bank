import React from "react";
import ProceedButton from "../../common/ProceedButton";
import OtpVerification from "../../common/OtpVerification";
import { IoMdCheckmarkCircle } from "react-icons/io";

const MobileOtpSection = ({
  mobileNumber,
  setMobileNumber,
  email,
  setEmail,
  showMobileOtp,
  handleGenerateMobileOtp,
  isMobileVerified,
  setIsMobileVerified,
  showEmailOtp,
  handleGenerateEmailOtp,
  isEmailVerified,
  setIsEmailVerified,
  onProceed,
}) => {
  // Regex for basic email format
  const isValidEmail = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="w-full flex justify-center py-10 px-4 md:px-8 animate-in fade-in duration-500">
       {/* bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 */}
      <div className="w-full max-w-4xl p-8 md:p-12 flex flex-col items-start">
        
        {/* Header */}
        <div className="w-full border-b border-sand-500 pb-6 mb-8">
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-sand-900 tracking-tight">
            Customer Verification
          </h2>
          <p className="text-[14px] md:text-[15px] text-sand-500 mt-2 font-medium">
            Please verify contact details to authorize the onboarding process.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full">
          {/* Mobile Number Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <label className="text-[14px] text-sand-500 font-bold mb-2">
              Mobile Number<span className="text-red-500 ml-1">*</span>
            </label>
            <div className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative ${isMobileVerified ? 'bg-green-50/30 border-green-200' : 'bg-sand-100/50 border-sand-300 focus-within:border-brown-700 focus-within:bg-white'}`}>
              <input
                type="text"
                placeholder="XXXXXXXXXX"
                maxLength="10"
                disabled={showMobileOtp || isMobileVerified}
                className={`grow outline-none text-sand-900 font-semibold bg-transparent tracking-widest text-[16px] ${(showMobileOtp || isMobileVerified) ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setMobileNumber(val);
                }}
              />
              {isMobileVerified && (
                <IoMdCheckmarkCircle className="text-green-500 text-2xl absolute right-3" />
              )}
            </div>
            
            {!isMobileVerified && !showMobileOtp && (
              <button
                onClick={handleGenerateMobileOtp}
                disabled={mobileNumber.length < 10}
                className="mt-4 w-full h-11 bg-sand-500 text-sand-350 border border-brown-700 font-bold rounded-lg hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px]"
              >
                Generate OTP
              </button>
            )}

            {showMobileOtp && !isMobileVerified && (
              <div className="mt-4 w-full bg-sand-200/40 rounded-xl p-3 border border-sand-300 relative">
                <p className="text-[13px] text-sand-900 font-medium mb-1">Enter OTP sent to <span className="text-brown-700 font-bold">{mobileNumber}</span></p>
                <OtpVerification
                  length={6}
                  onComplete={(code) => {
                    console.log("Mobile OTP Completed:", code);
                    setIsMobileVerified(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* Email Address Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <label className="text-[14px] text-sand-500 font-bold mb-2">
              Email Address <span className="text-sand-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative ${isEmailVerified ? 'bg-green-50/30 border-green-200' : 'bg-sand-100/50 border-sand-300 focus-within:border-brown-700 focus-within:bg-white'}`}>
              <input
                type="email"
                placeholder="customer@example.com"
                disabled={showEmailOtp || isEmailVerified}
                className={`grow outline-none text-sand-900 font-semibold bg-transparent text-[16px] ${(showEmailOtp || isEmailVerified) ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isEmailVerified && (
                <IoMdCheckmarkCircle className="text-green-500 text-2xl absolute right-3" />
              )}
            </div>
            
            {!isEmailVerified && !showEmailOtp && email.length > 0 && isValidEmail && (
              <button
                onClick={handleGenerateEmailOtp}
                className="mt-4 w-full h-11 bg-sand-500 text-sand-350 border border-brown-700 font-bold rounded-lg hover:bg-brown-800 transition-colors text-[14px]"
              >
                Generate OTP
              </button>
            )}

            {!isValidEmail && email.length > 0 && (
              <p className="text-red-500 font-medium text-[12px] mt-2">Please enter a valid email address.</p>
            )}

            {showEmailOtp && !isEmailVerified && (
              <div className="mt-4 w-full bg-sand-200/40 rounded-xl p-3 border border-sand-300 relative">
                <p className="text-[13px] text-sand-900 font-medium mb-1">Enter OTP sent to <span className="text-brown-700 font-bold">{email}</span></p>
                <OtpVerification
                  length={6}
                  onComplete={(code) => {
                    console.log("Email OTP Completed:", code);
                    setIsEmailVerified(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="w-full flex justify-center items-center mt-10 pt-5 border-t border-sand-500">
          <ProceedButton
            text="Proceed to Onboarding"
            onClick={onProceed}
            disabled={!isMobileVerified || (email.length > 0 && !isEmailVerified)}
            className="max-w-fit rounded-xl text-[12px]"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileOtpSection;
