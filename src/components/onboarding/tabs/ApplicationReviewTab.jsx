import React from "react";
import { useFormContext } from "react-hook-form";
import ReviewAadhaarDetails from "../review/ReviewAadhaarDetails";
import ReviewFamilyDetails from "../review/ReviewFamilyDetails";
import ReviewFinancialDetails from "../review/ReviewFinancialDetails";
import ReviewNomineeDetails from "../review/ReviewNomineeDetails";
import ReviewTermsConditions from "../review/ReviewTermsConditions";
import SuccessOverlay from "../ui/SuccessOverlay";
import ChargeVerificationModal from "../review/ChargeVerificationModal";
import BiometricVerificationModal from "../review/BiometricVerificationModal";
import ReviewSeedDetails from "../review/ReviewSeedDetails";
import { useToast } from "../../ui/Toast";
import { useApplicationSubmit } from "../hooks/useApplicationSubmit";

const ApplicationReviewTab = ({ goToStep }) => {
  const { getValues } = useFormContext();
  const toast = useToast();

  const rawData = getValues();
  const formData = {
    applicant: rawData?.applicant || {},
    family: rawData?.family || {},
    financial: rawData?.financial || {},
    nominee: rawData?.nominee || {},
    onboarding: rawData?.onboarding || {},
    guardian: rawData?.guardian || {},
  };

  const {
    isSuccess,
    showChargeVerification,
    setShowChargeVerification,
    chargeCollected,
    setChargeCollected,
    showBiometricConsent,
    setShowBiometricConsent,
    isBiometricLoading,
    isBiometricVerified,
    handleSubmit,
    handleFinalProceed,
    handleFinalSubmit
  } = useApplicationSubmit({ formData, toast });

  const Divider = () => (
    <hr className="border-t border-[#A89885] w-full my-4 opacity-60" />
  );

  return (
    <div className="w-full px-4 py-2 text-black">
      <h2 className="text-xl font-bold text-center mb-6">
        Application Review
      </h2>

      <ReviewAadhaarDetails
        data={formData.applicant}
        onEdit={() => goToStep(2)}
      />
      <Divider />

      <ReviewFamilyDetails
        data={formData.family}
        applicant={formData.applicant}
        onEdit={() => goToStep(3)}
      />
      <Divider />

      <ReviewFinancialDetails
        data={formData.financial}
        onEdit={() => goToStep(3)}
      />
      <Divider />

      <ReviewNomineeDetails
        data={formData.nominee}
        guardian={formData.guardian}
        language={formData.onboarding?.language || "English"}
        onEdit={() => goToStep(4)}
      />
      <Divider />

      <ReviewSeedDetails
        consents={formData.onboarding?.consents}
        dbtRecords={formData.onboarding?.dbtRecords}
        onEdit={() => goToStep(1)}
      />

      <ReviewTermsConditions
        onSubmit={handleSubmit}
      />

      <ChargeVerificationModal
        isOpen={showChargeVerification}
        onClose={() => setShowChargeVerification(false)}
        onProceed={handleFinalProceed}
        chargeCollected={chargeCollected}
        setChargeCollected={setChargeCollected}
        issuanceFee={formData.onboarding?.issuanceFee}
      />

      <BiometricVerificationModal
        isOpen={showBiometricConsent}
        onClose={() => setShowBiometricConsent(false)}
        isVerified={isBiometricVerified}
        isLoading={isBiometricLoading}
        apiPayloadData={{
          applicationNumber: sessionStorage.getItem("applicationNumber"),
          externalAppRefNumber: sessionStorage.getItem("externalAppRefNumber")
        }}
        onCaptureSuccess={handleFinalSubmit} 
        nomineeProvide={formData.nominee?.provide}
      />

      {isSuccess && <SuccessOverlay applicationNumber={sessionStorage.getItem("applicationNumber")} />}
    </div>
  );
};

export default ApplicationReviewTab;