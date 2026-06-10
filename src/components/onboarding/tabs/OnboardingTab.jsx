import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import MobileOtpSection from "../sections/MobileOtpSection";
import OnboardingHeader from "../ui/OnboardingHeader";
import ProductSelection from "../sections/ProductSelection";
import IdentityInputs from "../sections/IdentityInputs";
import BiometricSection from "../sections/BiometricSection";
import ConsentModal from "../sections/ConsentModal";
import VerificationSuccess from "../ui/VerificationSuccess";
import { useToast } from "../../ui/Toast";
import { focusFirstError } from "../../../utils/validationUtils";
import { useConsents } from "../hooks/useConsents";
import { useOtpVerification } from "../hooks/useOtpVerification";
import { useBiometricVerification } from "../hooks/useBiometricVerification";


const OnboardingTab = ({
  onNext,
  setKycData,
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
  const { trigger, watch, setValue, formState: { errors } } = useFormContext();
  const toast = useToast();

  const productType = watch("onboarding.productType");
  const language = watch("onboarding.language");
  const pan = watch("onboarding.pan") || "";
  const aadhaar = watch("onboarding.aadhaar") || "";

  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isVerifyingDocuments] = useState(false);

  const {
    languagesList,
    consentsList,
    selectedConsents,
    setSelectedConsents,
    isAllConsentsSelected,
  } = useConsents(language, setValue);

  const {
    isApiLoading,
    isVerifyingOtp,
    isEmailApiLoading,
    isVerifyingEmailOtp,
    handleGenerateOtp,
    handleVerifyMobileOtp,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    handleResendMobileOtp,
    handleResendEmailOtp,
  } = useOtpVerification({
    mobileNumber,
    emailId,
    applicationNumber,
    externalAppRefNumber,
    setApplicationNumber,
    setExternalAppRefNumber,
    setShowOtp,
    setIsMobileVerified,
    setShowEmailOtp,
    setIsEmailVerified,
  });

  const {
    documentStatus,
    setDocumentStatus,
    isBiometricVerified,
    setIsBiometricVerified,
    panAadhaarFailed,
    setPanAadhaarFailed,
    panAadhaarSuccess,
    setPanAadhaarSuccess,
    setVerificationErrorMessage,
    captureBiometric,
  } = useBiometricVerification({
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
  });

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

  const handleAadhaarChange = (e) => {
    const val = e.target.value;
    let chars = "";

    if (showAadhaar) {
      chars = val.replace(/[^0-9]/g, "").slice(0, 16);
    } else {
      const maskedVal = formatAadhaar(aadhaar).replace(/[0-9]/g, "X");
      if (val.length > maskedVal.length) {
        const added = val.slice(-1);
        if (/[0-9]/.test(added)) {
          chars = (aadhaar + added).slice(0, 16);
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

  const handleProceed = async () => {
    const isValid = await trigger("onboarding");

    if (isValid && panAadhaarSuccess) {
      onNext();
    } else if (!isValid) {
      toast.error("Please enter valid information in all fields.");
      focusFirstError();
    } else if (!panAadhaarSuccess) {
      toast.warning(
        "Please complete biometric verification successfully first."
      );
    }
  };

  if (!isVerificationComplete) {
    return (
      <>
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
          onProceed={() => setShowConsentModal(true)}
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

        <ConsentModal
          isOpen={showConsentModal}
          onClose={() => {
            setShowConsentModal(false);
            setIsVerificationComplete(true);
          }}
          language={language}
          setLanguage={(val) => setValue("onboarding.language", val)}
          languagesList={languagesList}
          consentsList={consentsList}
          selectedConsents={selectedConsents}
          setSelectedConsents={setSelectedConsents}
          errors={errors.onboarding}
          isAllConsentsSelected={isAllConsentsSelected}
        />
      </>
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

      <BiometricSection
        isBiometricVerified={isBiometricVerified}
        setIsBiometricVerified={setIsBiometricVerified}
        aadhaar={aadhaar}
        pan={pan}
        documentStatus={documentStatus}
        onCaptureSuccess={captureBiometric}
        message="Biometric capture completed successfully. Please wait for identity verification to finish."
      />

      <VerificationSuccess isSuccess={panAadhaarSuccess} />

      <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
        <ProceedButton
          onClick={handleProceed}
          disabled={!panAadhaarSuccess || isVerifyingDocuments || !isAllConsentsSelected}
          className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default OnboardingTab;
