import React from 'react';
import { useFormContext } from 'react-hook-form';
import ProceedButton from "../../common/ProceedButton";
import FamilyDetails from "../sections/FamilyDetails";
import FinancialDetails from "../sections/FinancialDetails";
import { checkNamesMatch } from "../../../utils/validationUtils";

const FamilyFinancialDetailsTab = ({ onNext }) => {
  const { trigger, watch, getValues, setError, clearErrors } = useFormContext();
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

    // Clear previous custom cross-match errors so they don't block unnecessarily if fixed
    clearErrors([
      "family.fatherName.firstName",
      "family.motherName.firstName",
      "family.spouseName.firstName"
    ]);

    const isValid = await trigger(fieldsToTrigger);
    
    if (isValid) {
      const data = getValues();
      const applicantFullName = `${data.applicant.firstName} ${data.applicant.middleName || ""} ${data.applicant.lastName}`.replace(/\s+/g, ' ').trim();
      const fatherFullName = `${data.family.fatherName.firstName} ${data.family.fatherName.middleName || ""} ${data.family.fatherName.lastName}`.replace(/\s+/g, ' ').trim();
      const motherFullName = `${data.family.motherName.firstName} ${data.family.motherName.middleName || ""} ${data.family.motherName.lastName}`.replace(/\s+/g, ' ').trim();
      const spouseFullName = maritalStatus === 'Married' 
        ? `${data.family.spouseName?.firstName || ""} ${data.family.spouseName?.middleName || ""} ${data.family.spouseName?.lastName || ""}`.replace(/\s+/g, ' ').trim()
        : "";

      const namesToSync = [
        { label: "Applicant", name: applicantFullName, path: "applicant.firstName" },
        { label: "Father", name: fatherFullName, path: "family.fatherName.firstName" },
        { label: "Mother", name: motherFullName, path: "family.motherName.firstName" },
      ];
      
      if (spouseFullName) {
        namesToSync.push({ label: "Spouse", name: spouseFullName, path: "family.spouseName.firstName" });
      }

      let hasCrossMatchError = false;

      // Cross-branch validation for Spouse Name (since superRefine on root might not trigger for individual field triggers)
      if (maritalStatus === 'Married') {
        const spouse = data.family.spouseName;
        if (!spouse?.firstName?.trim()) {
          setError("family.spouseName.firstName", { type: "manual", message: "Name is required" });
          hasCrossMatchError = true;
        }
        if (!spouse?.lastName?.trim()) {
          setError("family.spouseName.lastName", { type: "manual", message: "Name is required" });
          hasCrossMatchError = true;
        }
      }

      for (let i = 0; i < namesToSync.length; i++) {
        for (let j = i + 1; j < namesToSync.length; j++) {
          if (checkNamesMatch(namesToSync[i].name, namesToSync[j].name)) {
            setError(namesToSync[j].path, {
              type: "manual",
              message: `${namesToSync[j].label} Name cannot be the same as ${namesToSync[i].label} Name`,
            });
            hasCrossMatchError = true;
          }
        }
      }

      if (!hasCrossMatchError) {
        onNext();
      }
    }
  };

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
