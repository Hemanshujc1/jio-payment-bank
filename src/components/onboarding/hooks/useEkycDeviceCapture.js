import { useState } from "react";

export const useEkycDeviceCapture = ({ setIsBiometricVerified, onCaptureSuccess, setShowDeviceModal }) => {
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [rdError, setRdError] = useState({
    show: false,
    message: "",
  });

  //  COMMON RD SERVICE PORTS
  const RD_PORTS = {
    MANTRA: [11100, 11101, 11102, 10094],
    MORPHO: [11100, 11101, 11102, 10093],
    STARTEK: [11100, 11101, 11102, 8005],
  };

  //  CHECK ACTIVE RD SERVICE PORT
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

        //  VALID RD SERVICE FOUND
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

  //  CAPTURE BIOMETRIC
  const captureBiometric = async (deviceType) => {
    if (setShowDeviceModal) {
      setShowDeviceModal(false);
    }
    setIsBiometricLoading(true);

    //  CHECK RD SERVICE
    const rdCheck = await checkRDService(deviceType);

    //  REQUEST METHOD
    let method = "CAPTURE";

    if (deviceType === "MORPHO") {
      method = "CAPTURE";
    }

    // RD SERVICE NOT FOUND
    if (!rdCheck.status) {
      setIsBiometricLoading(false);

      setRdError({
        show: true,
        message: `${deviceType} RD Service is not running.`,
      });

      return;
    }

    //  ACTIVE PORT
    const rdPort = rdCheck.port;

    console.log("ACTIVE RD PORT:", rdPort);

    try {
      let url = "";
      let xmlRequest = "";

      //  MANTRA CONFIG
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
              env="${process.env.PID_ENV}"
              wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="
            />
          </PidOptions>
        `;
      }

      //  MORPHO CONFIG
      else if (deviceType === "MORPHO") {
        url = `http://127.0.0.1:${rdPort}/capture`;

        xmlRequest = `<PidOptions ver="1.0"><Opts env="${process.env.PID_ENV}" fCount="1" fType="2" format="0" pidVer="2.0" timeout="10000" otp="" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh=""/></PidOptions>`;
      }

      //  STARTEK CONFIG
      else if (deviceType === "STARTEK") {
        url = `http://127.0.0.1:${rdPort}/rd/capture`;

        xmlRequest = `
          <PidOptions ver="1.0">
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
              wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="
              posh=""
            />
          </PidOptions>
        `;
      }

      console.log("CAPTURE URL:", url);
      console.log("PID XML:", xmlRequest);

      const xhr = new XMLHttpRequest();

      //  OPEN REQUEST
      xhr.open(method, url, true);

      //  RESPONSE
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

          // SUCCESS
          if (errCode === "0") {
            if (setIsBiometricVerified) setIsBiometricVerified(true);

            if (onCaptureSuccess) {
              onCaptureSuccess(result);
            }
          }

          // FAILED
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

      // CONNECTION ERROR
      xhr.onerror = function () {
        console.error("XHR ERROR");

        setRdError({
          show: true,
          message:
            "Unable to connect to RD service. Please ensure device is connected.",
        });

        setIsBiometricLoading(false);
      };

      //  SEND REQUEST
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

  return { captureBiometric, isBiometricLoading, rdError, setRdError };
};
