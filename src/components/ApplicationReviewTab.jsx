import React, { useState } from 'react';

// Sub-components
import ReviewAadhaarDetails from './onboarding/ReviewAadhaarDetails';
import ReviewFamilyDetails from './onboarding/ReviewFamilyDetails';
import ReviewFinancialDetails from './onboarding/ReviewFinancialDetails';
import ReviewNomineeDetails from './onboarding/ReviewNomineeDetails';
import ReviewTermsConditions from './onboarding/ReviewTermsConditions';
import SuccessOverlay from './onboarding/SuccessOverlay';
import ProceedButton from './ProceedButton';

const ApplicationReviewTab = ({ goToStep }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showChargeVerification, setShowChargeVerification] = useState(false);
  const [chargeCollected, setChargeCollected] = useState(false);

  // Hardcoded subscription charge from variant page (dummy)
  const subscriptionCharge = "X";

  const Divider = () => (
    <hr className="border-t border-[#A89885] w-full my-8 opacity-60" />
  );

  const handleSubmit = () => {
    if (termsAccepted) {
      setShowChargeVerification(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Please accept the Terms & Conditions to proceed.");
    }
  };

  const handleFinalProceed = () => {
    if (chargeCollected) {
      setIsSuccess(true);
    } else {
      alert("Please confirm that you have collected the subscription charge.");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
        {!showChargeVerification ? (
          <>
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
          </>
        ) : (
          <div className="flex flex-col items-center gap-10 mt-10 animate-in slide-in-from-bottom duration-500">
            <h2 className="font-bold text-[22px] tracking-wide text-center">
              Account Subscription Charge
            </h2>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg w-full max-w-2xl">
              <p className="text-[15px] font-semibold text-blue-900 leading-relaxed">
                Note: Please ensure to collect account subscription charge of Rs. {subscriptionCharge} from the customer.
              </p>
            </div>

            <div className="flex items-start gap-3 w-full max-w-2xl px-2">
              <input
                type="checkbox"
                id="charge-agree"
                checked={chargeCollected}
                onChange={(e) => setChargeCollected(e.target.checked)}
                className="w-5 h-5 cursor-pointer rounded-sm mt-1 accent-black"
              />
              <label 
                htmlFor="charge-agree"
                className="text-[14.5px] text-gray-800 font-medium leading-relaxed cursor-pointer"
              >
                I agree and ensure that I have collected this amount from the customer, 
                and I understand that this amount will be deducted from my account later.
              </label>
            </div>

            <div className="flex justify-center w-full mt-6">
              <ProceedButton
                onClick={handleFinalProceed}
                disabled={!chargeCollected}
                className="w-fit"
              />
            </div>
            
            <button 
              onClick={() => setShowChargeVerification(false)}
              className="text-gray-500 font-medium text-[14px] hover:text-gray-700 transition-colors"
            >
              Back to Review
            </button>
          </div>
        )}
      </div>

      {isSuccess && <SuccessOverlay />}
    </>
  );
};

export default ApplicationReviewTab;
 