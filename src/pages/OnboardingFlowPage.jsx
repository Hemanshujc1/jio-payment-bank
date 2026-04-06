import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HorizontalLinearAlternativeLabelStepper from "../components/HorizontalLinearAlternativeLabelStepper";
import OnboardingTab from "../components/OnboardingTab";
import AadhaarDetailsTab from "../components/AadhaarDetailsTab";
import FamilyFinancialDetailsTab from "../components/FamilyFinancialDetailsTab";
import NomineeDetailsTab from "../components/NomineeDetailsTab";
import ApplicationReviewTab from "../components/ApplicationReviewTab";
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

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

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
    <div className="w-full flex flex-col px-4 md:px-8 py-8 text-black font-sans">
      <HorizontalLinearAlternativeLabelStepper
        activeStep={currentStep - 1}
        steps={STEPS}
        onStepClick={setCurrentStep}
      />

      <FormProvider {...methods}>
        {currentStep === 1 && (
          <OnboardingTab
            onNext={next}
            isOtpVerified={isOtpVerified}
            setIsOtpVerified={setIsOtpVerified}
            showOtp={showOtp}
            setShowOtp={setShowOtp}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
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
