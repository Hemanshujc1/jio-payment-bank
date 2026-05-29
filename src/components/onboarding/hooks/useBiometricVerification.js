import { useState } from "react";
import onboardingService from "../../../services/onboardingService";
import { cloneAddress, setAddressFields } from "../../../utils/addressUtils";
import { useToast } from "../../ui/Toast";

export const useBiometricVerification = ({
  pan,
  aadhaar,
  mobileNumber,
  emailId,
  applicationNumber,
  externalAppRefNumber,
  consentsList,
  selectedConsents,
  setValue,
  setKycData,
}) => {
  const toast = useToast();

  const [documentStatus, setDocumentStatus] = useState("idle");
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [panAadhaarFailed, setPanAadhaarFailed] = useState(false);
  const [panAadhaarSuccess, setPanAadhaarSuccess] = useState(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState("");

  const captureBiometric = async (biometricXml) => {
    setIsBiometricLoading(true);
    setPanAadhaarFailed(false);
    setPanAadhaarSuccess(false);
    setVerificationErrorMessage("");

    try {
      const finalConsents = consentsList
        .filter((c) => selectedConsents[c.consentTextCode])
        .map((c) => ({
          consent: c.text1,
          code: c.consentTextCode,
          version: "1",
          method: "checkbox",
        }));

      const payload = {
        applicationNumber,
        externalAppRefNumber,
        panNo: pan,
        aadharNo: aadhaar,
        bioMetricData: biometricXml,
        consents: finalConsents,
      };

      const response = await onboardingService.panAadhaarVerify(payload);

      console.log("DEBUG RESPONSE:", response);

      if (response.status === "SUCCESS") {
        setIsBiometricVerified(true);
        setDocumentStatus("success");
        setPanAadhaarSuccess(true);

        const apiData = response?.data?.persons;
        const aadhaarData = apiData?.aadhaar;
        const financialData = apiData?.financialDetails;

        const formattedKyc = {
          name: aadhaarData?.name,
          dob: aadhaarData?.dob,
          gender: aadhaarData?.gender,
          aadhaar: aadhaarData?.maskedAadhaar,
          address: aadhaarData?.address,
          photo: aadhaarData?.photo,
        };

        setKycData(formattedKyc);

        setValue("applicant.pan", financialData?.panNumber || "");
        setValue("applicant.aadhaar", aadhaarData?.maskedAadhaar || "");

        const fullName = aadhaarData?.name || "";
        const names = fullName.split(" ");
        setValue("applicant.firstName", names[0] || "");
        setValue("applicant.middleName", names.slice(1, -1).join(" ") || "");
        setValue("applicant.lastName", names[names.length - 1] || "");

        setValue("applicant.dob", aadhaarData?.dob || "");
        setValue("applicant.gender", aadhaarData?.gender === "M" ? "Male" : "Female");

        setValue("onboarding.consents", finalConsents);
        setValue("applicant.photo", aadhaarData?.photo || "");

        const rawAadhaarAddr = aadhaarData?.address || {};
        const aadhaarMasterAddr = cloneAddress(rawAadhaarAddr, "PERMANENT", false);
        setAddressFields(setValue, "applicant.aadhaarAddress", aadhaarMasterAddr, false);

        setValue("applicant.mobileNumber", mobileNumber || "");
        setValue("applicant.emailId", emailId || "");

        console.log(" FINAL APPLICANT STORED:", {
          pan: financialData?.panNumber,
          aadhaar: aadhaarData?.maskedAadhaar,
          mobile: mobileNumber,
          email: emailId,
        });

      } else {
        setIsBiometricVerified(false);
        setDocumentStatus("mismatch");
        setPanAadhaarFailed(true);
        const msg = response.error?.message || response.message || "Identity verification failed.";
        setVerificationErrorMessage(msg);
        toast.error(msg);
      }
    } catch (error) {
      console.error("ERROR:", error);
      setIsBiometricVerified(false);
      setDocumentStatus("mismatch");
      setPanAadhaarFailed(true);
      const msg = error.message || "An error occurred during verification.";
      setVerificationErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsBiometricLoading(false);
    }
  };

  return {
    documentStatus,
    setDocumentStatus,
    isBiometricLoading,
    isBiometricVerified,
    setIsBiometricVerified,
    panAadhaarFailed,
    setPanAadhaarFailed,
    panAadhaarSuccess,
    setPanAadhaarSuccess,
    verificationErrorMessage,
    setVerificationErrorMessage,
    captureBiometric,
  };
};
