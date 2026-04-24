import React, { useState } from "react";
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
import ManualVerificationSection from "../sections/ManualVerificationSection";

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
  const aepsConsent = watch("onboarding.aepsConsent");
  const language = watch("onboarding.language");
  const agreeTerms = watch("onboarding.agreeTerms");
  const agreeAeps = watch("onboarding.agreeAeps");
  const agreeSweep = watch("onboarding.agreeSweep");
  const fatcaDeclared = watch("onboarding.fatcaDeclared");
  const pan = watch("onboarding.pan") || "";
  const aadhaar = watch("onboarding.aadhaar") || "";

  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);

  const [documentStatus, setDocumentStatus] = useState("idle"); // idle, success, mismatch
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [panFile, setPanFile] = useState(null);
  const [isVerifyingDocuments, setIsVerifyingDocuments] = useState(false);

  const VERIFIED_AADHAAR = "123412341234";
  const VERIFIED_PAN = "ABCDE1234F";

  const captureBiometric = () => {
    setIsBiometricLoading(true);
    setTimeout(() => {
      setIsBiometricLoading(false);
      setIsBiometricVerified(true);

      // Auto verify after biometric
      if (aadhaar.length === 12 && pan.length === 10) {
        if (aadhaar === VERIFIED_AADHAAR && pan === VERIFIED_PAN) {
          setDocumentStatus("success");
        } else {
          setDocumentStatus("mismatch");
        }
      } else {
        setDocumentStatus("mismatch");
      }
    }, 2500); // 2.5 seconds fake load
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
      // Logic for masked input: detect added/removed digits
      const maskedVal = formatAadhaar(aadhaar).replace(/[0-9]/g, "X");
      if (val.length > maskedVal.length) {
        // User added a character (likely at the end)
        const added = val.slice(-1);
        if (/[0-9]/.test(added)) {
          chars = (aadhaar + added).slice(0, 12);
        } else {
          chars = aadhaar;
        }
      } else if (val.length < maskedVal.length) {
        // User deleted a character
        chars = aadhaar.slice(0, -1);
      } else {
        chars = aadhaar;
      }
    }
    setValue("onboarding.aadhaar", chars, { shouldValidate: false });
    if (documentStatus !== "idle") setDocumentStatus("idle");
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase();
    const chars = val.replace(/[^A-Z0-9]/g, "");
    setValue("onboarding.pan", chars.slice(0, 10), { shouldValidate: false });
    if (documentStatus !== "idle") setDocumentStatus("idle");
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
    "Hindi",
    "Marathi",
    "Bengali",
    "Kannada",
    "Telugu",
    "Tamil",
    "Malayalam",
  ];

  const handleProceed = async () => {
    if (documentStatus === "idle") {
      alert("Please capture your biometric first to verify documents.");
      return;
    }

    if (documentStatus === "mismatch" && !panFile) {
      alert("Please upload your PAN Document to proceed.");
      return;
    }

    const isValid = await trigger("onboarding");
    if (isValid && isBiometricVerified) {
      setIsVerifyingDocuments(true);
      try {
        const payload = {
          applicationNumber,
          externalAppRefNumber,
          panNo: pan,
          aadharNo: aadhaar,
          bioMetricData: "Finger print XML", // Placeholder for biometric data
          consents: [
            {
              consent: "Hello, I verify for all of the mentioned B88",
              code: "B88",
              version: "1",
              method: "checkbox"
            },
            {
              consent: "Hello, I verify for all of the mentioned C50",
              code: "C50",
              version: "1",
              method: "checkbox"
            }
          ]
        };

        const response = await onboardingService.panAadhaarVerify(payload);

        if (response.status === "SUCCESS") {
          // If the backend returned a new application/external ref number, we should probably update it,
          // but we'll stick to our current ones unless needed.
          onNext();
        } else {
          alert(response.message || "Document verification failed. Please try again.");
        }
      } catch (error) {
        alert(error.message || "An error occurred during document verification.");
      } finally {
        setIsVerifyingDocuments(false);
      }
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
        disabled={documentStatus !== "idle"}
      />

      <ConsentsSection
        agreeTerms={agreeTerms}
        setAgreeTerms={(val) => setValue("onboarding.agreeTerms", val)}
        agreeAeps={agreeAeps}
        setAgreeAeps={(val) => setValue("onboarding.agreeAeps", val)}
        agreeSweep={agreeSweep}
        setAgreeSweep={(val) => setValue("onboarding.agreeSweep", val)}
        fatcaDeclared={fatcaDeclared}
        setFatcaDeclared={(val) => setValue("onboarding.fatcaDeclared", val)}
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
      />

      {/* Verification Logic Block */}
      <ManualVerificationSection
        documentStatus={documentStatus}
        setPanFile={setPanFile}
      />

      {/* Final Proceed */}
      <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
        <ProceedButton
          onClick={handleProceed}
          disabled={
            !isBiometricVerified || (documentStatus === "mismatch" && !panFile) || isVerifyingDocuments
          }
          className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default OnboardingTab;
