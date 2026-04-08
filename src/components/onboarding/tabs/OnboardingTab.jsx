import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import MobileOtpSection from "../sections/MobileOtpSection";
import OnboardingHeader from "../ui/OnboardingHeader";
import ProductSelection from "../sections/ProductSelection";
import IdentityInputs from "../sections/IdentityInputs";
import ConsentsSection from "../sections/ConsentsSection";
import LanguageSelection from "../sections/LanguageSelection";
import { FaFingerprint } from "react-icons/fa";

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
  email,
  setEmail,
  isEmailVerified,
  setIsEmailVerified,
  showEmailOtp,
  setShowEmailOtp,
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
      onNext();
    }
  };

  if (!isVerificationComplete) {
    return (
      <MobileOtpSection
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        email={email}
        setEmail={setEmail}
        showMobileOtp={showOtp}
        handleGenerateMobileOtp={handleGenerateOtp}
        isMobileVerified={isMobileVerified}
        setIsMobileVerified={setIsMobileVerified}
        showEmailOtp={showEmailOtp}
        handleGenerateEmailOtp={() => {
          if (email.length > 0) setShowEmailOtp(true);
        }}
        isEmailVerified={isEmailVerified}
        setIsEmailVerified={setIsEmailVerified}
        onProceed={() => setIsVerificationComplete(true)}
      />
    );
  }

  return (
    <div className="w-full flex-col px-4 md:px-8 py-4 text-black animate-in fade-in duration-500 max-w-7xl mx-auto">
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
      <div className="w-full flex items-center justify-center p-8 mt-10 mb-6 max-w-4xl mx-auto">
        {/* <h3 className="text-[18px] font-bold text-gray-900 mb-6 tracking-tight">Biometric Verification</h3> */}
        
        {!isBiometricVerified ? (
          <button 
            type="button"
            onClick={captureBiometric}
            disabled={isBiometricLoading || aadhaar.length !== 12 || pan.length !== 10}
            className={`w-full max-w-[280px] h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
               ${(isBiometricLoading || aadhaar.length !== 12 || pan.length !== 10) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-sand-500 text-sand-350 border border-brown-700 hover:bg-brown-800'}`}
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
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="text-green-700 font-black text-[17px] tracking-wide">Biometric Verified Successfully</p>
            </div>
          )
        )}
      </div>

      {/* Verification Logic Block */}
      <div className="w-full flex flex-col mb-10 -mt-2 px-2 xl:px-0">
        {documentStatus === "mismatch" && (
          <div className="flex flex-col gap-6 p-6 animate-in zoom-in-95 duration-300 ">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shrink-0 font-bold">!</div>
              <p className="text-red-700 font-bold text-[15px] pt-1">
                Verification Failed: Details do not match our system records. Please manually upload your supporting documents below to proceed.
              </p>
            </div>
            
            <div className="flex flex-col pl-0 md:pl-11 mt-2">
              <div className="flex flex-col gap-3 md:w-1/2">
                <label className="font-bold text-gray-800 text-[14.5px]">Upload PAN Document <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => setPanFile(e.target.files[0] || null)}
                    className="block w-fit text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border file:border-brown-700 file:text-[13.5px] file:font-extrabold file:bg-sand-500 file:text-sand-350 hover:file:bg-brown-800 file:cursor-pointer file:transition-colors bg-white rounded-xl border border-gray-200 outline-none focus-within:border-gray-800 p-1.5 shadow-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Final Proceed */}
      <div className="flex justify-center mb-10 pt-2">
        <ProceedButton 
           onClick={handleProceed} 
           disabled={!isBiometricVerified || (documentStatus === "mismatch" && !panFile)}
           className="w-47.5 shadow-xl hover:scale-105 transform transition-transform" 
        />
      </div>
    </div>
  );
};

export default OnboardingTab;
