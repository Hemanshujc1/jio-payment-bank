import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import NomineeChoice from "../sections/NomineeChoice";
import NomineeInfo from "../sections/NomineeInfo";
import GuardianInfo from "../sections/GuardianInfo";
import { differenceInYears } from "date-fns";
import { parseDate, checkNamesMatch } from "../../../utils/validationUtils";

const NomineeDetailsTab = ({ onNext }) => {
  const { trigger, getValues, setError, clearErrors } = useFormContext();
  const provideNominee = useWatch({ name: "nominee.provide" });
  const nomineeDob = useWatch({ name: "nominee.dob" });

  const isMinor = nomineeDob ? differenceInYears(new Date(), parseDate(nomineeDob)) < 18 : false;

  const handleProceed = async () => {
    let isValid = false;

    clearErrors([
      "nominee.firstName",
      "guardian.firstName"
    ]);

    if (provideNominee === "Yes") {
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
            setError("guardian.firstName", {
              type: "manual",
              message: "Guardian Name cannot be the same as Nominee Name",
            });
            hasCrossMatchError = true;
          }
        }

        if (hasCrossMatchError) {
          isValid = false;
        }
      }

    } else {
      isValid = await trigger(["nominee.provide"]);
    }

    if (isValid) {
      onNext();
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
        </div>

        <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">

          <ProceedButton onClick={handleProceed} className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};

export default NomineeDetailsTab;
