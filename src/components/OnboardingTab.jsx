import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "./ProceedButton";
import MobileOtpSection from "./onboarding/MobileOtpSection";
import OnboardingHeader from "./onboarding/OnboardingHeader";
import ProductSelection from "./onboarding/ProductSelection";
import IdentityInputs from "./onboarding/IdentityInputs";
import ConsentsSection from "./onboarding/ConsentsSection";
import LanguageSelection from "./onboarding/LanguageSelection";

const OnboardingTab = ({ onNext }) => {
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
  const pan = watch("onboarding.pan") || "";
  const aadhaar = watch("onboarding.aadhaar") || "";

  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleGenerateOtp = () => {
    if (mobileNumber.length >= 10) {
      setShowOtp(true);
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  const handleAadhaarChange = (e) => {
    const val = e.target.value;
    if (showAadhaar) {
      const chars = val.replace(/[^0-9]/g, "");
      setValue("onboarding.aadhaar", chars.slice(0, 12), { shouldValidate: true });
    } else {
      if (val.length < aadhaar.length) {
        setValue("onboarding.aadhaar", aadhaar.slice(0, val.length), { shouldValidate: true });
      } else {
        const added = val.slice(aadhaar.length);
        const addedChars = added.replace(/[^0-9]/g, "");
        setValue("onboarding.aadhaar", (aadhaar + addedChars).slice(0, 12), { shouldValidate: true });
      }
    }
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase();
    const chars = val.replace(/[^A-Z0-9]/g, "");
    setValue("onboarding.pan", chars.slice(0, 10), { shouldValidate: true });
  };

  const displayAadhaar = showAadhaar ? aadhaar : (aadhaar ? aadhaar.replace(/./g, "X") : "");

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
        displayAadhaar={displayAadhaar}
        pan={pan}
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
