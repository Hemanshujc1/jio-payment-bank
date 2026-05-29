import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import NomineeChoice from "../sections/NomineeChoice";
import NomineeInfo from "../sections/NomineeInfo";
import GuardianInfo from "../sections/GuardianInfo";
import NomineeConsent from "../sections/NomineeConsent";
import { differenceInYears } from "date-fns";
import { parseDate } from "../../../utils/validationUtils";
import { useToast } from "../../ui/Toast";
import { useNomineeValidation } from "../hooks/useNomineeValidation";

const NomineeDetailsTab = ({ onNext }) => {
  const { getValues, setValue, register, setError, clearErrors, formState: { errors } } = useFormContext();
  const toast = useToast();
  
  const nomineeVal = useWatch({ name: "nominee" }) || {};
  const guardianVal = useWatch({ name: "guardian" }) || {};
  const applicantVal = useWatch({ name: "applicant" }) || {};
  const nomineeConsentData = useWatch({ name: "onboarding.nomineeConsentData" });

  const provideNominee = nomineeVal.provide;
  const nomineeDob = nomineeVal.dob;

  const isMinor = nomineeDob ? differenceInYears(new Date(), parseDate(nomineeDob)) < 18 : false;

  const { handleProceed } = useNomineeValidation({
    onNext,
    toast,
    getValues,
    setValue,
    setError,
    clearErrors,
  });

  const onProceedClick = () => {
    handleProceed(provideNominee, nomineeVal, guardianVal, applicantVal);
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
            <NomineeConsent 
              register={register} 
              errors={errors} 
              nomineeConsentData={nomineeConsentData} 
            />
          )}
        </div>

        <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
          <ProceedButton onClick={onProceedClick} className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" />
        </div>       
      </div>
    </div>
  );
};

export default NomineeDetailsTab;
