import React from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import AadhaarFieldGrid from "../sections/AadhaarFieldGrid";
import AadhaarAddressSection from "../sections/AadhaarAddressSection";
import { useToast } from "../../ui/Toast";
import { focusFirstError } from "../../../utils/validationUtils";

const AadhaarDetailsTab = ({ onNext, kycData }) => {
  const { trigger, setValue } = useFormContext();
  const toast = useToast();

  const [sameAsAadhaar, setSameAsAadhaar] = React.useState(false);

  const formatDOB = (dob) => {
    if (!dob) return "";
    if (dob.includes("-")) {
      const parts = dob.split("-");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy-mm-dd
          return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
        } else {
          // dd-mm-yyyy
          return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
        }
      }
    }
    if (dob.includes("/")) {
      const parts = dob.split("/");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy/mm/dd
          return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
        } else {
          // dd/mm/yyyy
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
    return [
      addr.houseNumber,
      addr.landmark,
      addr.locality,
      addr.district,
      addr.city,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const aadhaarAddress = kycData?.address || null;

  React.useEffect(() => {
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

    setValue(
      "applicant.gender",
      kycData.gender === "M" ? "Male" : "Female"
    );

    setValue("applicant.dob", formatDOB(kycData.dob) || "");

    // ℹ️ Communication address fields are intentionally NOT set here.
    // They are populated only when the user ticks "Same as Aadhaar Address",
    // or filled manually by the user.

  }, [kycData, setValue]);

  const handleSameAddressChange = (checked) => {
    setSameAsAadhaar(checked);

    if (checked && aadhaarAddress) {
      const addr = aadhaarAddress;
      const communicationAddress = {
        addressLine1: addr.houseNumber || "",
        addressLine2: addr.landmark || "",
        addressLine3: addr.locality || "",
        city: addr.city || addr.postOffice || addr.district || "",
        state: addr.state || "",
        stateCode: addr.stateCode || "",
        district: addr.district || "",
        pincode: addr.pincode || "",
      };

      // 📋 Log communication address copied from Aadhaar
      console.log("[SameAsAadhaar] Communication Address copied:", communicationAddress);

      setValue("applicant.communicationAddress.addressLine1", communicationAddress.addressLine1, { shouldValidate: true });
      setValue("applicant.communicationAddress.addressLine2", communicationAddress.addressLine2, { shouldValidate: true });
      setValue("applicant.communicationAddress.addressLine3", communicationAddress.addressLine3, { shouldValidate: true });
      setValue("applicant.communicationAddress.city", communicationAddress.city, { shouldValidate: true });
      setValue("applicant.communicationAddress.state", communicationAddress.state, { shouldValidate: true });
      setValue("applicant.communicationAddress.stateCode", communicationAddress.stateCode, { shouldValidate: true });
      setValue("applicant.communicationAddress.district", communicationAddress.district, { shouldValidate: true });
      setValue("applicant.communicationAddress.pincode", communicationAddress.pincode, { shouldValidate: true });
    } else {
      // Clear fields when unchecked
      setValue("applicant.communicationAddress.addressLine1", "");
      setValue("applicant.communicationAddress.addressLine2", "");
      setValue("applicant.communicationAddress.addressLine3", "");
      setValue("applicant.communicationAddress.city", "");
      setValue("applicant.communicationAddress.state", "");
      setValue("applicant.communicationAddress.stateCode", "");
      setValue("applicant.communicationAddress.district", "");
      setValue("applicant.communicationAddress.pincode", "");
    }
  };

  const handleProceed = async () => {
    // Check UIDAI address completeness
    const addr = kycData?.address || {};
    const isMandatoryMissing = !addr.district || !addr.state || !addr.pincode || !addr.city ;
    const isAllLocalMissing = !addr.houseNumber && !addr.locality && !addr.landmark && !addr.street;

    if (isMandatoryMissing || isAllLocalMissing) {
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

  return (
    <div className="w-full flex flex-col px-4 md:px-8 pt-4 pb-2 items-center text-black font-sans">

      {/* Title */}
      <h2 className="font-bold text-2xl mb-4 text-center text-gray-800">
        Details as per Aadhaar
      </h2>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl">

        {/* Image */}
        <div className="w-40 h-48 bg-gray-100 rounded-xl border p-2 shadow-sm">
          <img
            src={getImageSrc(kycData?.photo)}
            alt="user"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-6 w-full">

          {/* Identity */}
          <AadhaarFieldGrid />

          {/* Aadhaar Address */}
          <div className="p-4 bg-gray-50 rounded-xl border">
            <h3 className="font-semibold text-gray-800 mb-2">
              Aadhaar Address
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed">
              {aadhaarAddress ? formatAddress(aadhaarAddress) : "Loading..."}
            </p>
          </div>

          {/* Address Section */}
          <AadhaarAddressSection
            aadhaarAddress={aadhaarAddress}
            sameAsAadhaar={sameAsAadhaar}
            onSameAsAadhaarChange={handleSameAddressChange}
          />
        </div>
      </div>

      {/* Proceed */}
      <div className="mt-6">
        <ProceedButton onClick={handleProceed} />
      </div>
    </div>
  );
};

export default AadhaarDetailsTab;