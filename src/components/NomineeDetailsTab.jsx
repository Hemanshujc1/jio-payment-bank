import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ProceedButton from "./ProceedButton";
import NomineeChoice from "./onboarding/NomineeChoice";
import NomineeInfo from "./onboarding/NomineeInfo";
import GuardianInfo from "./onboarding/GuardianInfo";
import { differenceInYears } from "date-fns";
import { parseDate } from "../utils/validationUtils";

const NomineeDetailsTab = ({ onNext }) => {
  const { trigger } = useFormContext();
  const provideNominee = useWatch({ name: "nominee.provide" });
  const nomineeDob = useWatch({ name: "nominee.dob" });

  const isMinor = nomineeDob ? differenceInYears(new Date(), parseDate(nomineeDob)) < 18 : false;

  const handleProceed = async () => {
    const fieldsToTrigger = ["nominee"];

    if (isMinor) {
      fieldsToTrigger.push("guardian");
    }

    const isValid = await trigger(fieldsToTrigger);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="w-full flex-col px-4 md:px-8 py-8 items-center justify-center flex text-black font-sans">
      <div className="w-full max-w-6xl xl:max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <h2 className="font-bold text-[22px] tracking-wide mb-8 text-center">
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

        <div className="flex justify-center w-full mt-10 mb-6">
          <ProceedButton onClick={handleProceed} className="w-fit" />
        </div>
      </div>
    </div>
  );
};

export default NomineeDetailsTab;
