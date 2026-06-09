import React, { useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import { useEkycDeviceCapture } from "../hooks/useEkycDeviceCapture";
import DeviceSelectionModal from "./DeviceSelectionModal";
import DeviceErrorModal from "./DeviceErrorModal";

const BiometricSection = ({
  isBiometricVerified,
  setIsBiometricVerified,
  aadhaar,
  pan,
  documentStatus,
  onCaptureSuccess,
  disableDocumentValidation = false,
}) => {
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const { captureBiometric, isBiometricLoading, rdError, setRdError } = useEkycDeviceCapture({
    setIsBiometricVerified,
    onCaptureSuccess,
    setShowDeviceModal,
  });

  return (
    <>
      {/*  MAIN BUTTON */}
      <div className="w-full flex items-center justify-center mb-1 max-w-4xl mx-auto">
        {!isBiometricVerified ? (
          <button
            type="button"
            onClick={() => setShowDeviceModal(true)}
            disabled={
              isBiometricLoading || (!disableDocumentValidation && ((aadhaar?.length !== 12 && aadhaar?.length !== 16) || pan?.length !== 10))
            }
            className={`w-full max-w-70 h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
              ${
                isBiometricLoading ||
                (!disableDocumentValidation && ((aadhaar?.length !== 12 && aadhaar?.length !== 16) || pan?.length !== 10))
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-linear-to-r from-red-500 to-pink-500 text-white hover:scale-[1.02] hover:shadow-lg"
              }`}
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
            <div className="flex flex-col items-center">
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
               Biometric capture completed successfully. Please wait for identity verification to finish.
              </p>
            </div>
          )
        )}
      </div>

      <DeviceSelectionModal
        showDeviceModal={showDeviceModal}
        setShowDeviceModal={setShowDeviceModal}
        onSelectDevice={captureBiometric}
      />

      <DeviceErrorModal
        rdError={rdError}
        setRdError={setRdError}
        onRetry={() => setShowDeviceModal(true)}
      />
    </>
  );
};

export default BiometricSection;
