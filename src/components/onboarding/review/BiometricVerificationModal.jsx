import React, { useState, useEffect } from "react";
import { FaFingerprint } from "react-icons/fa";
import onboardingService from "../../../services/onboardingService";
import ConsentsSection from "../sections/ConsentsSection";
import LanguageSelection from "../sections/LanguageSelection";

const BiometricVerificationModal = ({
  isOpen,
  onClose,
  isVerified,
  isLoading,
  onCaptureSuccess,
  apiPayloadData,
}) => {
  const [selectedDevice, setSelectedDevice] = useState("mantra");
  const [statusMessage, setStatusMessage] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const [language, setLanguage] = useState("English");
  const [consentsList, setConsentsList] = useState([]);
  const [selectedConsents, setSelectedConsents] = useState({});

  const languagesList = [
    { name: "English", code: "EN" },
    { name: "Hindi", code: "HI" },
    { name: "Telugu", code: "TA" },
    { name: "Tamil", code: "TE" },
    { name: "Kannada", code: "KN" },
    { name: "Marathi", code: "MR" },
    { name: "Bengali", code: "BN" },
  ];

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const selectedLang = languagesList.find((l) => l.name === language);
        const langCode = selectedLang ? selectedLang.code : "EN";
        const res = await onboardingService.getConsents(langCode);
        if (res.status === "SUCCESS" && res.response?.consents) {
          setConsentsList(res.response.consents);
          const initial = {};
          res.response.consents.forEach((c) => {
            initial[c.consentTextCode] = false;
          });
          setSelectedConsents(initial);
        }
      } catch (err) {
        console.error("Failed to fetch consents", err);
      }
    };
    if (isOpen) {
      fetchConsents();
    }
  }, [language, isOpen]);

  const isAllConsentsSelected =
    consentsList.length > 0 &&
    consentsList.every((c) => c.mandatory !== "Y" || selectedConsents[c.consentTextCode]);

  if (!isOpen) return null;

  const handleCaptureClick = async () => {
    setLocalLoading(true);
    setStatusMessage(`Checking ${selectedDevice} RD Service...`);
    let devicePort = null;

    // 1. Scan for RD Service
    for (let port = 11100; port <= 11105; port++) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/rd/info`, {
          method: "RDSERVICE",
        });
        if (response.ok) {
          const text = await response.text();
          if (selectedDevice === "mantra" && text.toLowerCase().includes("mantra")) {
            devicePort = port;
            break;
          } else if (
            selectedDevice === "morpho" &&
            (text.toLowerCase().includes("morpho") || text.toLowerCase().includes("scl"))
          ) {
            devicePort = port;
            break;
          }
        }
      } catch (error) {
        // Port not active, loop continues
      }
    }

    if (!devicePort) {
      setStatusMessage(`Error: ${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} RD Service is not running or device is disconnected.`);
      setLocalLoading(false);
      return;
    }

    setStatusMessage("Device ready. Please place your finger on the scanner...");

    const pidOptions = `<PidOptions ver="1.0">
      <Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" env="PP" />
    </PidOptions>`;

    // 2. Capture Biometric Data
    try {
      const captureResponse = await fetch(`http://127.0.0.1:${devicePort}/rd/capture`, {
        method: "CAPTURE",
        headers: {
          Accept: "text/xml",
          "Content-Type": "text/xml",
        },
        body: pidOptions,
      });

      if (captureResponse.ok) {
        const captureXml = await captureResponse.text();

        // 3. Check for success code in XML (errCode="0")
        if (captureXml.includes('errCode="0"')) {
          setStatusMessage("Biometric captured! Authenticating with server...");
          
          // ========================================================
          // 4. API CALL WITH SPECIFIED PAYLOAD FORMAT
          // ========================================================
          try {
            const formattedConsents = consentsList
              .filter((c) => selectedConsents[c.consentTextCode])
              .map((c) => ({
                consent: c.text1,
                code: c.consentTextCode,
                version: "1",
                method: "checkbox",
              }));

            const payload = {
              vkid: localStorage.getItem("vkid") || "RJ2903071",
              applicationNumber: sessionStorage.getItem("applicationNumber"),
              externalAppRefNumber: sessionStorage.getItem("externalAppRefNumber"),
              latitude: "19.118027857360293", // Hardcoded
              longitude: "72.8733474523108",  // Hardcoded
              bioMetricData: captureXml,
              consents: formattedConsents
            };

            const apiResponse = await onboardingService.customerBioAuth(payload);

            if(apiResponse.status === "SUCCESS") {
              setStatusMessage("Biometric Verified Successfully!");
              if (onCaptureSuccess) {
                onCaptureSuccess(formattedConsents); 
              }
            } else{
              setStatusMessage("Biometric Verification Failed!");
            }

          } catch (apiError) {
            console.error("API Authentication Failed:", apiError);
            setStatusMessage("Authentication Error: Failed to verify biometric data on the server.");
          }
          
        } else {
          const errorMatch = captureXml.match(/errInfo="([^"]+)"/);
          const errorMsg = errorMatch ? errorMatch[1] : "Capture failed. Please try again.";
          setStatusMessage(`Capture Error: ${errorMsg}`);
        }
      } else {
        setStatusMessage("Error: Failed to communicate with the capture service.");
      }
    } catch (error) {
      setStatusMessage("Error: Capture service unreachable.");
    }

    setLocalLoading(false);
  };

  const isButtonDisabled = !isAllConsentsSelected || isLoading || localLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide p-6 md:p-8 flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors font-bold text-lg p-2 bg-white rounded-full"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="font-bold text-[20px] md:text-[22px] tracking-wide text-center mt-2">
          Biometric Verification
        </h2>

        <div className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col gap-3 shrink-0">
          <label className="font-bold text-[14px] text-gray-800">Select Fingerprint Device:</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-[14px] font-medium">
              <input
                type="radio"
                name="device"
                value="mantra"
                checked={selectedDevice === "mantra"}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setStatusMessage(""); 
                }}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              Mantra
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[14px] font-medium">
              <input
                type="radio"
                name="device"
                value="morpho"
                checked={selectedDevice === "morpho"}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setStatusMessage(""); 
                }}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              Morpho
            </label>
          </div>
        </div>

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
          <div className={`w-full text-center text-[13.5px] font-bold p-2 rounded-lg shrink-0 ${statusMessage.includes("Error") ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"}`}>
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
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
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