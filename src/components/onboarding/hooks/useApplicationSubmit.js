import { useState } from "react";
import { differenceInYears } from "date-fns";
import { parseDate } from "../../../utils/validationUtils";
import { cloneAddress } from "../../../utils/addressUtils";
import onboardingService from "../../../services/onboardingService";

const RELATION_LOOKUP = {
  Father: "R01",
  Mother: "R02",
  Wife: "R03",
  Husband: "R04",
  Daughter: "R05",
  Son: "R06",
  Brother: "R07",
  Sister: "R08",
};

export const useApplicationSubmit = ({ formData, toast }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showChargeVerification, setShowChargeVerification] = useState(false);
  const [chargeCollected, setChargeCollected] = useState(false);
  const [showBiometricConsent, setShowBiometricConsent] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false); 
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    let normalizedDate = date.replace(/\//g, "-");
    const parts = normalizedDate.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    }
    return normalizedDate;
  };

  const buildPersonAddress = () => {
    const aadhaarAddress = formData.applicant?.aadhaarAddress || {};
    const communicationAddress = formData.applicant?.communicationAddress || {};

    const permanentAddr = cloneAddress(aadhaarAddress, "PERMANENT", false);

    const isSame =
      aadhaarAddress.pincode === communicationAddress.pincode &&
      aadhaarAddress.state === communicationAddress.state &&
      aadhaarAddress.city === communicationAddress.city &&
      aadhaarAddress.line1 === communicationAddress.line1;

    const currentAddr = cloneAddress(communicationAddress, "CURRENT", isSame);

    return [permanentAddr, currentAddr];
  };

  const buildFinalPayload = (consentsArray) => {
    let baseConsents = Array.isArray(consentsArray) && consentsArray.length > 0
      ? consentsArray
      : (Array.isArray(formData.onboarding?.consents)
          ? [...formData.onboarding.consents]
          : []);

    if (formData.nominee.provide === "No" && formData.nominee.nomineeConsentAccepted && formData.onboarding.nomineeConsentData) {
      const nomineeConsent = formData.onboarding.nomineeConsentData;
      if (!baseConsents.some(c => c.code === nomineeConsent.consentTextCode)) {
        baseConsents.push({
          consent: nomineeConsent.text1,
          code: nomineeConsent.consentTextCode,
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
        sourceOfIncome: formData.financial.sourceOfIncome || "NA",
      },

      familyDetails: (() => {
        const isMarried = formData.applicant.maritalStatus === "Married";
        const members = [
          {
            relationship: RELATION_LOOKUP["Father"],
            salutation: "2",
            firstName: formData.family.fatherName?.firstName || "",
            middleName: formData.family.fatherName?.middleName || "",
            lastName: formData.family.fatherName?.lastName || "",
            dateOfBirth: "",
            gender: "M",
          },
          {
            relationship: RELATION_LOOKUP["Mother"],
            salutation: "3",
            firstName: formData.family.motherName?.firstName || "",
            middleName: formData.family.motherName?.middleName || "",
            lastName: formData.family.motherName?.lastName || "",
            dateOfBirth: "",
            gender: "F",
          },
        ];

        if (isMarried) {
          const spouseRel = formData.applicant.gender === "Female" ? "Husband" : "Wife";
          members.push({
            relationship: RELATION_LOOKUP[spouseRel],
            salutation: formData.applicant.gender === "Female" ? "2" : "3",
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
        const dob = formData.nominee.dob;
        
        let nomineeGender = "M";
        let salutation = "2";
        
        if (["Mother", "Sister", "Daughter", "Wife"].includes(rel)) {
          nomineeGender = "F";
          salutation = (rel === "Mother" || rel === "Wife") ? "3" : "1";
        }

        const age = dob ? differenceInYears(new Date(), parseDate(dob)) : 0;
        const isMinor = age < 18;

        return {
          relationship: RELATION_LOOKUP[rel],
          salutation: salutation,
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
        addressType: formData.nominee.addressDetails?.addressType || "Permanent",
        careOf: "None",
        houseNumber: formData.nominee.addressDetails?.houseNumber || "",
        line1: formData.nominee.addressDetails?.line1 || "",
        line2: formData.nominee.addressDetails?.line2 || "",
        line3: formData.nominee.addressDetails?.line3 || "",
        street: formData.nominee.addressDetails?.street || "",
        landmark: formData.nominee.addressDetails?.landmark || "",
        locality: formData.nominee.addressDetails?.locality || "",
        city: formData.nominee.addressDetails?.city || "",
        postOffice: formData.nominee.addressDetails?.city || "",
        district: formData.nominee.addressDetails?.district || "",
        subDistrict: formData.nominee.addressDetails?.district || "",
        state: formData.nominee.addressDetails?.state || "",
        stateCode: formData.nominee.addressDetails?.stateCode || "",
        country:"India",
        pincode: formData.nominee.addressDetails?.pincode || "",
      } : null,

      nomineeContactDetails: formData.nominee.provide === "Yes" ? [
        {
          type: "Personal",
          countryCode: "91",
          mobileNumber:  "",
          status: "",
          email:"",
        },
        {
          type: "Personal Email",
          email: "",
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
          relationship: RELATION_LOOKUP[rel],
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
        addressType: formData.guardian?.addressDetails?.addressType || "Permanent",
        careOf: "None",
        houseNumber: formData.guardian?.addressDetails?.houseNumber || "",
        line1: formData.guardian?.addressDetails?.line1 || "",
        line2: formData.guardian?.addressDetails?.line2 || "",
        line3: formData.guardian?.addressDetails?.line3 || "",
        street: formData.guardian?.addressDetails?.street || "",
        landmark: formData.guardian?.addressDetails?.landmark || "",
        locality: formData.guardian?.addressDetails?.locality || "",
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

  const handleFinalSubmit = async (consentsArray) => {
    setIsBiometricLoading(true);

    try {
      const payload = buildFinalPayload(consentsArray);
      console.log("🚀 FINAL PAYLOAD:", payload);

      const res = await onboardingService.submitApplication(payload);

      if (res.status === "SUCCESS") {
        setIsBiometricVerified(true);
        setTimeout(() => {
          setIsSuccess(true);
          setShowBiometricConsent(false);
        }, 1200);
      } else {
        toast.error(res.error?.message || res.message || "Application submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(res.error?.message || err.message || "Something went wrong during final submission.");
    } finally {
      setIsBiometricLoading(false);
    }
  };

  return {
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
  };
};
