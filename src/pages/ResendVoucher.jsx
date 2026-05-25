import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useToast } from "../components/ui/Toast";
import { MOBILE_REGEX, isRepeatingDigits } from "../utils/validationUtils";

const PAN_REGEX = /^[A-Z]{3}P[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

const ResendVoucher = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [mobileNumber, setMobileNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleProceedMobile = async () => {
    if (
      MOBILE_REGEX.test(mobileNumber) &&
      !isRepeatingDigits(mobileNumber) &&
      PAN_REGEX.test(panNumber)
    ) {
      setIsApiLoading(true);
      // Simulate API call to resend voucher
      setTimeout(() => {
        setIsApiLoading(false);
        toast.success("Voucher Code submitted successfully!");
        navigate("/refund-flow");
      }, 800);
    } else {
      toast.warning("Please enter a valid mobile number and PAN card number.");
    }
  };

  return (
    <div className="grow w-full flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4 animate-in fade-in duration-500 font-sans">
      <div className="w-full max-w-lg p-4 sm:p-8 md:p-12 flex flex-col items-start bg-white rounded-2xl shadow-xl border border-sand-300 overflow-hidden">
        
        {isMobileVerified ? (
          <div className="w-full max-w-md mx-auto" />
        ) : (
          <>
            {/* Header */}
            <div className="w-full border-b border-sand-500 text-center pb-4 sm:pb-6 mb-6 sm:mb-8">
              <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-extrabold text-sand-900 tracking-tight">
                Resend Refund Voucher Code to the Customer
              </h2>
              <p className="text-[13px] sm:text-[14px] md:text-[15px] text-sand-500 mt-1 sm:mt-2 font-medium leading-normal">
                Please verify details to resend the voucher process.
              </p>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-md mx-auto flex flex-col items-stretch">
              
              {/* Mobile Input Group */}
              <div className="w-full flex flex-col items-start">
                <label className="text-[14px] text-sand-500 font-bold mb-2">
                  Enter Customer's Mobile Number<span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative ${
                  isMobileVerified 
                    ? 'bg-green-50/30 border-green-200' 
                    : 'bg-white border-sand-300 focus-within:border-brown-700 focus-within:bg-white'
                }`}>
                  <input
                    type="text"
                    placeholder="XXXXXXXXXX"
                    maxLength="10"
                    disabled={isMobileVerified}
                    className={`grow outline-none text-sand-900 font-semibold bg-transparent tracking-widest text-[16px] ${
                      isMobileVerified ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
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

                {mobileNumber.length === 10 && !MOBILE_REGEX.test(mobileNumber) && (
                  <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    Invalid mobile number
                  </p>
                )}
                {mobileNumber.length === 10 && isRepeatingDigits(mobileNumber) && (
                  <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    Invalid mobile number
                  </p>
                )}
              </div>

              {/* PAN Input Group */}
              <div className="w-full flex flex-col items-start mt-4">
                <label className="text-[14px] text-sand-500 font-bold mb-2">
                  Enter Customer's PAN Number<span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative ${
                  isMobileVerified 
                    ? 'bg-green-50/30 border-green-200' 
                    : 'bg-white border-sand-300 focus-within:border-brown-700 focus-within:bg-white'
                }`}>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    maxLength="10"
                    disabled={isMobileVerified}
                    className={`grow outline-none text-sand-900 font-semibold bg-transparent tracking-widest text-[16px] uppercase ${
                      isMobileVerified ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    value={panNumber}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                      setPanNumber(val);
                    }}
                  />
                  {isMobileVerified && (
                    <IoMdCheckmarkCircle className="text-green-500 text-2xl absolute right-3" />
                  )}
                </div>

                {panNumber.length === 10 && !PAN_REGEX.test(panNumber) && (
                  <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    Enter Valid PAN Number
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {!isMobileVerified && (
                <button
                  onClick={handleProceedMobile}
                  disabled={
                    !MOBILE_REGEX.test(mobileNumber) ||
                    isRepeatingDigits(mobileNumber) ||
                    !PAN_REGEX.test(panNumber) ||
                    isApiLoading
                  }
                  className="mt-6 w-full h-11 bg-sand-500 text-sand-350 border border-brown-700 font-bold rounded-lg hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] flex items-center justify-center gap-2"
                >
                  {isApiLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-sand-350 border-t-transparent rounded-full animate-spin"></span>
                      Proceeding...
                    </>
                  ) : (
                    "Resend Voucher Code"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResendVoucher;

