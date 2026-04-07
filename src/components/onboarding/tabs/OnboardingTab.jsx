import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import MobileOtpSection from "../sections/MobileOtpSection";
import OnboardingHeader from "../ui/OnboardingHeader";
import ProductSelection from "../sections/ProductSelection";
import IdentityInputs from "../sections/IdentityInputs";
import ConsentsSection from "../sections/ConsentsSection";
import LanguageSelection from "../sections/LanguageSelection";

const OnboardingTab = ({
  onNext,
  isOtpVerified,
  setIsOtpVerified,
  showOtp,
  setShowOtp,
  mobileNumber,
  setMobileNumber,
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

  const handleGenerateOtp = () => {
    if (mobileNumber.length >= 10) {
      setShowOtp(true);
    } else {
      alert("Please enter a valid mobile number.");
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
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase();
    const chars = val.replace(/[^A-Z0-9]/g, "");
    setValue("onboarding.pan", chars.slice(0, 10), { shouldValidate: false });
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
    : (aadhaar ? formatAadhaar(aadhaar).replace(/[0-9]/g, "X") : "");

  const languages = [
    "English",
    "Marathi",
    "Kannada",
    "Telugu",
    "Hindi",
    "Bengali",
    "Tamil",
  ];

  const handleProceed = async () => {
    const isValid = await trigger("onboarding");
    if (isValid) {
      onNext();
    }
  };

  if (!isOtpVerified) {
    return (
      <MobileOtpSection
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        showOtp={showOtp}
        handleGenerateOtp={handleGenerateOtp}
        setIsOtpVerified={setIsOtpVerified}
      />
    );
  }

  return (
    <div className="w-full flex-col px-4 md:px-8 py-4 text-black animate-in fade-in duration-500">
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
        agreeTerms={agreeTerms}
        setAgreeTerms={(val) => setValue("onboarding.agreeTerms", val)}
        aepsConsent={aepsConsent}
        setAepsConsent={(val) => setValue("onboarding.aepsConsent", val)}
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

      {/* Proceed */}
      <div className="flex justify-center mb-10 mt-6 pt-2">
        <ProceedButton onClick={handleProceed} className="w-47.5" />
      </div>
    </div>
  );
};

export default OnboardingTab;
