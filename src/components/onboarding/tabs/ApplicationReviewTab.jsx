import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import ReviewAadhaarDetails from "../review/ReviewAadhaarDetails";
import ReviewFamilyDetails from "../review/ReviewFamilyDetails";
import ReviewFinancialDetails from "../review/ReviewFinancialDetails";
import ReviewNomineeDetails from "../review/ReviewNomineeDetails";
import ReviewTermsConditions from "../review/ReviewTermsConditions";
import SuccessOverlay from "../ui/SuccessOverlay";
import ChargeVerificationModal from "../review/ChargeVerificationModal";
import BiometricVerificationModal from "../review/BiometricVerificationModal";
import onboardingService from "../../../services/onboardingService";
import { useToast } from "../../ui/Toast";

const ApplicationReviewTab = ({ goToStep }) => {
  const { getValues } = useFormContext();
  const toast = useToast();

  const [isSuccess, setIsSuccess] = useState(false);
  const [showChargeVerification, setShowChargeVerification] = useState(false);
  const [chargeCollected, setChargeCollected] = useState(false);

  const [showBiometricConsent, setShowBiometricConsent] = useState(false);
  
  // This loading state will now be used while the final application is submitting
  const [isBiometricLoading, setIsBiometricLoading] = useState(false); 
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

  // ✅ Divider
  const Divider = () => (
    <hr className="border-t border-[#A89885] w-full my-4 opacity-60" />
  );

  // ✅ SAFE DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "";
    if (date.includes("-")) return date; // already formatted
    const [dd, mm, yyyy] = date.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  // ✅ SAFE DATA EXTRACTION
  const rawData = getValues();

  const formData = {
    applicant: rawData?.applicant || {},
    family: rawData?.family || {},
    financial: rawData?.financial || {},
    nominee: rawData?.nominee || {},
    onboarding: rawData?.onboarding || {},
    guardian: rawData?.guardian || {},
  };

  const buildPersonAddress = () => {
  const aadhaarAddress = formData.applicant?.aadhaarAddress || {};
  const communicationAddress =
    formData.applicant?.communicationAddress || {};

  const mapAddress = (address, type, sameAsPermanent = false) => ({
    city: address.city || "",
    line1: [
      address.addressLine1,
      address.addressLine2,
      address.landmark,
    ]
      .filter(Boolean)
      .join(", "),

    line2: [
      address.addressLine3,
      address.city,
      address.district,
    ]
      .filter(Boolean)
      .join(", "),

    line3: [
      address.state,
      address.pincode,
      "India",
    ]
      .filter(Boolean)
      .join(", "),

    state: address.stateCode || "MH",
    street: address.addressLine2 || "",
    country: "India",
    pincode: address.pincode || "",
    district: address.district || "",
    landmark: address.landmark || "",
    locality: address.addressLine3 || "",
    addressType: type,
    houseNumber: address.addressLine1 || "",
    sameAsPermanent,
  });

  return [
    // ✅ Aadhaar / Permanent Address
    mapAddress(aadhaarAddress, "PERMANENT", false),

    // ✅ Communication / Current Address
    mapAddress(
      communicationAddress,
      "CURRENT",
      JSON.stringify(aadhaarAddress) ===
        JSON.stringify(communicationAddress)
    ),
  ];
};

  // ✅ FINAL PAYLOAD BUILDER
  const buildFinalPayload = () => {
    return {
      applicationNumber: sessionStorage.getItem("applicationNumber"),
      externalAppRefNumber: sessionStorage.getItem("externalAppRefNumber"),
      personAddress: buildPersonAddress(),

      martialStatus:
        formData.applicant.maritalStatus === "Married" ? "2" : "1",

      consents: Array.isArray(formData.onboarding?.consents)
        ? formData.onboarding.consents
        : [],

      financialDetails: {
        sourceOfIncome: formData.financial.sourceOfIncome || "A04",
        annualSalary: formData.financial.annualIncome || "3",
        occupation: formData.financial.occupation || "JP1",
      },

      nomineeDetails: {
        relationship: formData.nominee.relationship,
        salutation: "Mr",
        firstName: formData.nominee.firstName,
        middleName: formData.nominee.middleName,
        lastName: formData.nominee.lastName,
        dateOfBirth: formatDate(formData.nominee.dob),
        gender: "Male",
        percentage: "100",
        priority: "1",
        minor: false,
      },

      nomineeAddress: {
        addressType: "Permanent",
        careOf: "None",
        houseNumber: formData.nominee.addressLine1,
        street: formData.nominee.addressLine2,
        landmark: formData.nominee.addressLine2,
        locality: formData.nominee.addressLine3,
        city: formData.nominee.city,
        postOffice: formData.nominee.city,
        district: formData.nominee.district,
        subDistrict: formData.nominee.district,
        state: formData.nominee.state,
        stateCode: "MH",
        country: "India",
        pincode: formData.nominee.pincode,
      },

      nomineeContactDetails: [
        {
          type: "Mobile",
          countryCode: "91",
          mobileNumber: formData.applicant.mobileNumber || "",
          status: "Active",
          email: formData.applicant.emailId || "",
        },
        {
          type: "Personal Email",
          email: formData.applicant.emailId || "",
        },
      ],

      nomineeOVDDetails: {
        documentType: "Aadhaar",
        documentNumber: "",
      },

      guardianAddress: {
        addressType: "Permanent",
        careOf: "None",
        houseNumber: formData.guardian?.addressLine1 || "",
        street: formData.guardian?.addressLine2 || "",
        landmark: formData.guardian?.addressLine2 || "",
        locality: formData.guardian?.addressLine3 || "",
        city: formData.guardian?.city || "",
        postOffice: formData.guardian?.city || "",
        district: formData.guardian?.district || "",
        subDistrict: formData.guardian?.district || "",
        state: formData.guardian?.state || "",
        stateCode: "MH",
        country: "India",
        pincode: formData.guardian?.pincode || "",
      },

      guardianOVDDetails: {
        documentType: "Aadhaar",
        documentNumber: "",
      },

      addOn: {
        subscriptionId: formData.onboarding?.subscriptionId || "1000",
        schemeCode: formData.onboarding?.schemeCode || "2042",
        network: formData.onboarding?.network || "DUMMY",
        region: formData.onboarding?.region || "DOMESTIC",
        cardType: formData.onboarding?.cardType || "VIRTUAL",
        tierType: formData.onboarding?.tierType || "TRGWFEE",
      },
    };
  };

  // ✅ SUBMIT FLOW
  const handleSubmit = () => {
    setShowChargeVerification(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalProceed = () => {
    if (!chargeCollected) {
      toast.warning("Please confirm charge collection");
      return;
    }
    setShowChargeVerification(false);
    setShowBiometricConsent(true);
  };

  // ✅ AUTOMATIC FINAL SUBMISSION
  // This is triggered ONLY when the Modal successfully verifies the biometric
  const handleFinalSubmit = async () => {
    setIsBiometricLoading(true);

    try {
      const payload = buildFinalPayload();
      console.log("🚀 FINAL PAYLOAD:", payload);

      const res = await onboardingService.submitApplication(payload);

      if (res.status === "SUCCESS") {
        // Show success checkmark in the modal
        setIsBiometricVerified(true);

        // Wait 1.5 seconds so the user can see the green checkmark, then show final success overlay
        setTimeout(() => {
          setIsSuccess(true);
          setShowBiometricConsent(false);
        }, 1500);
      } else {
        toast.error(res.message || "Application submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Something went wrong during final submission.");
    } finally {
      setIsBiometricLoading(false);
    }
  };

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
        onEdit={() => goToStep(4)}
      />
      <Divider />

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

      {/* ✅ UPDATED MODAL PROPS */}
      <BiometricVerificationModal
        isOpen={showBiometricConsent}
        onClose={() => setShowBiometricConsent(false)}
        isVerified={isBiometricVerified}
        isLoading={isBiometricLoading} // Spans the button while final payload submits
        
        // 1. Pass the IDs the modal needs for the customerBioAuth verification
        apiPayloadData={{
          applicationNumber: sessionStorage.getItem("applicationNumber"),
          externalAppRefNumber: sessionStorage.getItem("externalAppRefNumber")
        }}

        // 2. Once verified, trigger the final submission
        onCaptureSuccess={handleFinalSubmit} 
      />

      {isSuccess && <SuccessOverlay />}
    </div>
  );
};

export default ApplicationReviewTab;