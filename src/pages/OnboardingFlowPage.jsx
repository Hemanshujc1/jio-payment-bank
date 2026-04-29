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

  const [isVerificationComplete, setIsVerificationComplete] = useState(
    sessionStorage.getItem("isVerificationComplete") === "true"
  );
  const [isMobileVerified, setIsMobileVerified] = useState(
    sessionStorage.getItem("isMobileVerified") === "true"
  );
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(
    sessionStorage.getItem("mobileNumber") || ""
  );
  const [emailId, setEmail] = useState(
    sessionStorage.getItem("emailId") || ""
  );
  const [isEmailVerified, setIsEmailVerified] = useState(
    sessionStorage.getItem("isEmailVerified") === "true"
  );
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const [applicationNumber, setApplicationNumber] = useState(
    sessionStorage.getItem("applicationNumber") || ""
  );
  const [externalAppRefNumber, setExternalAppRefNumber] = useState(
    sessionStorage.getItem("externalAppRefNumber") || ""
  );

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
    <div className="w-full max-w-7xl mx-auto flex flex-col px-3 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-0 text-black font-sans">
      {isVerificationComplete && (
        <div className="w-full flex justify-end mb-6 mt-2 animate-in fade-in zoom-in duration-500">
          <div className="font-bold text-sand-350 bg-sand-500 border border-brown-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[14px] tracking-wider shadow-md flex items-center gap-3">
            <span className="opacity-90">App No:</span>
            <span>{applicationNumber}</span>
          </div>
        </div>
      )}

      <HorizontalLinearAlternativeLabelStepper
        activeStep={currentStep - 1}
        steps={STEPS}
        onStepClick={(step) => {
          // Allow going back to any previous step
          if (step < currentStep) {
            setCurrentStep(step);
            return;
          }
          
          // // Prevent going forward if OTP is not verified
          // if (!isMobileVerified || (emailId.length > 0 && !isEmailVerified)) {
          //   alert("Please verify your OTP to proceed to this step.");
          //   return;
          // }

          // If verified, allow navigation
          setCurrentStep(step);
        }}
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
