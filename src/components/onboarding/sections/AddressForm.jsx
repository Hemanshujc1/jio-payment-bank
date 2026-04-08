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
    if (addressType === "Same as my communication address" && applicantAddress) {
      setValue(`${prefix}.addressDetails`, applicantAddress);
    } else if (addressType === "Same as my Aadhaar address" && mockAadhaarAddress) {
      setValue(`${prefix}.addressDetails`, mockAadhaarAddress);
    }
  }, [addressType, applicantAddress, mockAadhaarAddress, setValue, prefix]);

  const error = getError(prefix);

  return (
    <div className="flex flex-col gap-4 mt-2">
      <span className="font-semibold text-[14px]">
        {title}<span className="text-red-500">*</span>:
      </span>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register(`${prefix}.address`)}
                value="Same as my communication address"
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <span className="text-[14px] font-medium text-[#4A2b2b]">
                Same as my communication address
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register(`${prefix}.address`)}
                value="Same as my Aadhaar address"
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <span className="text-[14px] font-medium text-[#4A2b2b]">
                Same as my Aadhaar address
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register(`${prefix}.address`)}
                value="Others"
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <span className="text-[14px] font-medium text-[#4A2b2b]">
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
              <div className="text-[13px] text-gray-600 p-3 rounded border border-neutral-light/10 max-w-2xl leading-relaxed">
                <span className="font-bold text-gray-700">Selected Address: </span>
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
              </div>
            )}
        </div>

        {/* Conditional Address Details for "Others" */}
        {addressType === "Others" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-lg items-start border border-dashed border-neutral-light/30">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                Address Line 1<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.addressLine1`)}
                maxLength={50}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.addressLine1
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Address Line 1"
              />
              {error?.addressDetails?.addressLine1 && <span className="text-red-500 text-[12px] font-medium">{error.addressDetails.addressLine1.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">Address Line 2 (Optional): </span>
              <input
                {...register(`${prefix}.addressDetails.addressLine2`)}
                maxLength={50}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.addressLine2
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Address Line 2"
              />
              {error?.addressDetails?.addressLine2 && <span className="text-red-500 text-[12px] font-medium">{error.addressDetails.addressLine2.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                Address Line 3 (Optional):{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.addressLine3`)}
                maxLength={50}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.addressLine3
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Address Line 3"
              />
              {error?.addressDetails?.addressLine3 && <span className="text-red-500 text-[12px] font-medium">{error.addressDetails.addressLine3.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                Pincode<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.pincode`)}
                maxLength={6}
                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); }}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.pincode
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="6-digit Pincode"
              />
              {error?.addressDetails?.pincode && <span className="text-red-500 text-[12px] font-medium">{error.addressDetails.pincode.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                City<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.city`)}
                maxLength={20}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.city
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="City"
              />
              {error?.addressDetails?.city && <span className="text-red-500 text-[12px] font-medium">{error.addressDetails.city.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                State<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.state`)}
                maxLength={20}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.state
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="State"
              />
              {error?.addressDetails?.state && <span className="text-red-500 text-[12px] font-medium">{error.addressDetails.state.message}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
