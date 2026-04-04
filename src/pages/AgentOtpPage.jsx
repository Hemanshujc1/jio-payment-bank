import React, { useState } from "react";
import OtpVerification from "../components/OtpVerification";
import ProceedButton from "../components/ProceedButton";
import verification from "../assets/verification.gif";
const AgentOtpPage = () => {
  const [showOtp, setShowOtp] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const handleGenerateClick = () => {
    setShowOtp(true);
  };
  return (
    <>
      <div className="w-full flex flex-col items-center py-12 px-4 md:px-0 relative z-10">
        <h2 className="text-[20px] font-bold mb-6 tracking-wide text-center">
          Default collection point Cash is selected, please click proceed
        </h2>

        <ProceedButton
          text="Proceed"
          onClick={handleGenerateClick}
          className="mb-8"
        />
        <p className="text-red-700 font-medium tracking-tight text-[15px]">
          Note: Please ensure to collect account subscription charge of Rs. 300
          from the customer{" "}
        </p>

        {showOtp && (
          <div className="w-full mt-6 flex flex-col items-center">
            <h2 className="text-[22px] font-bold mt-2 tracking-wide text-center">
              Agent's OTP
            </h2>
            <OtpVerification
              length={6}
              message="We have sent a 6 digit verification code (OTP) to agents number +91 XXXXX XXXXX"
              onComplete={(code) => {
                console.log("OTP Completed:", code);
                setIsSuccess(true);
              }}
            />

            {isSuccess && (
              <p className="text-gray-900 font-bold mt-4 text-[17px]">
                Awesome! Your OTP has been validate successfully.
              </p>
            )}
          </div>
        )}
      </div>
      {isSuccess && (
        <div className="fixed inset-0 bg-[#302F2D]/95 flex flex-col gap-20 items-center justify-center z-50 animate-in fade-in duration-300">
          <h1
            className="text-[#36B34A] text-4xl md:text-5xl font-black tracking-widest mb-10 text-center drop-shadow-2xl font-sans"
            style={{ textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
          >
            CONGRATULATIONS!
          </h1>
          <div>
            <img src={verification} alt="verification gif" />
          </div>

          <div className="flex items-center gap-6 relative px-6 py-4 rounded-xl border border-white/5 bg-black/10">
            <div className="flex flex-col gap-1 items-center text-center relative z-10">
              <p className="text-white text-[19px] md:text-[21px] font-bold tracking-wide drop-shadow-sm">
                Your application is submitted successfully..!
              </p>
              <p className="text-white text-[19px] md:text-[21px] font-bold tracking-wide mt-1 drop-shadow-sm">
                Application ID: XXXXXXXXXXXXXXX
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AgentOtpPage;
