import React from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import AadhaarFieldGrid from "../sections/AadhaarFieldGrid";
import AadhaarAddressSection from "../sections/AadhaarAddressSection";

const AadhaarDetailsTab = ({ onNext }) => {
  const MOCK_AADHAAR_ADDRESS = {
    addressLine1: "A/1001, FakeVilla Apartment",
    addressLine2: "XYZ Buliding",
    addressLine3: "150 Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400013",
  };

  const { trigger, setValue } = useFormContext();

  React.useEffect(() => {
    setValue("applicant.firstName", "Ramesh");
    setValue("applicant.middleName", "Kumar");
    setValue("applicant.lastName", "Sharma");
    setValue("applicant.gender", "Male");
    setValue("applicant.dob", "15/08/1990");
  }, [setValue]);

  const handleProceed = async () => {
    const isValid = await trigger([
      "applicant.firstName",
      "applicant.middleName",
      "applicant.lastName",
      "applicant.gender",
      "applicant.dob",
      "applicant.email",
      "applicant.communicationAddress",
    ]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="w-full flex flex-col px-4 md:px-8 py-8 items-center text-black font-sans">
      <h2 className="font-bold text-2xl tracking-wide mb-10 text-center">
        Details as per Aadhaar
      </h2>
      <div className="flex flex-col md:flex-row gap-6 lg:gap-12 justify-center items-start w-full max-w-5xl mx-auto mb-10">
        <div className="w-35 h-48 md:w-46 md:h-56 shrink-0">
          <img
            src="/jpb/2.jpeg"
            alt="user img"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-6 w-full text-[15px] pt-2">
          {/* Identity Fields Grid */}
          <AadhaarFieldGrid />

          {/* Aadhaar Address Preview */}
          <div className="mt-1">
            <h3 className="font-bold text-[16px] text-gray-900 mb-0">Aadhaar Address</h3>
            <div className="text-[14px] leading-relaxed">
              {MOCK_AADHAAR_ADDRESS.addressLine1}, {MOCK_AADHAAR_ADDRESS.addressLine2}, {MOCK_AADHAAR_ADDRESS.addressLine3}, {MOCK_AADHAAR_ADDRESS.city}, {MOCK_AADHAAR_ADDRESS.state} - {MOCK_AADHAAR_ADDRESS.pincode}
            </div>
          </div>

          {/* Communication Address Section */}
          <AadhaarAddressSection mockAadhaarAddress={MOCK_AADHAAR_ADDRESS} />
        </div>
      </div>

      <div className="flex justify-center mb-8 mt-8 pt-1">
        <ProceedButton onClick={handleProceed} className="w-47.5" />
      </div>
    </div>
  );
};

export default AadhaarDetailsTab;
