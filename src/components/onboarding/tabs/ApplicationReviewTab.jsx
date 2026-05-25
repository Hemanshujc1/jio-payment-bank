import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { differenceInYears } from "date-fns";
import { parseDate } from "../../../utils/validationUtils";
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
    if (date.includes("/")) return date; // already dd/mm/yyyy
    if (date.includes("-")) {
      const parts = date.split("-");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy-mm-dd -> dd/mm/yyyy
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else {
          // dd-mm-yyyy -> dd/mm/yyyy
          return `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
      }
    }
    return date;
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

    state: address.state || "",
    stateCode: address.stateCode || "",
    street: address.addressLine2 || "",
    country: "India",
    pincode: address.pincode || "",
    city: address.city || address.district || "",
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
      JSON.stringify({ ...aadhaarAddress, stateCode: undefined }) ===
        JSON.stringify({ ...communicationAddress, stateCode: undefined })
    ),
  ];
};

  // ✅ FINAL PAYLOAD BUILDER
  const buildFinalPayload = (consentsArray) => {
    let baseConsents = Array.isArray(consentsArray) && consentsArray.length > 0
      ? consentsArray
      : (Array.isArray(formData.onboarding?.consents)
          ? [...formData.onboarding.consents]
          : []);

    if (formData.nominee.provide === "No" && formData.nominee.c69Accepted && formData.onboarding.c69ConsentData) {
      const c69Data = formData.onboarding.c69ConsentData;
      if (!baseConsents.some(c => c.code === "C69")) {
        baseConsents.push({
          consent: c69Data.text1,
          code: c69Data.consentTextCode,
          version: "1",
          method: "checkbox",
        });
      }
    }

    return {
      applicationNumber: sessionStorage.getItem("applicationNumber"),
      externalAppRefNumber: sessionStorage.getItem("externalAppRefNumber"),
      personAddress: buildPersonAddress(),
      
      martialStatus: formData.applicant.maritalStatus === "Married" ? "2" : "1",

      consents: baseConsents,

      financialDetails: {
        annualSalary: formData.financial.annualIncome || "NA",
        occupation: formData.financial.occupation || "NA",
      },

      familyDetails: (() => {
        const isMarried = formData.applicant.maritalStatus === "Married";
        const members = [
          {
            relationship: "Father",
            salutation: "2", // Mr.
            firstName: formData.family.fatherName?.firstName || "",
            middleName: formData.family.fatherName?.middleName || "",
            lastName: formData.family.fatherName?.lastName || "",
            dateOfBirth: "",
            gender: "M",
          },
          {
            relationship: "Mother",
            salutation: "3", // Mrs.
            firstName: formData.family.motherName?.firstName || "",
            middleName: formData.family.motherName?.middleName || "",
            lastName: formData.family.motherName?.lastName || "",
            dateOfBirth: "",
            gender: "F",
          },
        ];

        if (isMarried) {
          members.push({
            relationship: "Spouse",
            salutation: formData.applicant.gender === "Female" ? "2" : "3", // Mrs/Mr.
            firstName: formData.family.spouseName?.firstName || "",
            middleName: formData.family.spouseName?.middleName || "",
            lastName: formData.family.spouseName?.lastName || "",
            dateOfBirth: "",
            gender: formData.applicant.gender === "Female" ? "M" : "F",
          });
        }

        return members;
      })(),

      nomineeDetails: formData.nominee.provide === "Yes" ? (() => {
        const rel = formData.nominee.relationship;
        const appGender = formData.applicant.gender;
        const dob = formData.nominee.dob;
        
        let nomineeGender = "M";
        let salutation = "2"; // Mr.
        
        if (["Mother", "Sister", "Daughter", "Wife"].includes(rel)) {
          nomineeGender = "F";
          salutation = (rel === "Mother" || rel === "Wife") ? "3" : "1"; // Mrs/Mr.
        }

        const age = dob ? differenceInYears(new Date(), parseDate(dob)) : 0;
        const isMinor = age < 18;

        return {
          relationship: rel,
          salutation: salutation, // Mr./Mrs. based on relationship
          firstName: formData.nominee.firstName,
          middleName: formData.nominee.middleName,
          lastName: formData.nominee.lastName,
          dateOfBirth: formatDate(dob),
          gender: nomineeGender,
          percentage: "100",
          priority: "1",
          minor: isMinor,
        };
      })() : null,

      nomineeAddress: formData.nominee.provide === "Yes" ? {
        addressType: "Permanent",
        careOf: "None",
        houseNumber: formData.nominee.addressDetails?.addressLine1 || "",
        street: formData.nominee.addressDetails?.addressLine2 || "",
        landmark: formData.nominee.addressDetails?.addressLine2 || "",
        locality: formData.nominee.addressDetails?.addressLine3 || "",
        city: formData.nominee.addressDetails?.city || "",
        postOffice: formData.nominee.addressDetails?.city || "",
        district: formData.nominee.addressDetails?.district || "",
        subDistrict: formData.nominee.addressDetails?.district || "",
        state: formData.nominee.addressDetails?.state || "",
        stateCode: formData.nominee.addressDetails?.stateCode || "",
        country: "India",
        pincode: formData.nominee.addressDetails?.pincode || "",
      } : null,

      nomineeContactDetails: formData.nominee.provide === "Yes" ? [
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
      ] : [],

      nomineeOVDDetails: formData.nominee.provide === "Yes" ? {
        documentType: "Aadhaar",
        documentNumber: "",
      } : null,

      guardianDetails: (formData.nominee.provide === "Yes" && (() => {
        const dob = formData.nominee.dob;
        const age = dob ? differenceInYears(new Date(), parseDate(dob)) : 0;
        return age < 18;
      })()) ? (() => {
        const g = formData.guardian;
        const rel = g?.relationship || "";

        let guardianGender = "M";
        let salutation = "2";
        if (["Mother", "Sister", "Daughter", "Wife"].includes(rel)) {
          guardianGender = "F";
          salutation = (rel === "Mother" || rel === "Wife") ? "3" : "1";
        }

        return {
          relationship: rel,
          salutation: salutation,
          firstName: g?.firstName || "",
          middleName: g?.middleName || "",
          lastName: g?.lastName || "",
          dateOfBirth: formatDate(g?.dob),
          gender: guardianGender,
        };
      })() : null,

      guardianAddress: (formData.nominee.provide === "Yes" && (() => {
        const dob = formData.nominee.dob;
        const age = dob ? differenceInYears(new Date(), parseDate(dob)) : 0;
        return age < 18;
      })()) ? {
        addressType: "Permanent",
        careOf: "None",
        houseNumber: formData.guardian?.addressDetails?.addressLine1 || "",
        street: formData.guardian?.addressDetails?.addressLine2 || "",
        landmark: formData.guardian?.addressDetails?.addressLine2 || "",
        locality: formData.guardian?.addressDetails?.addressLine3 || "",
        city: formData.guardian?.addressDetails?.city || "",
        postOffice: formData.guardian?.addressDetails?.city || "",
        district: formData.guardian?.addressDetails?.district || "",
        subDistrict: formData.guardian?.addressDetails?.district || "",
        state: formData.guardian?.addressDetails?.state || "",
        stateCode: formData.guardian?.addressDetails?.stateCode || "",
        country: "India",
        pincode: formData.guardian?.addressDetails?.pincode || "",
      } : null,

      guardianOVDDetails: (formData.nominee.provide === "Yes" && (() => {
        const dob = formData.nominee.dob;
        const age = dob ? differenceInYears(new Date(), parseDate(dob)) : 0;
        return age < 18;
      })()) ? {
        documentType: "Aadhaar",
        documentNumber: "",
      } : null,

      addOn: {
        subscriptionId: formData.onboarding?.subscriptionId || "NA",
        schemeCode: formData.onboarding?.schemeCode || "NA",
        network: formData.onboarding?.network || "NA",
        region: formData.onboarding?.region || "NA",
        cardType: formData.onboarding?.cardType || "NA",
        tierType: formData.onboarding?.tierType || "NA",
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

  // AUTOMATIC FINAL SUBMISSION
  const handleFinalSubmit = async (consentsArray) => {
    setIsBiometricLoading(true);

    try {
      const payload = buildFinalPayload(consentsArray);
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

      {isSuccess && <SuccessOverlay applicationNumber={sessionStorage.getItem("applicationNumber")} />}
    </div>
  );
};

export default ApplicationReviewTab;