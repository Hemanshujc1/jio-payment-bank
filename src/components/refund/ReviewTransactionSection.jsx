import React, { useState } from "react";
import ProceedButton from "../common/ProceedButton";
import { FaFingerprint } from "react-icons/fa";

const ReviewTransactionSection = ({
  customerName = "Sai Vinayak Shekhar Bangera",
  applicationStatus = "Rejected",
  transactionType = "Savings Account",
  refundStatus = "In-Progress",
  amountToRefund = "Rs. 400",
  mobileNumber = "9876543210",
  onProceed,
  c69ConsentData,
}) => {
  const [c69Accepted, setC69Accepted] = useState(false);
  const [error, setError] = useState("");
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleCaptureClick = () => {
    setIsBiometricLoading(true);
    setTimeout(() => {
      setIsBiometricLoading(false);
      setIsBiometricVerified(true);
    }, 1000);
  };

  const handleProceedClick = () => {
    if (!c69Accepted) {
      setError("Please accept the terms and conditions to proceed.");
      return;
    }
    setError("");
    if (onProceed) onProceed();
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full bg-white p-2 sm:p-4 rounded-xl flex flex-col gap-6">
        {/* Title */}
        <h3 className="text-[20px] sm:text-[22px] font-extrabold text-sand-900 text-center tracking-tight">
          Review Transaction Details
        </h3>

        {/* Details Grid */}
        <div className="w-full flex flex-col gap-5 border-t border-b border-sand-300 py-6">
          {/* Customer Name */}
          <div className="flex justify-between items-start gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold min-w-[120px]">
              Customer Name
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right max-w-[200px] leading-tight">
              {customerName}
            </span>
          </div>

          {/* Application Status */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Application Status
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {applicationStatus}
            </span>
          </div>

          {/* Transaction Type */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Transaction Type
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {transactionType}
            </span>
          </div>

          {/* Refund Status */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Refund Status
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {refundStatus}
            </span>
          </div>

          {/* Amount To Refund */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Amount to be refund
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {amountToRefund}
            </span>
          </div>

          {/* Mobile Number */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Mobile Number
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {mobileNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Nominee Consent Checkbox */}
      <div className="w-full flex flex-col gap-2 mt-1 px-2 sm:px-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-1 shrink-0">
            <input
              type="checkbox"
              checked={c69Accepted}
              onChange={(e) => {
                setC69Accepted(e.target.checked);
                if (e.target.checked) setError("");
              }}
              className={`w-5 h-5 border-2 accent-black cursor-pointer rounded-sm ${
                error ? "border-red-500" : "border-[#D1A054]"
              }`}
            />
          </div>
          <span className="text-[13.5px] sm:text-[14px] leading-snug text-gray-800 select-none">
            {c69ConsentData
              ? "I hereby agree and authorise Jio Payments Bank to fetch my personal details from UIDAI. I declare and confirm that no other account has been opened or will be opened using my Aadhaar details to authenticate my identity through OTP verification as a part of the e- KYC process. I authorize Jio Payments Bank to use my Aadhaar details and core biometric/OTP information to authenticate and verify my identity with UIDAI. I hereby give voluntary consent to link my Aadhaar number to all my existing bank accounts andcustomer profiles for the purpose of availing of banking services and operating the account. Jio payments bank has informed me that my identity information would only be used for banking services and my biometrics/OTP will not be stored."
              : c69ConsentData.text1
                  .split(/\\r\\n|\\n|\r\n|\n/)
                  .map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
            <span className="text-red-500 text-lg ml-1">*</span>
          </span>
        </label>
        {error && (
          <span className="text-red-500 text-[12px] font-medium ml-8 animate-in fade-in duration-200">
            {error}
          </span>
        )}
      </div>

      {/* Biometric Integration Step */}
      <div className="w-full mt-4 flex items-center justify-center">
        {!isBiometricVerified ? (
          <button
            type="button"
            onClick={handleCaptureClick}
            disabled={isBiometricLoading}
            className="w-full max-w-xs h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md bg-linear-to-r from-red-500 to-pink-500 text-white hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBiometricLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Capturing Biometric...
              </>
            ) : (
              <>
                <FaFingerprint className="text-xl" />
                CAPTURE BIOMETRIC
              </>
            )}
          </button>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/30">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <p className="text-green-700 font-black text-[17px] tracking-wide">
              Biometric capture completed successfully.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-center mt-2">
        <ProceedButton
          text="PROCEED"
          onClick={handleProceedClick}
          disabled={!c69Accepted || !isBiometricVerified}
          className="w-full rounded-xl text-[14px] py-2.5 h-11"
        />
      </div>
    </div>
  );
};

export default ReviewTransactionSection;
