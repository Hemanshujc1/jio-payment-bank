import React, { useState, useEffect } from "react";
import { FaFingerprint } from "react-icons/fa";
import onboardingService from "../../../services/onboardingService";
import ConsentsSection from "../sections/ConsentsSection";
import LanguageSelection from "../sections/LanguageSelection";
import DeviceSelector from "../sections/DeviceSelector";
import { useDeviceCapture } from "../hooks/useDeviceCapture";
import { useConsents } from "../hooks/useConsents";

const BiometricVerificationModal = ({
  isOpen,
  onClose,
  isVerified,
  isLoading,
  onCaptureSuccess,
  apiPayloadData,
}) => {
  const [selectedDevice, setSelectedDevice] = useState("mantra");

  const [language, setLanguage] = useState("English");

  const {
    languagesList,
    consentsList,
    selectedConsents,
    setSelectedConsents,
    isAllConsentsSelected,
  } = useConsents(language, null, "FINAL_SUBMISSION");

  const { handleCaptureClick, statusMessage, setStatusMessage, localLoading } = useDeviceCapture({
    selectedDevice,
    consentsList,
    selectedConsents,
    onCaptureSuccess,
  });

  if (!isOpen) return null;

  const isButtonDisabled = !isAllConsentsSelected || isLoading || localLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      {/* scrollbar-hide */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors font-bold text-lg p-2 bg-white rounded-full"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="font-bold text-[20px] md:text-[22px] tracking-wide text-center mt-2">
        Customer Biometric Verification
        </h2>

        <DeviceSelector
          selectedDevice={selectedDevice}
          onDeviceChange={(device) => {
            setSelectedDevice(device);
            setStatusMessage("");
          }}
        />

        <div className="w-full shrink-0">
          <ConsentsSection
            consents={consentsList}
            selectedConsents={selectedConsents}
            setSelectedConsents={setSelectedConsents}
          />
          <LanguageSelection
            language={language}
            setLanguage={setLanguage}
            languages={languagesList}
          />
        </div>

        {statusMessage && (
          <div
            className={`w-full text-center text-[13.5px] font-bold p-2 rounded-lg shrink-0 ${statusMessage.includes("Error") ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"}`}
          >
            {statusMessage}
          </div>
        )}

        <div className="flex justify-center w-full mt-2 min-w-22.5 shrink-0 mb-4">
          {!isVerified ? (
            <button
              type="button"
              onClick={handleCaptureClick}
              disabled={isButtonDisabled}
              className={`w-full max-w-72 h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
                ${
                  isButtonDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-sand-500 text-sand-350 border border-brown-700 hover:bg-brown-800"
                }`}
            >
              {isLoading || localLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaFingerprint className="text-xl" />
                  Customer Biometric Verification
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
