import React from "react";
import { FaFingerprint } from "react-icons/fa";

const BiometricVerificationModal = ({
  isOpen,
  onClose,
  isVerified,
  isLoading,
  onCapture,
  consentAccepted,
  setConsentAccepted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 md:p-8 flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors font-bold text-lg p-2"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="font-bold text-[20px] md:text-[22px] tracking-wide text-center mt-2">
        Disclaimer
        </h2>

        <div className="flex items-start gap-3 w-full bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <input
            type="checkbox"
            id="final-biometric-consent"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            className="w-5 h-5 cursor-pointer rounded-sm mt-0.5 accent-black shrink-0 border-gray-300"
          />
          <label
            htmlFor="final-biometric-consent"
            className="text-[13.5px] text-black leading-relaxed cursor-pointer font-medium flex flex-col gap-2"
          >
            <p>
              I hereby authorize Vakrangee Limited to use Biometric/OTP for
              authenticating my identity through the Aadhaar based
              Authentication system for obtaining my e-KYC through Aadhaar based
              e-KYC services of UIDAI in accordance with the provisions of the
              Aadhaar (Targeted Delivery of Financial and other Subsidies,
              Benefits and Services) Act, 2016 and the allied rules and
              regulations notified.
            </p>
            <p>
              I have understood that the Biometric and/or OTP, provided for
              authentication shall be used for authenticating my identity
              through the Aadhaar Authentication system for this specific
              transaction only and for no other purposes.
            </p>
            <p>
              I understand that Security and confidentiality of personal data
              (Other than Biometric/OTP) shall be ensured by Vakrangee and
              Vakrangee may use this data in the future for its own consumption.
            </p>
          </label>
        </div>

        <div className="flex justify-center w-full mt-4 min-w-22.5">
          {!isVerified ? (
            <button
              type="button"
              onClick={onCapture}
              disabled={!consentAccepted || isLoading}
              className={`w-full max-w-70 h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
                ${
                  !consentAccepted || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-sand-500 text-sand-350 border border-brown-700 hover:bg-brown-800"
                }`}
            >
              {isLoading ? (
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
            <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-green-500/30">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricVerificationModal;
