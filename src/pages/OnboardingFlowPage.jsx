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

const STEPS = [
  "Onboarding",
  "Aadhaar Details",
  "Family & Financial Details",
  "Nominee Details",
  "Review & Submit",
];

const OnboardingFlowPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const [applicationNumber] = useState(() => Math.floor(100000000000 + Math.random() * 900000000000).toString());

  const methods = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      onboarding: {
        productType: "savings",
        aepsConsent: "yes",
        language: "English",
        agreeTerms: false,
        agreeAeps: false,
        agreeSweep: false,
        pan: "",
        aadhaar: "",
        fatcaDeclared: false,
      },
      applicant: {
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "Male",
        dob: "",
        maritalStatus: "Unmarried",
      },
      family: {
        fatherName: { firstName: "", middleName: "", lastName: "" },
        motherName: { firstName: "", middleName: "", lastName: "" },
        spouseName: { firstName: "", middleName: "", lastName: "" },
      },
      nominee: {
        provide: "Yes",
        relationship: "Sister",
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
      },
      guardian: {
        relationship: "Father",
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
      },
      financial: {
        occupation: "Retired",
        sourceOfIncome: "Savings",
        annualIncome: "5 Lakhs - 25 lakhs",
        fatcaDeclared: false,
      },
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col px-3 sm:px-6 md:px-8 py-4 sm:py-8 text-black font-sans">
      {isVerificationComplete && (
        <div className="w-full flex justify-end mb-4 -mt-2 sm:-mt-4 animate-in fade-in zoom-in duration-500">
          <div className="font-bold text-sand-350 bg-sand-500 border border-brown-700 px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-[13px] tracking-wider shadow-sm flex items-center gap-2">
            <span className="opacity-80">App No:</span>
            <span>{applicationNumber}</span>
          </div>
        </div>
      )}

      <HorizontalLinearAlternativeLabelStepper
        activeStep={currentStep - 1}
        steps={STEPS}
        onStepClick={setCurrentStep}
      />

      <FormProvider {...methods}>
        {currentStep === 1 && (
          <OnboardingTab
            onNext={next}
            isVerificationComplete={isVerificationComplete}
            setIsVerificationComplete={setIsVerificationComplete}
            isMobileVerified={isMobileVerified}
            setIsMobileVerified={setIsMobileVerified}
            showOtp={showOtp}
            setShowOtp={setShowOtp}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            email={email}
            setEmail={setEmail}
            isEmailVerified={isEmailVerified}
            setIsEmailVerified={setIsEmailVerified}
            showEmailOtp={showEmailOtp}
            setShowEmailOtp={setShowEmailOtp}
          />
        )}
        {currentStep === 2 && <AadhaarDetailsTab onNext={next} />}
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
