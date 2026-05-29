import React from 'react';
import { useFormContext } from 'react-hook-form';
import ProceedButton from "../../common/ProceedButton";
import FamilyDetails from "../sections/FamilyDetails";
import FinancialDetails from "../sections/FinancialDetails";
import { useToast } from "../../ui/Toast";
import { useFamilyFinancialValidation } from "../hooks/useFamilyFinancialValidation";

const FamilyFinancialDetailsTab = ({ onNext }) => {
  const { trigger, watch, getValues, setError, clearErrors } = useFormContext();
  const toast = useToast();

  const { handleProceed } = useFamilyFinancialValidation({
    trigger,
    watch,
    getValues,
    setError,
    clearErrors,
    toast,
    onNext,
  });

  return (
    <div className="w-full flex flex-col px-3 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-0 items-center text-black font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6">
        <FamilyDetails />
        <div className="border-t border-gray-100 w-full opacity-50" />
        <FinancialDetails />
        <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
          <ProceedButton 
            onClick={handleProceed}
            className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyFinancialDetailsTab;
