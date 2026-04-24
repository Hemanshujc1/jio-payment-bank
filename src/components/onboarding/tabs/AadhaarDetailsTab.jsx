import React from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import AadhaarFieldGrid from "../sections/AadhaarFieldGrid";
import AadhaarAddressSection from "../sections/AadhaarAddressSection";

const MOCK_AADHAAR_ADDRESS = {
  addressLine1: "A/1001, FakeVilla Apartment",
  addressLine2: "XYZ Buliding",
  addressLine3: "150 Road",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400013",
};

const AadhaarDetailsTab = ({ onNext }) => {
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
      "applicant.emailId",
      "applicant.communicationAddress",
    ]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="w-full flex flex-col px-3 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-0 items-center text-black font-sans">
      <h2 className="font-bold text-xl sm:text-2xl tracking-wide mb-3 sm:mb-4 text-center text-gray-800">
        Details as per Aadhaar
      </h2>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-center items-center md:items-start w-full max-w-5xl mx-auto mb-2">
        <div className="w-40 h-48 sm:w-46 sm:h-56 shrink-0 bg-gray-50 rounded-2xl border border-gray-100 p-2 shadow-sm">
          <img
            src="/jpb/2.jpeg"
            alt="user img"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="flex flex-col gap-6 w-full text-[14px] sm:text-[15px] sm:pt-2">
          {/* Identity Fields Grid */}
          <AadhaarFieldGrid />

          {/* Aadhaar Address Preview */}
          {/* <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"> */}
          <div className="mt-2 p-4">
            <h3 className="font-bold text-[15px] sm:text-[16px] text-gray-900 mb-1">Aadhaar Address</h3>
            <div className="text-[13px] sm:text-[14px] leading-relaxed text-black">
              {MOCK_AADHAAR_ADDRESS.addressLine1}, {MOCK_AADHAAR_ADDRESS.addressLine2}, {MOCK_AADHAAR_ADDRESS.addressLine3}, {MOCK_AADHAAR_ADDRESS.city}, {MOCK_AADHAAR_ADDRESS.state} - {MOCK_AADHAAR_ADDRESS.pincode}
            </div>
          </div>

          {/* Communication Address Section */}
          <AadhaarAddressSection mockAadhaarAddress={MOCK_AADHAAR_ADDRESS} />
        </div>
      </div>

      <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
        <ProceedButton onClick={handleProceed} className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" />
      </div>
    </div>
  );
};

export default AadhaarDetailsTab;
