import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import NomineeChoice from "../sections/NomineeChoice";
import NomineeInfo from "../sections/NomineeInfo";
import GuardianInfo from "../sections/GuardianInfo";
import { differenceInYears } from "date-fns";
import { parseDate } from "../../../utils/validationUtils";

const NomineeDetailsTab = ({ onNext }) => {
  const { trigger } = useFormContext();
  const provideNominee = useWatch({ name: "nominee.provide" });
  const nomineeDob = useWatch({ name: "nominee.dob" });

  const isMinor = nomineeDob ? differenceInYears(new Date(), parseDate(nomineeDob)) < 18 : false;

  const handleProceed = async () => {
    let isValid = false;

    if (provideNominee === "Yes") {
      const fieldsToTrigger = ["nominee"];
      if (isMinor) {
        fieldsToTrigger.push("guardian");
      }
      isValid = await trigger(fieldsToTrigger);
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

        <div className="flex justify-center w-full mt-2 sm:mt-4 mb-0">
          <ProceedButton onClick={handleProceed} className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};

export default NomineeDetailsTab;
