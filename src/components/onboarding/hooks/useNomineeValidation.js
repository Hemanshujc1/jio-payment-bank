import { differenceInYears } from "date-fns";
import { parseDate, checkNamesMatch, focusFirstError } from "../../../utils/validationUtils";

export const useNomineeValidation = ({
  onNext,
  toast,
  getValues,
  setValue,
  setError,
  clearErrors,
}) => {
  const handleProceed = () => {
    let hasValidationError = false;

    clearErrors([
      "nominee.provide",
      "nominee.firstName",
      "nominee.lastName",
      "nominee.relationship",
      "nominee.dob",
      "nominee.address",
      "nominee.addressDetails.line1",
      "nominee.addressDetails.city",
      "nominee.addressDetails.state",
      "nominee.addressDetails.pincode",
      "guardian.firstName",
      "guardian.lastName",
      "guardian.relationship",
      "guardian.dob",
      "guardian.address",
      "guardian.addressDetails.line1",
      "guardian.addressDetails.city",
      "guardian.addressDetails.state",
      "guardian.addressDetails.pincode",
      "nominee.nomineeConsentAccepted"
    ]);

    const data = getValues();
    const nomineeVal = data.nominee || {};
    const guardianVal = data.guardian || {};
    const applicantVal = data.applicant || {};
    const provideNominee = nomineeVal.provide;

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
      setValue("nominee.addressDetails.line1", "");
      setValue("nominee.addressDetails.line2", "");
      setValue("nominee.addressDetails.line3", "");
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
      setValue("guardian.addressDetails.line1", "");
      setValue("guardian.addressDetails.line2", "");
      setValue("guardian.addressDetails.line3", "");
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
        if (!nomineeVal.addressDetails?.line1?.trim()) {
          setError("nominee.addressDetails.line1", { type: "manual", message: "Address Line 1 is required" });
          hasValidationError = true;
        } else if (nomineeVal.addressDetails.line1.trim().length < 5) {
          setError("nominee.addressDetails.line1", { type: "manual", message: "Address Line 1 must be at least 5 characters" });
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
          if (!guardianVal.addressDetails?.line1?.trim()) {
            setError("guardian.addressDetails.line1", { type: "manual", message: "Address Line 1 is required" });
            hasValidationError = true;
          } else if (guardianVal.addressDetails.line1.trim().length < 5) {
            setError("guardian.addressDetails.line1", { type: "manual", message: "Address Line 1 must be at least 5 characters" });
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

        // Gender vs Spouse
        const relationship = nomineeVal.relationship;
        if ((applicantVal.gender === "Male" && relationship === "Husband") || 
            (applicantVal.gender === "Female" && relationship === "Wife")) {
          setError("nominee.relationship", {
            type: "manual",
            message: "Please select valid Nominee relation",
          });
          hasValidationError = true;
        }

        // Marital status 
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

  return { handleProceed };
};
