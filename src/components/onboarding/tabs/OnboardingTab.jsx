import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import MobileOtpSection from "../sections/MobileOtpSection";
import OnboardingHeader from "../ui/OnboardingHeader";
import onboardingService from "../../../services/onboardingService";
import ProductSelection from "../sections/ProductSelection";
import IdentityInputs from "../sections/IdentityInputs";
import ConsentsSection from "../sections/ConsentsSection";
import LanguageSelection from "../sections/LanguageSelection";
import BiometricSection from "../sections/BiometricSection";

const OnboardingTab = ({
  onNext,
  isVerificationComplete,
  setIsVerificationComplete,
  isMobileVerified,
  setIsMobileVerified,
  showOtp,
  setShowOtp,
  mobileNumber,
  setMobileNumber,
  emailId,
  setEmail,
  isEmailVerified,
  setIsEmailVerified,
  showEmailOtp,
  setShowEmailOtp,
  applicationNumber,
  externalAppRefNumber,
  setApplicationNumber,
  setExternalAppRefNumber,
}) => {
  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const productType = watch("onboarding.productType");
  const language = watch("onboarding.language");
  const pan = watch("onboarding.pan") || "";
  const aadhaar = watch("onboarding.aadhaar") || "";

  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);

  const [documentStatus, setDocumentStatus] = useState("idle"); // idle, success, mismatch
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [isVerifyingDocuments, setIsVerifyingDocuments] = useState(false);
  
  const [consentsList, setConsentsList] = useState([]);
  const [selectedConsents, setSelectedConsents] = useState({});
  const [panAadhaarFailed, setPanAadhaarFailed] = useState(false);
  const [panAadhaarSuccess, setPanAadhaarSuccess] = useState(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState("");

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const langCode = language === "Hindi" ? "oth" : "eng";
        const res = await onboardingService.getConsents(langCode);
        if (res.status === "SUCCESS" && res.response?.consents) {
          setConsentsList(res.response.consents);
          const initial = {};
          res.response.consents.forEach(c => {
            initial[c.consentTextCode] = false;
          });
          setSelectedConsents(initial);
        }
      } catch (err) {
        console.error("Failed to fetch consents", err);
      }
    };
    fetchConsents();
  }, [language]);

  const isAllConsentsSelected = consentsList.length > 0 && consentsList.every(c => selectedConsents[c.consentTextCode]);

  const captureBiometric = async () => {
    setIsBiometricLoading(true);
    setPanAadhaarFailed(false);
    setPanAadhaarSuccess(false);
    setVerificationErrorMessage("");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const payload = {
        applicationNumber,
        externalAppRefNumber,
        panNo: pan,
        aadharNo: aadhaar,
        bioMetricData: "Finger print XML", // Placeholder for biometric data
        consents: consentsList
          .filter(c => selectedConsents[c.consentTextCode])
          .map(c => ({
            consent: c.text1,
            code: c.consentTextCode,
            // version: "1",
            method: "checkbox"
          }))
      };

      console.log("DEBUG: /pan-aadhar-verify Request Payload", JSON.stringify(payload, null, 2));
      
      const response = await onboardingService.panAadhaarVerify(payload);
      
      console.log("DEBUG: /pan-aadhar-verify Response", JSON.stringify(response, null, 2));

      if (response.status === "SUCCESS") {
        setIsBiometricVerified(true);
        setDocumentStatus("success");
        setPanAadhaarSuccess(true);
      } else {
        setIsBiometricVerified(false);
        setDocumentStatus("mismatch");
        setPanAadhaarFailed(true);
        setVerificationErrorMessage(response.message || "Identity verification failed.");
      }
    } catch (error) {
      console.error("DEBUG: /pan-aadhar-verify Error", error);
      setIsBiometricVerified(false);
      setDocumentStatus("mismatch");
      setPanAadhaarFailed(true);
      setVerificationErrorMessage(error.message || "An error occurred during verification.");
    } finally {
      setIsBiometricLoading(false);
    }
  };


  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailApiLoading, setIsEmailApiLoading] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);

  const handleGenerateOtp = async () => {
    if (mobileNumber.length >= 10) {
      setIsApiLoading(true);
      try {
        const response = await onboardingService.generateOtp(mobileNumber, emailId);
        
        // Always try to capture IDs if returned, as they might be needed for other retries
        if (response.applicationNumber) setApplicationNumber(response.applicationNumber);
        if (response.externalAppRefNumber) setExternalAppRefNumber(response.externalAppRefNumber);

        if (response.status === "SUCCESS") {
          setShowOtp(true);
        } else {
          alert(response.message || "Failed to generate mobile OTP. Please try again.");
        }
      } catch (error) {
        alert(error.message || "An error occurred while generating OTP.");
      } finally {
        setIsApiLoading(false);
      }
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  const handleVerifyMobileOtp = async (otp) => {
    setIsVerifyingOtp(true);
    try {
      const response = await onboardingService.verifyOtp({
        applicationNumber,
        externalAppRefNumber,
        otp,
        mobileNumber,
      });

      if (response.status === "SUCCESS") {
        setIsMobileVerified(true);
      } else {
        alert(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert(error.message || "An error occurred while verifying OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!applicationNumber) {
      alert("Please generate mobile OTP first to start the application.");
      return;
    }
    if (emailId.length > 0) {
      setIsEmailApiLoading(true);
      try {
        const response = await onboardingService.sendEmailOtp({
          emailId: emailId,
          applicationNumber,
          externalAppRefNumber,
        });

        if (response.status === "SUCCESS") {
          setShowEmailOtp(true);
        } else {
          alert(response.message || "Failed to send email OTP. Please try again.");
        }
      } catch (error) {
        alert(error.message || "An error occurred while sending email OTP.");
      } finally {
        setIsEmailApiLoading(false);
      }
    }
  };

  const handleVerifyEmailOtp = async (otp) => {
    setIsVerifyingEmailOtp(true);
    try {
      console.log("DEBUG: Verifying Email OTP", { 
        otp, 
        emailId: emailId, 
        applicationNumber, 
        externalAppRefNumber 
      });
      const response = await onboardingService.verifyEmailOtp({
        otp,
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });

      if (response.status === "SUCCESS") {
        setIsEmailVerified(true);
      } else {
        alert(response.message || "Invalid Email OTP. Please try again.");
      }
    } catch (error) {
      alert(error.message || "An error occurred while verifying email OTP.");
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleResendMobileOtp = async () => {
    setIsApiLoading(true);
    try {
      const response = await onboardingService.resendOtp({
        applicationNumber,
      });

      if (response.status === "SUCCESS") {
        alert("Mobile OTP resent successfully.");
      } else {
        alert(response.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      alert(error.message || "An error occurred while resending OTP.");
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    setIsEmailApiLoading(true);
    try {
      console.log("DEBUG: Resending Email OTP", { emailId, applicationNumber });
      const response = await onboardingService.resendEmailOtp({
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });

      if (response.status === "SUCCESS") {
        alert("Email OTP resent successfully.");
      } else {
        alert(response.message || "Failed to resend email OTP. Please try again.");
      }
    } catch (error) {
      alert(error.message || "An error occurred while resending email OTP.");
    } finally {
      setIsEmailApiLoading(false);
    }
  };

  const handleAadhaarChange = (e) => {
    const val = e.target.value;
    let chars = "";

    if (showAadhaar) {
      chars = val.replace(/[^0-9]/g, "").slice(0, 12);
    } else {
      const maskedVal = formatAadhaar(aadhaar).replace(/[0-9]/g, "X");
      if (val.length > maskedVal.length) {
        const added = val.slice(-1);
        if (/[0-9]/.test(added)) {
          chars = (aadhaar + added).slice(0, 12);
        } else {
          chars = aadhaar;
        }
      } else if (val.length < maskedVal.length) {
        chars = aadhaar.slice(0, -1);
      } else {
        chars = aadhaar;
      }
    }
    setValue("onboarding.aadhaar", chars, { shouldValidate: false });
    if (documentStatus !== "idle") setDocumentStatus("idle");
    if (panAadhaarFailed || panAadhaarSuccess) {
      setPanAadhaarFailed(false);
      setPanAadhaarSuccess(false);
      setVerificationErrorMessage("");
    }
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase();
    const chars = val.replace(/[^A-Z0-9]/g, "");
    setValue("onboarding.pan", chars.slice(0, 10), { shouldValidate: false });
    if (documentStatus !== "idle") setDocumentStatus("idle");
    if (panAadhaarFailed || panAadhaarSuccess) {
      setPanAadhaarFailed(false);
      setPanAadhaarSuccess(false);
      setVerificationErrorMessage("");
    }
  };

  const handleBlur = (field) => {
    trigger(`onboarding.${field}`);
  };

  const formatAadhaar = (val) => {
    if (!val) return "";
    const parts = val.match(/.{1,4}/g);
    return parts ? parts.join("-") : val;
  };

  const displayAadhaar = showAadhaar
    ? formatAadhaar(aadhaar)
    : aadhaar
      ? formatAadhaar(aadhaar).replace(/[0-9]/g, "X")
      : "";

  const languages = [
    "English",
    "Hindi"
  ];

  const handleProceed = async () => {
    const isValid = await trigger("onboarding");
    if (isValid && panAadhaarSuccess) {
      onNext();
    } else if (!panAadhaarSuccess) {
      alert("Please complete biometric verification successfully first.");
    }
  };



  if (!isVerificationComplete) {
    return (
      <MobileOtpSection
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        email={emailId}
        setEmail={setEmail}
        showMobileOtp={showOtp}
        handleGenerateMobileOtp={handleGenerateOtp}
        isMobileVerified={isMobileVerified}
        setIsMobileVerified={setIsMobileVerified}
        showEmailOtp={showEmailOtp}
        isEmailVerified={isEmailVerified}
        setIsEmailVerified={setIsEmailVerified}
        onProceed={() => setIsVerificationComplete(true)}
        isApiLoading={isApiLoading}
        isVerifyingOtp={isVerifyingOtp}
        handleVerifyMobileOtp={handleVerifyMobileOtp}
        isEmailApiLoading={isEmailApiLoading}
        handleGenerateEmailOtp={handleSendEmailOtp}
        isVerifyingEmailOtp={isVerifyingEmailOtp}
        handleVerifyEmailOtp={handleVerifyEmailOtp}
        handleResendMobileOtp={handleResendMobileOtp}
        handleResendEmailOtp={handleResendEmailOtp}
        applicationNumber={applicationNumber}
      />
    );
  }

  return (
    <div className="w-full flex-col px-4 md:px-8 pt-2 pb-0 text-black animate-in fade-in duration-500 max-w-7xl mx-auto">
      <OnboardingHeader />

      <ProductSelection
        productType={productType}
        setProductType={(val) => setValue("onboarding.productType", val)}
      />

      <IdentityInputs
        showPan={showPan}
        setShowPan={setShowPan}
        showAadhaar={showAadhaar}
        setShowAadhaar={setShowAadhaar}
        aadhaar={aadhaar}
        handleAadhaarChange={handleAadhaarChange}
        handlePanChange={handlePanChange}
        handleBlur={handleBlur}
        displayAadhaar={displayAadhaar}
        pan={pan}
        errors={errors.onboarding}
      />

      <ConsentsSection
        consents={consentsList}
        selectedConsents={selectedConsents}
        setSelectedConsents={setSelectedConsents}
        errors={errors.onboarding}
      />

      <LanguageSelection
        language={language}
        setLanguage={(val) => setValue("onboarding.language", val)}
        languages={languages}
      />

      {/* Biometric Integration Step */}
      <BiometricSection
        isBiometricVerified={isBiometricVerified}
        captureBiometric={captureBiometric}
        isBiometricLoading={isBiometricLoading}
        aadhaar={aadhaar}
        pan={pan}
        documentStatus={documentStatus}
        disabled={!isAllConsentsSelected}
      />

      {/* Aadhaar/PAN API Verification Status */}
      {panAadhaarFailed && (
        <div className="w-full max-w-4xl mx-auto mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white shrink-0 font-bold text-sm mt-0.5">
            !
          </div>
          <div className="flex flex-col">
            <p className="text-red-800 font-bold text-[15px]">
              Verification Failed
            </p>
            <p className="text-red-600 text-[13.5px] mt-0.5">
              {verificationErrorMessage || "The details provided do not match our records."}
            </p>
          </div>
        </div>
      )}

      {panAadhaarSuccess && (
        <div className="w-full max-w-4xl mx-auto mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white shrink-0 font-bold text-sm mt-0.5">
            ✓
          </div>
          <div className="flex flex-col">
            <p className="text-green-800 font-bold text-[15px]">
              Verification Passed
            </p>
            <p className="text-green-600 text-[13.5px] mt-0.5">
              Aadhaar and PAN details have been successfully verified.
            </p>
          </div>
        </div>
      )}

      {/* Final Proceed */}
      <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
        <ProceedButton
          onClick={handleProceed}
          disabled={
            !panAadhaarSuccess || isVerifyingDocuments || !isAllConsentsSelected
          }
          className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default OnboardingTab;
