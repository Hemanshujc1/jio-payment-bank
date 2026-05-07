import React from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import AadhaarFieldGrid from "../sections/AadhaarFieldGrid";
import AadhaarAddressSection from "../sections/AadhaarAddressSection";

const AadhaarDetailsTab = ({ onNext, kycData }) => {
  const { trigger, setValue } = useFormContext();

  const [sameAsAadhaar, setSameAsAadhaar] = React.useState(true);

  // ✅ Format DOB (01-09-1987 → 01/09/1987)
  const formatDOB = (dob) => {
    if (!dob) return "";
    const [dd, mm, yyyy] = dob.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  // ✅ Convert Base64 → Image
  const getImageSrc = (base64) => {
    return base64 ? `data:image/jpeg;base64,${base64}` : "/jpb/2.jpeg";
  };

  // ✅ Format Aadhaar Address (for display)
  const formatAddress = (addr) => {
    if (!addr) return "";
    return [
      addr.houseNumber,
      addr.landmark,
      addr.locality,
      addr.district,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // ✅ Populate form fields
  React.useEffect(() => {
    if (!kycData) return;

    const fullName = kycData.name || "";
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

    setValue("applicant.dob", formatDOB(kycData.dob));

    // Address mapping
    if (kycData.address) {
      const addr = kycData.address;

      setValue("applicant.communicationAddress.addressLine1", addr.houseNumber || "");
      setValue("applicant.communicationAddress.addressLine2", addr.landmark || "");
      setValue("applicant.communicationAddress.addressLine3", addr.locality || "");
      setValue("applicant.communicationAddress.district", addr.district || "");
      setValue("applicant.communicationAddress.state", addr.state || "");
      setValue("applicant.communicationAddress.pincode", addr.pincode || "");
    }

  }, [kycData, setValue]);

  // ✅ Same as Aadhaar toggle
  const handleSameAddressChange = (checked) => {
    setSameAsAadhaar(checked);

    if (checked && kycData?.address) {
      const addr = kycData.address;

      setValue("applicant.communicationAddress.addressLine1", addr.houseNumber || "");
      setValue("applicant.communicationAddress.addressLine2", addr.landmark || "");
      setValue("applicant.communicationAddress.addressLine3", addr.locality || "");
      setValue("applicant.communicationAddress.district", addr.district || "");
      setValue("applicant.communicationAddress.state", addr.state || "");
      setValue("applicant.communicationAddress.pincode", addr.pincode || "");
    } else {
      // Clear fields
      setValue("applicant.communicationAddress.addressLine1", "");
      setValue("applicant.communicationAddress.addressLine2", "");
      setValue("applicant.communicationAddress.addressLine3", "");
      setValue("applicant.communicationAddress.district", "");
      setValue("applicant.communicationAddress.state", "");
      setValue("applicant.communicationAddress.pincode", "");
    }
  };

  // ✅ Proceed validation
  const handleProceed = async () => {
    const isValid = await trigger([
      "applicant.firstName",
      "applicant.lastName",
      "applicant.gender",
      "applicant.dob",
      "applicant.communicationAddress",
    ]);

    if (isValid) onNext();
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
              {kycData?.address
                ? formatAddress(kycData.address)
                : "Loading..."}
            </p>
          </div>

          {/* Communication Address Header + Checkbox */}
          {/* <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Communication Address
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sameAsAadhaar}
                onChange={(e) =>
                  handleSameAddressChange(e.target.checked)
                }
              />
              <label className="text-sm text-gray-700">
                Same as Aadhaar Address
              </label>
            </div>
          </div> */}

          {/* Address Section */}
          <AadhaarAddressSection
            aadhaarAddress={kycData?.address}
            sameAsAadhaar={sameAsAadhaar}
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