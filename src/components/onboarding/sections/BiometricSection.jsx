import React, { useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const BiometricSection = ({
  isBiometricVerified,
  setIsBiometricVerified,
  aadhaar,
  pan,
  documentStatus,
  captureBiometricVerify
}) => {
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [rdError, setRdError] = useState({
    show: false,
    message: "",
  });

  // ✅ RD SERVICE CHECK
  const checkRDService = async (deviceType) => {
    let url = "http://127.0.0.1:11100";

    try {
      const response = await fetch(url, {
        method: "RDSERVICE",
      });

      const text = await response.text();

      if (text && text.includes("RDService")) {
        return { status: true };
      }

      return { status: false };
    } catch (error) {
      return { status: false };
    }
  };

  // ✅ CAPTURE FUNCTION
  const captureBiometric = async (deviceType) => {
    setShowDeviceModal(false);
    setIsBiometricLoading(true);

    const rdCheck = await checkRDService(deviceType);

    if (!rdCheck.status) {
      setIsBiometricLoading(false);
      setRdError({
        show: true,
        message: `${deviceType} RD Service is not running. Please connect the device and start RD service.`,
      });
      return;
    }

    try {
      // ✅ DEFINE URL
      const captureUrl = "http://127.0.0.1:11100/rd/capture";

      // ✅ DEFINE XML REQUEST (WITH CORRECT ENV)
      const xmlRequest = `
        <PidOptions ver="1.0">
          <Opts 
            fCount="1" 
            fType="2" 
            iCount="0" 
            format="0" 
            pidVer="2.0" 
            timeout="20000" 
            env="P"
          />
        </PidOptions>
      `;

      const response = await fetch(captureUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
        },
        body: xmlRequest,
      });

      const result = await response.text();
      console.log("RD RESULT:", result);

      const parser = new DOMParser();
      const xml = parser.parseFromString(result, "text/xml");

      const resp = xml.getElementsByTagName("Resp")[0];
      const errCode = resp?.getAttribute("errCode");
      const errInfo = resp?.getAttribute("errInfo");

      if (errCode === "0") {
        if (captureBiometricVerify) {
          await captureBiometricVerify(result);
        }
      } else {
        setRdError({
          show: true,
          message: errInfo || "Fingerprint capture failed",
        });
      }
    } catch (err) {
      console.error("CAPTURE ERROR:", err);
      setRdError({
        show: true,
        message: "Unable to capture fingerprint. Please check device connection.",
      });
    } finally {
      setIsBiometricLoading(false);
    }
  };

  return (
    <>
      {/* ✅ MAIN BUTTON */}
      <div className="w-full flex items-center justify-center mb-1 max-w-4xl mx-auto">
        {!isBiometricVerified ? (
          <button
            type="button"
            onClick={() => setShowDeviceModal(true)}
            disabled={
              isBiometricLoading || aadhaar?.length !== 12 || pan?.length !== 10
            }
            className={`w-full max-w-70 h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
              ${
                isBiometricLoading ||
                aadhaar?.length !== 12 ||
                pan?.length !== 10
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:scale-[1.02] hover:shadow-lg"
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
            <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
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
                Biometric Verified Successfully
              </p>
            </div>
          )
        )}
      </div>

      {/* ✅ DEVICE SELECTION MODAL */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                Select Biometric Device
              </h2>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => captureBiometric("MANTRA")}
                className="cursor-pointer p-4 border rounded-xl hover:bg-red-50 hover:border-red-400 transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">Mantra Device</p>
                  <p className="text-sm text-gray-500">
                    Recommended for faster capture
                  </p>
                </div>
                <FaFingerprint className="text-red-500 text-xl" />
              </div>

              <div
                onClick={() => captureBiometric("MORPHO")}
                className="cursor-pointer p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">Morpho Device</p>
                  <p className="text-sm text-gray-500">
                    Secure biometric authentication
                  </p>
                </div>
                <FaFingerprint className="text-blue-500 text-xl" />
              </div>
            </div>

            <button
              onClick={() => setShowDeviceModal(false)}
              className="mt-6 w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ ERROR POPUP */}
      {rdError.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-sm p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-2xl font-bold">!</span>
              </div>
            </div>

            <p className="text-center text-gray-800 font-semibold text-[15px] mb-4">
              {rdError.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setRdError({ show: false, message: "" })}
                className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setRdError({ show: false, message: "" });
                  setShowDeviceModal(true);
                }}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BiometricSection;
