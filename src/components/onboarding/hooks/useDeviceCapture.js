import { useState } from "react";
import onboardingService from "../../../services/onboardingService";

export const useDeviceCapture = ({
  selectedDevice,
  consentsList,
  selectedConsents,
  onCaptureSuccess,
}) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleCaptureClick = async () => {
    setLocalLoading(true);
    setStatusMessage(`Checking ${selectedDevice} RD Service...`);
    let devicePort = null;

    // RD PORTS
    const RD_PORTS = {
      mantra: [11100, 11101, 11102, 10094],
      morpho: [11100, 11101, 11102, 10093],
      startek: [11100, 11101, 11102, 8005],
    };

    // CHECK RD SERVICE
    const ports = RD_PORTS[selectedDevice] || [];

    for (let port of ports) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}`, {
          method: "RDSERVICE",
        });

        const text = await response.text();

        console.log(
          `${selectedDevice} RD SERVICE RESPONSE ON PORT ${port}:`,
          text
        );

        if (
          text &&
          (text.includes("RDService") ||
            text.includes("Mantra") ||
            text.includes("Morpho") ||
            text.includes("Startek") ||
            text.includes("StarTek"))
        ) {
          devicePort = port;
          break;
        }
      } catch (error) {
        console.log(`${selectedDevice} NOT FOUND ON PORT ${port}`);
      }
    }

    if (!devicePort) {
      setStatusMessage(
        `Error: ${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} RD Service is not running or device is disconnected.`
      );
      setLocalLoading(false);
      return;
    }

    setStatusMessage("Device ready. Please place your finger on the scanner...");

    let pidOptions = "";
    let captureUrl = "";
    let captureMethod = "";

    // MANTRA CONFIG
    if (selectedDevice === "mantra") {
      pidOptions = `
    <PidOptions ver="1.0">
      <Opts
        env="${process.env.PID_ENV}"
        fCount="1"
        fType="2"
        iCount="0"
        pCount="0"
        format="0"
        pidVer="2.0"
        timeout="10000"
      />
    </PidOptions>
  `;
      captureUrl = `http://127.0.0.1:${devicePort}/rd/capture`;
      captureMethod = "CAPTURE";
    }

    // MORPHO CONFIG
    else if (selectedDevice === "morpho") {
      pidOptions =
        '<PidOptions ver="1.0">' +
        "<Opts " +
        'env="${process.env.PID_ENV}" ' +
        'fCount="1" ' +
        'fType="2" ' +
        'iCount="0" ' +
        'iType="0" ' +
        'pCount="0" ' +
        'pType="0" ' +
        'format="0" ' +
        'pidVer="2.0" ' +
        'timeout="10000" ' +
        'posh="UNKNOWN"/>' +
        "</PidOptions>";
      captureUrl = `http://127.0.0.1:${devicePort}/capture`;
      captureMethod = "CAPTURE";
    }

    // STARTEK CONFIG
    else if (selectedDevice === "startek") {
      pidOptions = `<PidOptions ver="1.0">
      <Opts
        env="${process.env.PID_ENV}"
        fCount="1"
        fType="2"
        iCount="0"
        pCount="0"
        format="0"
        pidVer="2.0"
        timeout="20000"
        otp=""
        posh=""
      />
    </PidOptions>
    `;
      captureUrl = `http://127.0.0.1:${devicePort}/rd/capture`;
      captureMethod = "CAPTURE";
    }

    // 2. Capture Biometric Data
    try {
      const captureResponse = await fetch(captureUrl, {
        method: captureMethod,
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
              vkid: localStorage.getItem("vkid"),
              applicationNumber: sessionStorage.getItem("applicationNumber"),
              externalAppRefNumber: sessionStorage.getItem(
                "externalAppRefNumber"
              ),
              bioMetricData: captureXml,
              consents: formattedConsents,
            };

            const apiResponse = await onboardingService.customerBioAuth(
              payload
            );

            if (apiResponse.status === "SUCCESS") {
              setStatusMessage("Biometric Verified Successfully!");
              if (onCaptureSuccess) {
                onCaptureSuccess(formattedConsents);
              }
            } else {
              setStatusMessage("Biometric Verification Failed!");
            }
          } catch (apiError) {
            console.error("API Authentication Failed:", apiError);
            setStatusMessage(
              "Authentication Error: Failed to verify biometric data on the server."
            );
          }
        } else {
          const errorMatch = captureXml.match(/errInfo="([^"]+)"/);
          const errorMsg = errorMatch
            ? errorMatch[1]
            : "Capture failed. Please try again.";
          setStatusMessage(`Capture Error: ${errorMsg}`);
        }
      } else {
        setStatusMessage(
          "Error: Failed to communicate with the capture service."
        );
      }
    } catch (error) {
      setStatusMessage("Error: Capture service unreachable.");
    }

    setLocalLoading(false);
  };

  return {
    handleCaptureClick,
    statusMessage,
    setStatusMessage,
    localLoading,
  };
};
