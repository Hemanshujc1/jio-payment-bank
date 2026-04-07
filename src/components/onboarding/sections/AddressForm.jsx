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
          {addressType &&
            (currentAddress?.houseNo ||
              currentAddress?.city ||
              currentAddress?.pincode) && (
              <div className="text-[13px] text-gray-600 bg-neutral-light/5 p-3 rounded border border-neutral-light/10 max-w-2xl leading-relaxed">
                <span className="font-bold text-gray-700">Selected Address: </span>
                {[
                  currentAddress?.houseNo,
                  currentAddress?.building,
                  currentAddress?.street,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-light/10 p-4 rounded-lg items-start border border-dashed border-neutral-light/30">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                House/Flat No<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.houseNo`)}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.houseNo
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="House/Flat No"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">Building Name: </span>
              <input
                {...register(`${prefix}.addressDetails.building`)}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.building
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Building Name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                Street/Area<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.street`)}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.street
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Street/Area"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                City<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.city`)}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.city
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="City"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                State<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.state`)}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  error?.addressDetails?.state
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="State"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                Pincode<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.pincode`)}
                maxLength={6}
                className={`bg-white rounded-md px-3 py-2 border ${
                  error?.addressDetails?.pincode
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="6-digit Pincode"
              />
            </div>

            {(error?.addressDetails?.houseNo ||
              error?.addressDetails?.street ||
              error?.addressDetails?.city ||
              error?.addressDetails?.state ||
              error?.addressDetails?.pincode) && (
              <span className="text-red-500 text-[12px] font-medium sm:col-span-2 lg:col-span-3">
                Please fill all mandatory address fields.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
