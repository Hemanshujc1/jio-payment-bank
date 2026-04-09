import React, { useState } from 'react';
import ReviewAadhaarDetails from "../review/ReviewAadhaarDetails";
import ReviewFamilyDetails from "../review/ReviewFamilyDetails";
import ReviewFinancialDetails from "../review/ReviewFinancialDetails";
import ReviewNomineeDetails from "../review/ReviewNomineeDetails";
import ReviewTermsConditions from "../review/ReviewTermsConditions";
import SuccessOverlay from "../ui/SuccessOverlay";
import ChargeVerificationModal from "../review/ChargeVerificationModal";
import BiometricVerificationModal from "../review/BiometricVerificationModal";

const ApplicationReviewTab = ({ goToStep }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showChargeVerification, setShowChargeVerification] = useState(false);
  const [chargeCollected, setChargeCollected] = useState(false);

  const [showBiometricConsent, setShowBiometricConsent] = useState(false);
  const [biometricConsentAccepted, setBiometricConsentAccepted] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

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
      setShowChargeVerification(false);
      setShowBiometricConsent(true);
    } else {
      alert("Please confirm that you have collected the subscription charge.");
    }
  };

  const handleCaptureBiometric = () => {
    if (!biometricConsentAccepted) return;
    
    setIsBiometricLoading(true);
    setTimeout(() => {
      setIsBiometricLoading(false);
      setIsBiometricVerified(true);
      
      setTimeout(() => {
        setIsSuccess(true);
        setShowBiometricConsent(false);
      }, 1500);
    }, 2500);
  };

  return (
    <div className="w-full flex-col px-3 sm:px-6 md:px-8 pt-4 pb-2  sm:pb-0 sm:pt-8 items-center text-black font-sans animate-in fade-in duration-500">
      <div className="flex flex-col w-full max-w-6xl mx-auto pb-10 sm:pb-20 relative">
        <h2 className="font-bold text-xl sm:text-[22px] tracking-wide mb-8 sm:mb-12 text-center text-gray-800">
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

        {/* Subscription Charge Popup Modal */}
        <ChargeVerificationModal
          isOpen={showChargeVerification}
          onClose={() => setShowChargeVerification(false)}
          onProceed={handleFinalProceed}
          chargeCollected={chargeCollected}
          setChargeCollected={setChargeCollected}
        />

        {/* Biometric Consent & Verification Modal */}
        <BiometricVerificationModal
          isOpen={showBiometricConsent}
          onClose={() => setShowBiometricConsent(false)}
          isVerified={isBiometricVerified}
          isLoading={isBiometricLoading}
          onCapture={handleCaptureBiometric}
          consentAccepted={biometricConsentAccepted}
          setConsentAccepted={setBiometricConsentAccepted}
        />
      </div>
      {isSuccess && <SuccessOverlay />}
    </div>
  );
};

export default ApplicationReviewTab;
 