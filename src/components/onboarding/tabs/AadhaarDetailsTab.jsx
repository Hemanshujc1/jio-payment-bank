import React from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import AadhaarFieldGrid from "../sections/AadhaarFieldGrid";
import AadhaarAddressSection from "../sections/AadhaarAddressSection";
import { useToast } from "../../ui/Toast";
import { useAadhaarDetails } from "../hooks/useAadhaarDetails";

const AadhaarDetailsTab = ({ onNext, kycData }) => {
  const { trigger, setValue } = useFormContext();
  const toast = useToast();

  const {
    sameAsAadhaar,
    aadhaarAddress,
    getImageSrc,
    formatAddress,
    handleSameAddressChange,
    handleProceed
  } = useAadhaarDetails({
    kycData,
    onNext,
    setValue,
    trigger,
    toast
  });

  return (
    <div className="w-full flex flex-col px-4 md:px-8 pt-4 pb-2 items-center text-black font-sans">
      <h2 className="font-bold text-2xl mb-4 text-center text-gray-800">
        Details as per Aadhaar
      </h2>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl">
        <div className="w-40 h-48 bg-gray-100 rounded-xl border p-2 shadow-sm">
          <img
            src={getImageSrc(kycData?.photo)}
            alt="user"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-6 w-full">
          <AadhaarFieldGrid />

          <div className="p-4 bg-gray-50 rounded-xl border">
            <h3 className="font-semibold text-gray-800 mb-2">
              Aadhaar Address
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {aadhaarAddress ? formatAddress(aadhaarAddress) : "Loading..."}
            </p>
          </div>

          <AadhaarAddressSection
            aadhaarAddress={aadhaarAddress}
            sameAsAadhaar={sameAsAadhaar}
            onSameAsAadhaarChange={handleSameAddressChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <ProceedButton onClick={handleProceed} />
      </div>
    </div>
  );
};

export default AadhaarDetailsTab;
