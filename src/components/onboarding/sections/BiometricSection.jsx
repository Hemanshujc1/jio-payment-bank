import React, { useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const BiometricSection = ({
  isBiometricVerified,
  setIsBiometricVerified,
  aadhaar,
  pan,
  documentStatus,
  onCaptureSuccess,
}) => {
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const [rdError, setRdError] = useState({
    show: false,
    message: "",
  });

  // ✅ COMMON RD SERVICE PORTS
  const RD_PORTS = {
    MANTRA: [11100, 11101, 11102, 10094],
    MORPHO: [11100, 11101, 11102, 10093],
    STARTEK: [11100, 11101, 11102, 8005],
  };

  // ✅ CHECK ACTIVE RD SERVICE PORT
  const checkRDService = async (deviceType) => {
    const ports = RD_PORTS[deviceType] || [];

    for (let port of ports) {
      try {
        const url = `http://127.0.0.1:${port}`;

        const response = await fetch(url, {
          method: "RDSERVICE",
        });

        const text = await response.text();

        console.log(`${deviceType} RD SERVICE RESPONSE ON PORT ${port}:`, text);

        // ✅ VALID RD SERVICE FOUND
        if (
          text &&
          (text.includes("RDService") ||
            text.includes("Mantra") ||
            text.includes("Morpho") ||
            text.includes("Startek") ||
            text.includes("StarTek"))
        ) {
          return {
            status: true,
            port,
          };
        }
      } catch (error) {
        console.log(`${deviceType} NOT FOUND ON PORT ${port}`);
      }
    }

    return {
      status: false,
      port: null,
    };
  };

  // ✅ CAPTURE BIOMETRIC
  const captureBiometric = async (deviceType) => {
    setShowDeviceModal(false);
    setIsBiometricLoading(true);

    // ✅ CHECK RD SERVICE
    const rdCheck = await checkRDService(deviceType);

    // ✅ REQUEST METHOD
    let method = "CAPTURE";

    if (deviceType === "MORPHO") {
      method = "CAPTURE";
    }

    // ❌ RD SERVICE NOT FOUND
    if (!rdCheck.status) {
      setIsBiometricLoading(false);

      setRdError({
        show: true,
        message: `${deviceType} RD Service is not running.`,
      });

      return;
    }

    // ✅ ACTIVE PORT
    const rdPort = rdCheck.port;

    console.log("ACTIVE RD PORT:", rdPort);

    try {
      let url = "";
      let xmlRequest = "";

      // ✅ MANTRA CONFIG
      if (deviceType === "MANTRA") {
        url = `http://127.0.0.1:${rdPort}/rd/capture`;

        xmlRequest = `
          <PidOptions ver="1.0">
            <Opts 
              fCount="1" 
              fType="2" 
              iCount="0" 
              format="0" 
              pidVer="2.0" 
              timeout="20000" 
              env="PP"
              wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="
            />
          </PidOptions>
        `;
      }

      // ✅ MORPHO CONFIG
      else if (deviceType === "MORPHO") {
        url = `http://127.0.0.1:${rdPort}/capture`;

        xmlRequest = `<PidOptions ver="1.0"><Opts env="PP" fCount="1" fType="2" format="0" pidVer="2.0" timeout="10000" otp="" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh=""/></PidOptions>`;

        // xmlRequest = `
        //   <PidOptions ver="1.0">
        //     <Opts
        //       env="PP"
        //       fCount="1"
        //       fType="0"
        //       format="0"
        //       pidVer="2.0"
        //       timeout="10000"
        //       otp=""
        //       wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="
        //       posh=""
        //     />
        //   </PidOptions>
        // `;
      }

      // ✅ STARTEK CONFIG
      else if (deviceType === "STARTEK") {
        url = `http://127.0.0.1:${rdPort}/rd/capture`;

        xmlRequest = `
          <PidOptions ver="1.0">
            <Opts
              env="PP"
              fCount="1"
              fType="2"
              iCount="0"
              pCount="0"
              format="0"
              pidVer="2.0"
              timeout="20000"
              otp=""
              wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="
              posh=""
            />
          </PidOptions>
        `;
      }

      console.log("CAPTURE URL:", url);
      console.log("PID XML:", xmlRequest);

      const xhr = new XMLHttpRequest();

      // ✅ OPEN REQUEST
      xhr.open(method, url, true);

      // ✅ RESPONSE
      xhr.onload = function () {
        console.log("CAPTURE RESPONSE:", xhr.responseText);

        if (xhr.status === 200) {
          const result = xhr.responseText;

          const parser = new DOMParser();
          const xml = parser.parseFromString(result, "text/xml");

          const resp = xml.getElementsByTagName("Resp")[0];

          const errCode = resp?.getAttribute("errCode");
          const errInfo = resp?.getAttribute("errInfo");

          console.log("ERR CODE:", errCode);
          console.log("ERR INFO:", errInfo);

          // ✅ SUCCESS
          if (errCode === "0") {
            setIsBiometricVerified(true);

            if (onCaptureSuccess) {
              onCaptureSuccess(result);
            }
          }

          // ❌ FAILED
          else {
            setRdError({
              show: true,
              message: errInfo || "Fingerprint capture failed",
            });
          }
        } else {
          setRdError({
            show: true,
            message: "RD service not responding properly.",
          });
        }

        setIsBiometricLoading(false);
      };

      // ❌ CONNECTION ERROR
      xhr.onerror = function () {
        console.error("XHR ERROR");

        setRdError({
          show: true,
          message:
            "Unable to connect to RD service. Please ensure device is connected.",
        });

        setIsBiometricLoading(false);
      };

      // ✅ SEND REQUEST
      xhr.send(xmlRequest);
    } catch (err) {
      console.error("CAPTURE ERROR:", err);

      setRdError({
        show: true,
        message: "Something went wrong during capture.",
      });

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
              isBiometricLoading || (aadhaar?.length !== 12 && aadhaar?.length !== 16) || pan?.length !== 10
            }
            className={`w-full max-w-70 h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
              ${
                isBiometricLoading ||
                (aadhaar?.length !== 12 && aadhaar?.length !== 16) ||
                pan?.length !== 10
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
               Biometric capture completed successfully. Please wait for identity verification to finish.
              </p>
            </div>
          )
        )}
      </div>

      {/* ✅ DEVICE MODAL */}
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
              {/* ✅ MANTRA */}
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

              {/* ✅ MORPHO */}
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

              {/* ✅ STARTEK */}
              <div
                onClick={() => captureBiometric("STARTEK")}
                className="cursor-pointer p-4 border rounded-xl hover:bg-green-50 hover:border-green-400 transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">Startek Device</p>

                  <p className="text-sm text-gray-500">
                    UIDAI compatible fingerprint scanner
                  </p>
                </div>

                <FaFingerprint className="text-green-600 text-xl" />
              </div>
            </div>

            {/* ✅ CANCEL */}
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
                className="flex-1 py-2 rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold"
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
