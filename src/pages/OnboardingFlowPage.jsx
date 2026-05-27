import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HorizontalLinearAlternativeLabelStepper from "../components/common/HorizontalLinearAlternativeLabelStepper";
import OnboardingTab from "../components/onboarding/tabs/OnboardingTab";
import AadhaarDetailsTab from "../components/onboarding/tabs/AadhaarDetailsTab";
import FamilyFinancialDetailsTab from "../components/onboarding/tabs/FamilyFinancialDetailsTab";
import NomineeDetailsTab from "../components/onboarding/tabs/NomineeDetailsTab";
import ApplicationReviewTab from "../components/onboarding/tabs/ApplicationReviewTab";
import { onboardingSchema } from "../schema/onboardingSchema";
import AgentOtpModal from "../components/onboarding/sections/AgentOtpModal";

const STEPS = [
  "Onboarding",
  "Aadhaar Details",
  "Family & Financial Details",
  "Nominee Details",
  "Review & Submit",
];

const OnboardingFlowPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  const [isAgentVerified, setIsAgentVerified] = useState(
    sessionStorage.getItem("agentVerified") === "true",
  );

  const [showAgentOtpModal, setShowAgentOtpModal] = useState(
    sessionStorage.getItem("agentVerified") !== "true",
  );

  const next = () => {
    setCurrentStep((s) => {
      const nextStep = Math.min(s + 1, STEPS.length);
      setMaxStepReached((max) => Math.max(max, nextStep));
      return nextStep;
    });
  };

  const handleAgentVerified = () => {
    setIsAgentVerified(true);
    setShowAgentOtpModal(false);
  };

  const handleNewApplication = () => {
    
    localStorage.clear();
    sessionStorage.clear();

    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    window.location.href = "/jpb/";
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const [isVerificationComplete, setIsVerificationComplete] = useState(
    sessionStorage.getItem("isVerificationComplete") === "true",
  );
  const [isMobileVerified, setIsMobileVerified] = useState(
    sessionStorage.getItem("isMobileVerified") === "true",
  );
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(
    sessionStorage.getItem("mobileNumber") || "",
  );
  const [emailId, setEmail] = useState(sessionStorage.getItem("emailId") || "");
  const [isEmailVerified, setIsEmailVerified] = useState(
    sessionStorage.getItem("isEmailVerified") === "true",
  );
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const [applicationNumber, setApplicationNumber] = useState(
    sessionStorage.getItem("applicationNumber") || "",
  );
  const [externalAppRefNumber, setExternalAppRefNumber] = useState(
    sessionStorage.getItem("externalAppRefNumber") || "",
  );

  const [kycData, setKycData] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("isVerificationComplete", isVerificationComplete);
    sessionStorage.setItem("isMobileVerified", isMobileVerified);
    sessionStorage.setItem("mobileNumber", mobileNumber);
    sessionStorage.setItem("emailId", emailId);
    sessionStorage.setItem("isEmailVerified", isEmailVerified);
    sessionStorage.setItem("applicationNumber", applicationNumber);
    sessionStorage.setItem("externalAppRefNumber", externalAppRefNumber);
  }, [
    isVerificationComplete,
    isMobileVerified,
    mobileNumber,
    emailId,
    isEmailVerified,
    applicationNumber,
    externalAppRefNumber,
  ]);

  const methods = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      onboarding: {
        productType: "savings",
        aepsConsent: "yes",
        language: "English",
        pan: "",
        aadhaar: "",
        // fatcaDeclared: false,
        subscriptionId: localStorage.getItem("selectedSubscriptionId") || "",
        schemeCode: localStorage.getItem("selectedSchemeCode") || "",
        network: localStorage.getItem("selectedNetwork") || "",
        region: localStorage.getItem("selectedRegion") || "",
        cardType: localStorage.getItem("selectedCardType") || "",
        tierType: localStorage.getItem("selectedTierType") || "",
        issuanceFee: localStorage.getItem("selectedIssuanceFee") || "",
      },
      applicant: {
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dob: "",
        maritalStatus: "Single",
      },
      family: {
        fatherName: { firstName: "", middleName: "", lastName: "" },
        motherName: { firstName: "", middleName: "", lastName: "" },
        spouseName: { firstName: "", middleName: "", lastName: "" },
      },
      nominee: {
        provide: "Yes",
        relationship: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        nomineeConsentAccepted: false,
      },
      guardian: {
        relationship: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
      },
      financial: {
        occupation: "",
        sourceOfIncome: "",
        annualIncome: "",
      },
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col px-3 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-0 text-black font-sans">
      <AgentOtpModal
        isOpen={showAgentOtpModal}
        onVerified={handleAgentVerified}
      />

      {isVerificationComplete && (
        <div className="w-full flex justify-end items-center gap-3 mb-6 mt-2 animate-in fade-in zoom-in duration-500">
          <button
            onClick={handleNewApplication}
            className="font-bold text-red-700 bg-red-50 border border-red-200 px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[14px] tracking-wider shadow-sm hover:bg-red-100 hover:text-red-800 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Start New Application
          </button>
          <div className="font-bold text-sand-350 bg-sand-500 border border-brown-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[14px] tracking-wider shadow-md flex items-center gap-3">
            <span className="opacity-90">App No:</span>
            <span>{applicationNumber}</span>
          </div>
        </div>
      )}

      {isAgentVerified && (
        <HorizontalLinearAlternativeLabelStepper
          activeStep={currentStep - 1}
          steps={STEPS}
          onStepClick={(step) => {
            const IS_TESTING = true;
            if (IS_TESTING || step <= maxStepReached) {
              setCurrentStep(step);
            }
          }}
        />
      )}

      <FormProvider {...methods}>
        {currentStep === 1 && (
          <OnboardingTab
            onNext={next}
            setKycData={setKycData}
            isVerificationComplete={isVerificationComplete}
            setIsVerificationComplete={setIsVerificationComplete}
            isMobileVerified={isMobileVerified}
            setIsMobileVerified={setIsMobileVerified}
            showOtp={showOtp}
            setShowOtp={setShowOtp}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            emailId={emailId}
            setEmail={setEmail}
            isEmailVerified={isEmailVerified}
            setIsEmailVerified={setIsEmailVerified}
            showEmailOtp={showEmailOtp}
            setShowEmailOtp={setShowEmailOtp}
            applicationNumber={applicationNumber}
            externalAppRefNumber={externalAppRefNumber}
            setApplicationNumber={setApplicationNumber}
            setExternalAppRefNumber={setExternalAppRefNumber}
          />
        )}
        {currentStep === 2 && (
          <AadhaarDetailsTab onNext={next} kycData={kycData} />
        )}
        {currentStep === 3 && <FamilyFinancialDetailsTab onNext={next} />}
        {currentStep === 4 && <NomineeDetailsTab onNext={next} />}
        {currentStep === 5 && (
          <ApplicationReviewTab goToStep={setCurrentStep} />
        )}
      </FormProvider>
    </div>
  );
};

export default OnboardingFlowPage;
