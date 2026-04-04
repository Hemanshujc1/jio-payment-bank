import React, { useState } from 'react';

// Sub-components
import ReviewAadhaarDetails from './onboarding/ReviewAadhaarDetails';
import ReviewFamilyDetails from './onboarding/ReviewFamilyDetails';
import ReviewFinancialDetails from './onboarding/ReviewFinancialDetails';
import ReviewNomineeDetails from './onboarding/ReviewNomineeDetails';
import ReviewTermsConditions from './onboarding/ReviewTermsConditions';
import SuccessOverlay from './onboarding/SuccessOverlay';

const ApplicationReviewTab = ({ goToStep }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const Divider = () => (
    <hr className="border-t border-[#A89885] w-full my-8 opacity-60" />
  );

  const handleSubmit = () => {
    if (termsAccepted) {
      setIsSuccess(true);
    } else {
      alert("Please accept the Terms & Conditions to proceed.");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-6xl mx-auto animate-in fade-in duration-500">
        <h2 className="font-bold text-[22px] tracking-wide mb-10 text-center">
          Application Review
        </h2>

        {/* Aadhaar Details */}
        <ReviewAadhaarDetails onEdit={() => goToStep(2)} />
        
        <Divider />

        {/* Family Details */}
        <ReviewFamilyDetails onEdit={() => goToStep(3)} />

        <Divider />

        {/* Financial Details */}
        <ReviewFinancialDetails onEdit={() => goToStep(3)} />

        <Divider />

        {/* Nominee Details */}
        <ReviewNomineeDetails onEdit={() => goToStep(4)} />

        <Divider />

        {/* Terms & Conditions and Submit */}
        <ReviewTermsConditions
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          onSubmit={handleSubmit}
        />
      </div>

      {isSuccess && <SuccessOverlay />}
    </>
  );
};

export default ApplicationReviewTab;
 