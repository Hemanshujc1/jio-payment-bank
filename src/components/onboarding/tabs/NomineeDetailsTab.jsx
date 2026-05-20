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
  const provideNominee = useWatch({ name: "nominee.provide" });
  const c69ConsentData = useWatch({ name: "onboarding.c69ConsentData" });
  const nomineeDob = useWatch({ name: "nominee.dob" });
  const relationship = useWatch({ name: "nominee.relationship" });
  const applicant = useWatch({ name: "applicant" });

  const isMinor = nomineeDob ? differenceInYears(new Date(), parseDate(nomineeDob)) < 18 : false;

  const handleProceed = async () => {
    let isValid = false;

    clearErrors([
      "nominee.firstName",
      "guardian.firstName",
      "nominee.c69Accepted"
    ]);

    if (provideNominee === "Yes") {
      setValue("nominee.c69Accepted", false);
      const fieldsToTrigger = ["nominee"];
      if (isMinor) {
        fieldsToTrigger.push("guardian");
      }
      isValid = await trigger(fieldsToTrigger);
      
      if (isValid) {
        const data = getValues();
        const applicantFullName = `${data.applicant.firstName || ""} ${data.applicant.middleName || ""} ${data.applicant.lastName || ""}`.replace(/\s+/g, ' ').trim();
        const nomineeFullName = `${data.nominee.firstName || ""} ${data.nominee.middleName || ""} ${data.nominee.lastName || ""}`.replace(/\s+/g, ' ').trim();
        
        let hasCrossMatchError = false;

        if (checkNamesMatch(nomineeFullName, applicantFullName)) {
          setError("nominee.firstName", {
            type: "manual",
            message: "Nominee Name cannot be the same as Applicant Name",
          });
          hasCrossMatchError = true;
        }

        if (isMinor) {
          const guardianFullName = `${data.guardian.firstName || ""} ${data.guardian.middleName || ""} ${data.guardian.lastName || ""}`.replace(/\s+/g, ' ').trim();
          
          if (checkNamesMatch(guardianFullName, applicantFullName)) {
            setError("guardian.firstName", {
              type: "manual",
              message: "Guardian Name cannot be the same as Applicant Name",
            });
            hasCrossMatchError = true;
          }

          if (checkNamesMatch(guardianFullName, nomineeFullName)) {
            const message = "Guardian Name cannot be the same as Nominee Name";
            setError("guardian.firstName", {
              type: "manual",
              message: message,
            });
            setError("nominee.firstName", {
              type: "manual",
              message: "Nominee Name cannot be the same as Guardian Name",
            });
            hasCrossMatchError = true;
          }
        }

        // --- NEW VALIDATIONS ---
        
        // 1. Gender check for Husband/Wife
        if ((applicant.gender === "Male" && relationship === "Husband") || 
            (applicant.gender === "Female" && relationship === "Wife")) {
          setError("nominee.relationship", {
            type: "manual",
            message: "Please select valid Nominee relation",
          });
          isValid = false;
        }

        // 2. Marital status check
        if (applicant.maritalStatus === "Single" && (relationship === "Husband" || relationship === "Wife")) {
          setError("nominee.relationship", {
            type: "manual",
            message: "Please select valid Nominee relation",
          });
          isValid = false;
        }

        // 3. Minor check for Husband/Wife
        if ((relationship === "Husband" || relationship === "Wife") && isMinor) {
          setError("nominee.dob", {
            type: "manual",
            message: "Enter Valid Date of Birth",
          });
          isValid = false;
        }

        if (hasCrossMatchError) {
          isValid = false;
        }
      }

    } else {
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

      isValid = await trigger(["nominee.provide"]);

      const values = getValues();
      const isC69Accepted = values.nominee?.c69Accepted;
      if (!isC69Accepted) {
        setError("nominee.c69Accepted", {
          type: "manual",
          message: "Please agree to this consent to proceed without a nominee.",
        });
        isValid = false;
      }
    }

    if (isValid) {
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
                    {...register("nominee.c69Accepted")}
                    className={`w-5 h-5 border-2 accent-black cursor-pointer rounded-sm ${
                      errors.nominee?.c69Accepted ? 'border-red-500' : 'border-[#D1A054]'
                    }`}
                  />
                </div>
                <span className="text-[13.5px] sm:text-[14px] leading-snug text-gray-800 select-none">
                  {c69ConsentData ? c69ConsentData.text1 : "-"}
                  <span className="text-red-500 text-lg ml-1">*</span>
                </span>
              </label>
              {errors.nominee?.c69Accepted && (
                <span className="text-red-500 text-[12px] font-medium ml-8">{errors.nominee.c69Accepted.message}</span>
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
