import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { parseDate } from "../../../utils/validationUtils";

const AddressForm = ({ prefix, title, mockAadhaarAddress }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const addressType = watch(`${prefix}.address`);
  const currentAddress = watch(`${prefix}.addressDetails`);
  const applicantAddress = watch("applicant.communicationAddress");

  const getError = (path) => {
    const parts = path.split(".");
    let current = errors;
    for (const part of parts) {
      if (!current) return null;
      current = current[part];
    }
    return current;
  };

  useEffect(() => {
    let targetAddress = null;

    if (addressType === "Same as my communication address" && applicantAddress) {
      targetAddress = applicantAddress;
    } else if (addressType === "Same as my Aadhaar address" && mockAadhaarAddress) {
      targetAddress = mockAadhaarAddress;
    }

    if (targetAddress) {
      const currentJSON = JSON.stringify(currentAddress || {});
      const targetJSON = JSON.stringify(targetAddress || {});
      
      if (currentJSON !== targetJSON) {
        setValue(`${prefix}.addressDetails`, targetAddress);
      }
    }
  }, [addressType, applicantAddress, mockAadhaarAddress, setValue, prefix, currentAddress]);

  const error = getError(prefix);

  return (
    <div className="flex flex-col gap-4 mt-2 sm:mt-4">
      <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
        {title}<span className="text-red-500 ml-0.5">*</span>
      </span>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                {...register(`${prefix}.address`)}
                value="Same as my communication address"
                className="w-5 h-5 accent-black cursor-pointer shadow-sm"
              />
              <span className="text-[14px] font-bold text-gray-600 transition-colors group-hover:text-black">
                Same as my communication address
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                {...register(`${prefix}.address`)}
                value="Same as my Aadhaar address"
                className="w-5 h-5 accent-black cursor-pointer shadow-sm"
              />
              <span className="text-[14px] font-bold text-gray-600 transition-colors group-hover:text-black">
                Same as my Aadhaar address
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                {...register(`${prefix}.address`)}
                value="Others"
                className="w-5 h-5 accent-black cursor-pointer shadow-sm"
              />
              <span className="text-[14px] font-bold text-gray-600 transition-colors group-hover:text-black">
                Others
              </span>
            </label>
          </div>
          {error?.address && (
            <span className="text-red-500 text-[12px]">
              {error.address.message}
            </span>
          )}

          {/* Read-only Address Preview */}
          {addressType && addressType !== "Others" &&
            (currentAddress?.addressLine1 ||
              currentAddress?.city ||
              currentAddress?.pincode) && (
              <div className="text-[13px] sm:text-[14px] text-gray-600 max-w-3xl leading-relaxed">
                <span className="font-bold text-gray-800">Selected Address: </span>
                <span className="font-medium">
                  {[
                    currentAddress?.addressLine1,
                    currentAddress?.addressLine2,
                    currentAddress?.addressLine3,
                    currentAddress?.city,
                    currentAddress?.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {currentAddress?.pincode ? ` - ${currentAddress.pincode}` : ""}
                </span>
              </div>
            )}
        </div>

        {/* Conditional Address Details for "Others" */}
        {addressType === "Others" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5 sm:p-6 rounded-2xl items-start">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                Address Line 1<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.addressLine1`)}
                maxLength={100}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.addressLine1
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="Address Line 1"
              />
              {error?.addressDetails?.addressLine1 && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.addressDetails.addressLine1.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">Address Line 2 (Optional)</span>
              <input
                {...register(`${prefix}.addressDetails.addressLine2`)}
                maxLength={100}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.addressLine2
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="Address Line 2"
              />
              {error?.addressDetails?.addressLine2 && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.addressDetails.addressLine2.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                Address Line 3 (Optional)
              </span>
              <input
                {...register(`${prefix}.addressDetails.addressLine3`)}
                maxLength={100}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.addressLine3
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="Address Line 3"
              />
              {error?.addressDetails?.addressLine3 && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.addressDetails.addressLine3.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                Pincode<span className="text-red-500">*</span>
              </span>
              <input
                {...register(`${prefix}.addressDetails.pincode`)}
                maxLength={6}
                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); }}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.pincode
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="6-digit Pincode"
              />
              {error?.addressDetails?.pincode && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.addressDetails.pincode.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                City<span className="text-red-500">*</span>
              </span>
              <input
                {...register(`${prefix}.addressDetails.city`)}
                maxLength={20}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.city
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="City"
              />
              {error?.addressDetails?.city && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.addressDetails.city.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                State<span className="text-red-500">*</span>
              </span>
              <input
                {...register(`${prefix}.addressDetails.state`)}
                maxLength={20}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.state
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="State"
              />
              {error?.addressDetails?.state && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.addressDetails.state.message}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
