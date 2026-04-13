import React from "react";
import { FaFingerprint } from "react-icons/fa";

const BiometricSection = ({
  isBiometricVerified,
  captureBiometric,
  isBiometricLoading,
  aadhaar,
  pan,
  documentStatus,
}) => {
  return (
    <div className="w-full flex items-center justify-center mb-1 max-w-4xl mx-auto">
      {!isBiometricVerified ? (
        <button
          type="button"
          onClick={captureBiometric}
          disabled={
            isBiometricLoading || aadhaar?.length !== 12 || pan?.length !== 10
          }
          className={`w-full max-w-70 h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
             ${isBiometricLoading || aadhaar?.length !== 12 || pan?.length !== 10 ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" : "bg-sand-500 text-sand-350 border border-brown-700 hover:bg-brown-800"}`}
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
        documentStatus !== "mismatch" && (
          <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/30">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
              Biometric Verified Successfully
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default BiometricSection;
