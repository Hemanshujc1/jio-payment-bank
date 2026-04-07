import React from 'react';
import { useFormContext } from 'react-hook-form';
import ProceedButton from "../../common/ProceedButton";
import FamilyDetails from "../sections/FamilyDetails";
import FinancialDetails from "../sections/FinancialDetails";

const FamilyFinancialDetailsTab = ({ onNext }) => {
  const { trigger, watch } = useFormContext();
  const maritalStatus = watch("applicant.maritalStatus");

  const handleProceed = async () => {
    const fieldsToTrigger = [
      "family.fatherName.firstName",
      "family.fatherName.lastName",
      "family.motherName.firstName",
      "family.motherName.lastName",
      "applicant.maritalStatus",
      "financial.occupation",
      "financial.sourceOfIncome",
      "financial.annualIncome",
    ];

    if (maritalStatus === "Married") {
      fieldsToTrigger.push("family.spouseName.firstName", "family.spouseName.middleName", "family.spouseName.lastName");
    }

    const isValid = await trigger(fieldsToTrigger);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="w-full flex-col px-4 md:px-8 py-8 items-center justify-center flex text-black font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
        <FamilyDetails />
        <FinancialDetails />
        <div className="flex justify-center w-full mt-8 mb-6">
          <ProceedButton 
            onClick={handleProceed}
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyFinancialDetailsTab;
