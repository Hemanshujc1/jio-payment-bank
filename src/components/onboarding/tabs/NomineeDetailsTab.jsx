import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import NomineeChoice from "../sections/NomineeChoice";
import NomineeInfo from "../sections/NomineeInfo";
import GuardianInfo from "../sections/GuardianInfo";
import { differenceInYears } from "date-fns";
import { parseDate, checkNamesMatch, focusFirstError } from "../../../utils/validationUtils";
import { useToast } from "../../ui/Toast";

const NomineeDetailsTab = ({ onNext }) => {
  const { trigger, getValues, setValue, register, setError, clearErrors, formState: { errors } } = useFormContext();
  const toast = useToast();
  
  const nomineeVal = useWatch({ name: "nominee" }) || {};
  const guardianVal = useWatch({ name: "guardian" }) || {};
  const applicant = useWatch({ name: "applicant" }) || {};
  const nomineeConsentData = useWatch({ name: "onboarding.nomineeConsentData" });

  const provideNominee = nomineeVal.provide;
  const nomineeDob = nomineeVal.dob;
  const relationship = nomineeVal.relationship;

  const isMinor = nomineeDob ? differenceInYears(new Date(), parseDate(nomineeDob)) < 18 : false;

  const isNomineeFieldsFilled = !!(
    nomineeVal.firstName?.trim() &&
    nomineeVal.lastName?.trim() &&
    nomineeVal.relationship?.trim() &&
    nomineeVal.dob?.trim() &&
    nomineeVal.address?.trim()
  );

  const isNomineeAddressFilled =
    nomineeVal.address !== "Others" ||
    !!(
      nomineeVal.addressDetails?.addressLine1?.trim() &&
      nomineeVal.addressDetails?.city?.trim() &&
      nomineeVal.addressDetails?.state?.trim() &&
      nomineeVal.addressDetails?.pincode?.trim()
    );

  const isGuardianFieldsFilled = !isMinor || !!(
    guardianVal.firstName?.trim() &&
    guardianVal.lastName?.trim() &&
    guardianVal.relationship?.trim() &&
    guardianVal.dob?.trim() &&
    guardianVal.address?.trim()
  );

  const isGuardianAddressFilled = !isMinor ||
    guardianVal.address !== "Others" ||
    !!(
      guardianVal.addressDetails?.addressLine1?.trim() &&
      guardianVal.addressDetails?.city?.trim() &&
      guardianVal.addressDetails?.state?.trim() &&
      guardianVal.addressDetails?.pincode?.trim()
    );

  let isProceedDisabled = true;
  if (provideNominee === "No") {
    isProceedDisabled = !nomineeVal.nomineeConsentAccepted;
  } else if (provideNominee === "Yes") {
    isProceedDisabled = !(
      isNomineeFieldsFilled &&
      isNomineeAddressFilled &&
      isGuardianFieldsFilled &&
      isGuardianAddressFilled
    );
  }

  const handleProceed = async () => {
    let hasValidationError = false;

    clearErrors([
      "nominee.provide",
      "nominee.firstName",
      "nominee.lastName",
      "nominee.relationship",
      "nominee.dob",
      "nominee.address",
      "nominee.addressDetails.addressLine1",
      "nominee.addressDetails.city",
      "nominee.addressDetails.state",
      "nominee.addressDetails.pincode",
      "guardian.firstName",
      "guardian.lastName",
      "guardian.relationship",
      "guardian.dob",
      "guardian.address",
      "guardian.addressDetails.addressLine1",
      "guardian.addressDetails.city",
      "guardian.addressDetails.state",
      "guardian.addressDetails.pincode",
      "nominee.nomineeConsentAccepted"
    ]);

    const data = getValues();
    const nomineeVal = data.nominee || {};
    const guardianVal = data.guardian || {};
    const applicantVal = data.applicant || {};

    if (!provideNominee) {
      setError("nominee.provide", { type: "manual", message: "Please select an option" });
      hasValidationError = true;
    } else if (provideNominee === "No") {
      // Clear nominee fields (except provide)
      setValue("nominee.relationship", "");
      setValue("nominee.firstName", "");
      setValue("nominee.middleName", "");
      setValue("nominee.lastName", "");
      setValue("nominee.dob", "");
      setValue("nominee.address", "");
      setValue("nominee.addressDetails.addressLine1", "");
      setValue("nominee.addressDetails.addressLine2", "");
      setValue("nominee.addressDetails.addressLine3", "");
      setValue("nominee.addressDetails.city", "");
      setValue("nominee.addressDetails.state", "");
      setValue("nominee.addressDetails.stateCode", "");
      setValue("nominee.addressDetails.district", "");
      setValue("nominee.addressDetails.pincode", "");

      // Clear guardian fields
      setValue("guardian.relationship", "");
      setValue("guardian.firstName", "");
      setValue("guardian.middleName", "");
      setValue("guardian.lastName", "");
      setValue("guardian.dob", "");
      setValue("guardian.address", "");
      setValue("guardian.addressDetails.addressLine1", "");
      setValue("guardian.addressDetails.addressLine2", "");
      setValue("guardian.addressDetails.addressLine3", "");
      setValue("guardian.addressDetails.city", "");
      setValue("guardian.addressDetails.state", "");
      setValue("guardian.addressDetails.stateCode", "");
      setValue("guardian.addressDetails.district", "");
      setValue("guardian.addressDetails.pincode", "");

      if (!nomineeVal.nomineeConsentAccepted) {
        setError("nominee.nomineeConsentAccepted", {
          type: "manual",
          message: "Please agree to this consent to proceed without a nominee.",
        });
        hasValidationError = true;
      }
    } else if (provideNominee === "Yes") {
      setValue("nominee.nomineeConsentAccepted", false);

      // Validate nominee fields
      if (!nomineeVal.firstName?.trim()) {
        setError("nominee.firstName", { type: "manual", message: "Name is required" });
        hasValidationError = true;
      }
      if (!nomineeVal.lastName?.trim()) {
        setError("nominee.lastName", { type: "manual", message: "Name is required" });
        hasValidationError = true;
      }
      if (!nomineeVal.relationship?.trim()) {
        setError("nominee.relationship", { type: "manual", message: "Please select valid relationship" });
        hasValidationError = true;
      }
      if (!nomineeVal.dob?.trim()) {
        setError("nominee.dob", { type: "manual", message: "Enter Valid Date of Birth" });
        hasValidationError = true;
      }
      if (!nomineeVal.address?.trim()) {
        setError("nominee.address", { type: "manual", message: "Please select an address option" });
        hasValidationError = true;
      } else if (nomineeVal.address === "Others") {
        if (!nomineeVal.addressDetails?.addressLine1?.trim()) {
          setError("nominee.addressDetails.addressLine1", { type: "manual", message: "Address Line 1 is required" });
          hasValidationError = true;
        } else if (nomineeVal.addressDetails.addressLine1.trim().length < 5) {
          setError("nominee.addressDetails.addressLine1", { type: "manual", message: "Address Line 1 must be at least 5 characters" });
          hasValidationError = true;
        }
        if (!nomineeVal.addressDetails?.city?.trim()) {
          setError("nominee.addressDetails.city", { type: "manual", message: "City is required" });
          hasValidationError = true;
        }
        if (!nomineeVal.addressDetails?.state?.trim()) {
          setError("nominee.addressDetails.state", { type: "manual", message: "State is required" });
          hasValidationError = true;
        }
        if (!nomineeVal.addressDetails?.pincode?.trim()) {
          setError("nominee.addressDetails.pincode", { type: "manual", message: "Pincode is required" });
          hasValidationError = true;
        } else if (nomineeVal.addressDetails.pincode.trim().length !== 6 || !/^\d+$/.test(nomineeVal.addressDetails.pincode.trim())) {
          setError("nominee.addressDetails.pincode", { type: "manual", message: "Pincode must be 6 digits" });
          hasValidationError = true;
        }
      }

      // Check if nominee is minor
      const isNomineeMinor = nomineeVal.dob ? differenceInYears(new Date(), parseDate(nomineeVal.dob)) < 18 : false;

      if (isNomineeMinor) {
        // Validate guardian fields
        if (!guardianVal.firstName?.trim()) {
          setError("guardian.firstName", { type: "manual", message: "Name is required" });
          hasValidationError = true;
        }
        if (!guardianVal.lastName?.trim()) {
          setError("guardian.lastName", { type: "manual", message: "Name is required" });
          hasValidationError = true;
        }
        if (!guardianVal.relationship?.trim()) {
          setError("guardian.relationship", { type: "manual", message: "Please select valid relationship" });
          hasValidationError = true;
        }
        if (!guardianVal.dob?.trim()) {
          setError("guardian.dob", { type: "manual", message: "Enter Valid Date of Birth" });
          hasValidationError = true;
        } else {
          const guardianDate = parseDate(guardianVal.dob);
          if (guardianDate && differenceInYears(new Date(), guardianDate) < 18) {
            setError("guardian.dob", { type: "manual", message: "Date of birth of Guardian cannot be less than 18 years of age." });
            hasValidationError = true;
          }
        }
        if (!guardianVal.address?.trim()) {
          setError("guardian.address", { type: "manual", message: "Please select an address option" });
          hasValidationError = true;
        } else if (guardianVal.address === "Others") {
          if (!guardianVal.addressDetails?.addressLine1?.trim()) {
            setError("guardian.addressDetails.addressLine1", { type: "manual", message: "Address Line 1 is required" });
            hasValidationError = true;
          } else if (guardianVal.addressDetails.addressLine1.trim().length < 5) {
            setError("guardian.addressDetails.addressLine1", { type: "manual", message: "Address Line 1 must be at least 5 characters" });
            hasValidationError = true;
          }
          if (!guardianVal.addressDetails?.city?.trim()) {
            setError("guardian.addressDetails.city", { type: "manual", message: "City is required" });
            hasValidationError = true;
          }
          if (!guardianVal.addressDetails?.state?.trim()) {
            setError("guardian.addressDetails.state", { type: "manual", message: "State is required" });
            hasValidationError = true;
          }
          if (!guardianVal.addressDetails?.pincode?.trim()) {
            setError("guardian.addressDetails.pincode", { type: "manual", message: "Pincode is required" });
            hasValidationError = true;
          } else if (guardianVal.addressDetails.pincode.trim().length !== 6 || !/^\d+$/.test(guardianVal.addressDetails.pincode.trim())) {
            setError("guardian.addressDetails.pincode", { type: "manual", message: "Pincode must be 6 digits" });
            hasValidationError = true;
          }
        }
      }

      // Check cross-match errors
      if (!hasValidationError) {
        const applicantFullName = `${applicantVal.firstName || ""} ${applicantVal.middleName || ""} ${applicantVal.lastName || ""}`.replace(/\s+/g, ' ').trim();
        const nomineeFullName = `${nomineeVal.firstName || ""} ${nomineeVal.middleName || ""} ${nomineeVal.lastName || ""}`.replace(/\s+/g, ' ').trim();

        if (checkNamesMatch(nomineeFullName, applicantFullName)) {
          setError("nominee.firstName", {
            type: "manual",
            message: "Nominee Name cannot be the same as Applicant Name",
          });
          hasValidationError = true;
        }

        if (isNomineeMinor) {
          const guardianFullName = `${guardianVal.firstName || ""} ${guardianVal.middleName || ""} ${guardianVal.lastName || ""}`.replace(/\s+/g, ' ').trim();
          
          if (checkNamesMatch(guardianFullName, applicantFullName)) {
            setError("guardian.firstName", {
              type: "manual",
              message: "Guardian Name cannot be the same as Applicant Name",
            });
            hasValidationError = true;
          }

          if (checkNamesMatch(guardianFullName, nomineeFullName)) {
            setError("guardian.firstName", {
              type: "manual",
              message: "Guardian Name cannot be the same as Nominee Name",
            });
            setError("nominee.firstName", {
              type: "manual",
              message: "Nominee Name cannot be the same as Guardian Name",
            });
            hasValidationError = true;
          }
        }

        // Gender vs Spouse check
        if ((applicantVal.gender === "Male" && relationship === "Husband") || 
            (applicantVal.gender === "Female" && relationship === "Wife")) {
          setError("nominee.relationship", {
            type: "manual",
            message: "Please select valid Nominee relation",
          });
          hasValidationError = true;
        }

        // Marital status check
        if (applicantVal.maritalStatus === "Single" && (relationship === "Husband" || relationship === "Wife")) {
          setError("nominee.relationship", {
            type: "manual",
            message: "Please select valid Nominee relation",
          });
          hasValidationError = true;
        }

        // Minor check for Husband/Wife
        if ((relationship === "Husband" || relationship === "Wife") && isNomineeMinor) {
          setError("nominee.dob", {
            type: "manual",
            message: "Enter Valid Date of Birth",
          });
          hasValidationError = true;
        }
      }
    }

    if (!hasValidationError) {
      onNext();
    } else {
      toast.error("Please enter valid information in all fields.");
      focusFirstError();
    }
  };

  return (
    <div className="w-full flex-col px-3 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-0 items-center text-black font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 sm:gap-4">
        {/* Header */}
        <h2 className="font-bold text-xl sm:text-[22px] tracking-wide mb-3 sm:mb-4 text-center text-gray-800">
          Nominee Details
        </h2>

        <div className="flex flex-col gap-10">
          <NomineeChoice />

          {provideNominee === "Yes" && (
            <>
              <NomineeInfo />
              {isMinor && <GuardianInfo />}
            </>
          )}

          {provideNominee === "No" && (
            <div className="flex flex-col gap-2 mt-1 px-2 sm:px-0">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1 shrink-0">
                  <input
                    type="checkbox"
                    {...register("nominee.nomineeConsentAccepted")}
                    className={`w-5 h-5 border-2 accent-black cursor-pointer rounded-sm ${
                      errors.nominee?.nomineeConsentAccepted ? 'border-red-500' : 'border-[#D1A054]'
                    }`}
                  />
                </div>
                <span className="text-[13.5px] sm:text-[14px] leading-snug text-gray-800 select-none">
                  {nomineeConsentData ? (
                    nomineeConsentData.text1.split(/\\r\\n|\\n|\r\n|\n/).map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i !== arr.length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    "Loading consent..."
                  )}
                  <span className="text-red-500 text-lg ml-1">*</span>
                </span>
              </label>
              {errors.nominee?.nomineeConsentAccepted && (
                <span className="text-red-500 text-[12px] font-medium ml-8">{errors.nominee.nomineeConsentAccepted.message}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
          <ProceedButton onClick={handleProceed} className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" />
        </div>       
      </div>
    </div>
  );
};

export default NomineeDetailsTab;
