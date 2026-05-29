import { useState, useEffect } from "react";
import { cloneAddress, setAddressFields, getDisplayAddress } from "../../../utils/addressUtils";
import { focusFirstError } from "../../../utils/validationUtils";

export const useAadhaarDetails = ({ kycData, onNext, setValue, trigger, toast }) => {
  const [sameAsAadhaar, setSameAsAadhaar] = useState(false);
  const aadhaarAddress = kycData?.address || null;

  const formatDOB = (dob) => {
    if (!dob) return "";
    if (dob.includes("-")) {
      const parts = dob.split("-");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
        } else {
          return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
        }
      }
    }
    if (dob.includes("/")) {
      const parts = dob.split("/");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
        } else {
          return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
        }
      }
    }
    return dob;
  };

  const getImageSrc = (base64) => {
    return base64 ? `data:image/jpeg;base64,${base64}` : "/jpb/2.jpeg";
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return getDisplayAddress(addr);
  };

  useEffect(() => {
    if (!kycData) return;

    const fullName = kycData.name || "";
    if (!fullName) return;
    const names = fullName.split(" ");

    const firstName = names[0] || "";
    const lastName = names[names.length - 1] || "";
    const middleName = names.slice(1, -1).join(" ");

    setValue("applicant.firstName", firstName);
    setValue("applicant.middleName", middleName);
    setValue("applicant.lastName", lastName);
    setValue("applicant.gender", kycData.gender === "M" ? "Male" : "Female");
    setValue("applicant.dob", formatDOB(kycData.dob) || "");

  }, [kycData, setValue]);

  const handleSameAddressChange = (checked) => {
    setSameAsAadhaar(checked);

    if (checked && aadhaarAddress) {
      const cloned = cloneAddress(aadhaarAddress, "CURRENT", true);
      console.log("[SameAsAadhaar] Communication Address deep-cloned:", cloned);
      setAddressFields(setValue, "applicant.communicationAddress", cloned, true);
    } else {
      setAddressFields(setValue, "applicant.communicationAddress", null, false);
    }
  };

  const handleProceed = async () => {
    const addr = kycData?.address || {};
    const isMandatoryMissing = !addr.district || !addr.state || !addr.pincode || !addr.city;
    const isLocalMissing = !addr.line1 && !addr.houseNumber && !addr.locality && !addr.street;

    if (isMandatoryMissing || isLocalMissing) {
      toast.error("Incomplete address details. Cannot proceed further.");
      return;
    }

    const isValid = await trigger([
      "applicant.firstName",
      "applicant.lastName",
      "applicant.gender",
      "applicant.dob",
      "applicant.communicationAddress",
    ]);

    if (isValid) {
      onNext();
    } else {
      toast.error("Please enter valid information in all fields.");
      focusFirstError();
    }
  };

  return {
    sameAsAadhaar,
    aadhaarAddress,
    getImageSrc,
    formatAddress,
    handleSameAddressChange,
    handleProceed
  };
};
