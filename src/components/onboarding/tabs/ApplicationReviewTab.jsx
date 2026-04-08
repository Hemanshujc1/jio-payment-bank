import React, { useState } from 'react';
import { FaFingerprint } from "react-icons/fa";
import ReviewAadhaarDetails from "../review/ReviewAadhaarDetails";
import ReviewFamilyDetails from "../review/ReviewFamilyDetails";
import ReviewFinancialDetails from "../review/ReviewFinancialDetails";
import ReviewNomineeDetails from "../review/ReviewNomineeDetails";
import ReviewTermsConditions from "../review/ReviewTermsConditions";
import SuccessOverlay from "../ui/SuccessOverlay";
import ProceedButton from "../../common/ProceedButton";

const ApplicationReviewTab = ({ goToStep }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showChargeVerification, setShowChargeVerification] = useState(false);
  const [chargeCollected, setChargeCollected] = useState(false);

  const [showBiometricConsent, setShowBiometricConsent] = useState(false);
  const [biometricConsentAccepted, setBiometricConsentAccepted] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

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
    <>
      <div className="flex flex-col w-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-20 relative">
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

        {/* Subscription Charge Popup Modal */}
        {showChargeVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 md:p-8 flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowChargeVerification(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors font-bold text-lg p-2"
                aria-label="Close modal"
              >
                ✕
              </button>
              
              <h2 className="font-bold text-[20px] md:text-[22px] tracking-wide text-center mt-2">
                Account Opening Charge
              </h2>

              <div className="bg-blue-50 border border-blue-200 p-5 md:p-6 rounded-lg w-full">
                <p className="text-[14px] md:text-[15px] font-semibold text-blue-900 leading-relaxed">
                Note: Please ensure that the applicable account opening charge (₹400 or ₹100) is collected from the customer.                </p>
              </div>

              <div className="flex items-start gap-3 w-full px-1">
                <input
                  type="checkbox"
                  id="charge-agree"
                  checked={chargeCollected}
                  onChange={(e) => setChargeCollected(e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded-sm mt-1 accent-black shrink-0"
                />
                <label 
                  htmlFor="charge-agree"
                  className="text-[14px] md:text-[14.5px] text-gray-800 font-medium leading-relaxed cursor-pointer"
                >
                  I agree and ensure that I have collected this amount from the customer, 
                  and I understand that this amount will be deducted from my vakrangee wallet.
                </label>
              </div>

              <div className="flex justify-center w-full mt-4">
                <ProceedButton
                  onClick={handleFinalProceed}
                  disabled={!chargeCollected}
                  className="w-full sm:w-auto min-w-[150px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Biometric Consent & Verification Modal */}
        {showBiometricConsent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 md:p-8 flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowBiometricConsent(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors font-bold text-lg p-2"
                aria-label="Close modal"
              >
                ✕
              </button>
              
              <h2 className="font-bold text-[20px] md:text-[22px] tracking-wide text-center mt-2">
                User Authentication
              </h2>

              <div className="flex items-start gap-3 w-full bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <input
                  type="checkbox"
                  id="final-biometric-consent"
                  checked={biometricConsentAccepted}
                  onChange={(e) => setBiometricConsentAccepted(e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded-sm mt-0.5 accent-black shrink-0 border-gray-300"
                />
                <label 
                  htmlFor="final-biometric-consent"
                  className="text-[13.5px] text-gray-700 leading-relaxed cursor-pointer font-medium"
                >
                  I hereby give my consent for Aadhaar authentication to securely complete the final submission of my JioPayment Bank application.
                </label>
              </div>

              <div className="flex justify-center w-full mt-4 min-h-[90px]">
                {!isBiometricVerified ? (
                  <button 
                    type="button"
                    onClick={handleCaptureBiometric}
                    disabled={!biometricConsentAccepted || isBiometricLoading}
                    className={`w-full max-w-[280px] h-14 flex items-center justify-center gap-3 font-extrabold text-[15px] rounded-xl transition-all shadow-md
                      ${(!biometricConsentAccepted || isBiometricLoading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-sand-500 text-sand-350 border border-brown-700 hover:bg-brown-800'}`}
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
                  <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-green-500/30">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p className="text-green-700 font-black text-[17px] tracking-wide">Biometric Verified Successfully</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isSuccess && <SuccessOverlay />}
    </>
  );
};

export default ApplicationReviewTab;
 