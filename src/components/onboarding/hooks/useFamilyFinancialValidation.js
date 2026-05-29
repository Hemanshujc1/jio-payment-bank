import { checkNamesMatch, focusFirstError } from "../../../utils/validationUtils";

export const useFamilyFinancialValidation = ({
  trigger,
  watch,
  getValues,
  setError,
  clearErrors,
  toast,
  onNext,
}) => {
  const maritalStatus = watch("applicant.maritalStatus");

  const handleProceed = async () => {
    const fieldsToTrigger = [
      "family.fatherName.firstName",
      "family.fatherName.middleName",
      "family.fatherName.lastName",
      "family.motherName.firstName",
      "family.motherName.middleName",
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
      } else {
        toast.error("Please enter valid information in all fields.");
        focusFirstError();
      }
    } else {
      toast.error("Please enter valid information in all fields.");
      focusFirstError();
    }
  };

  return { handleProceed };
};
