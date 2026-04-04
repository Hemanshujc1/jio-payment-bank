import React from "react";
import ProceedButton from "../ProceedButton";
import OtpVerification from "../OtpVerification";
import mobileicon from "../../assets/mobileicon.svg";

const MobileOtpSection = ({
  mobileNumber,
  setMobileNumber,
  showOtp,
  handleGenerateOtp,
  setIsOtpVerified,
}) => {
  return (
    <div className="w-full flex flex-col items-center py-12 px-4 md:px-0 animate-in fade-in duration-500">
      <h2 className="text-[20px] font-bold mb-6 tracking-wide text-center">
        Enter Customer's Mobile Number
      </h2>

      {/* Input Box with white background */}
      <div className="flex items-center bg-white rounded-lg p-3 w-full max-w-100 mb-8 shadow-sm border border-neutral-light/50">
        <div className="px-2">
          <img src={mobileicon} alt="mobile icon" />
        </div>
        <input
          type="text"
          placeholder="XXXXXXXXXX"
          maxLength="10"
          className="grow outline-none text-black font-bold bg-transparent tracking-widest text-lg"
          value={mobileNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setMobileNumber(val);
          }}
        />
      </div>

      {!showOtp ? (
        <ProceedButton
          text="Generate OTP"
          onClick={handleGenerateOtp}
          disabled={mobileNumber.length < 10}
          className="mb-8"
        />
      ) : (
        <OtpVerification
          length={6}
          onComplete={(code) => {
            console.log("OTP Completed:", code);
            setIsOtpVerified(true);
          }}
        />
      )}
    </div>
  );
};

export default MobileOtpSection;
