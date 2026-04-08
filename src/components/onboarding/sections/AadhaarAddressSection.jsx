import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const AadhaarAddressSection = ({ mockAadhaarAddress }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const sameAsAadhaar = watch("applicant.sameAsAadhaar");

  useEffect(() => {
    if (sameAsAadhaar && mockAadhaarAddress) {
      setValue(
        "applicant.communicationAddress.addressLine1",
        mockAadhaarAddress.addressLine1
      );
      setValue(
        "applicant.communicationAddress.addressLine2",
        mockAadhaarAddress.addressLine2
      );
      setValue(
        "applicant.communicationAddress.addressLine3",
        mockAadhaarAddress.addressLine3
      );
      setValue("applicant.communicationAddress.city", mockAadhaarAddress.city);
      setValue(
        "applicant.communicationAddress.state",
        mockAadhaarAddress.state
      );
      setValue(
        "applicant.communicationAddress.pincode",
        mockAadhaarAddress.pincode
      );
    }
  }, [sameAsAadhaar, mockAadhaarAddress, setValue]);

  return (
    <div className="mt-4 border-t border-neutral-light/30 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="font-bold text-[16px] text-gray-900">
          Communication Address
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("applicant.sameAsAadhaar")}
            className="w-5 h-5 border-2 border-[#D1A054] accent-black cursor-pointer rounded-sm"
          />
          <span className="text-[14px] font-medium text-gray-700">
            Same as Aadhaar Address
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        {/* Address Line 1 */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[14px]">
            Address Line 1<span className="text-red-500">*</span>:{" "}
          </span>
          <input
            {...register("applicant.communicationAddress.addressLine1")}
            maxLength={50}
            className={`bg-white rounded-md px-3 py-2 border ${
              errors.applicant?.communicationAddress?.addressLine1
                ? "border-red-500"
                : "border-neutral-light/50"
            } focus:outline-none text-[14px]`}
            placeholder="Address Line 1"
          />
          {errors.applicant?.communicationAddress?.addressLine1 && <span className="text-red-500 text-[12px] font-medium">{errors.applicant.communicationAddress.addressLine1.message}</span>}
        </div>

        {/* Address Line 2 */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[14px]">
            Address Line 2 (Optional):{" "}
          </span>
          <input
            {...register("applicant.communicationAddress.addressLine2")}
            maxLength={50}
            className={`bg-white rounded-md px-3 py-2 border ${
              errors.applicant?.communicationAddress?.addressLine2
                ? "border-red-500"
                : "border-neutral-light/50"
            } focus:outline-none text-[14px]`}
            placeholder="Address Line 2"
          />
          {errors.applicant?.communicationAddress?.addressLine2 && <span className="text-red-500 text-[12px] font-medium">{errors.applicant.communicationAddress.addressLine2.message}</span>}
        </div>

        {/* Address Line 3 */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[14px]">
            Address Line 3 (Optional):{" "}
          </span>
          <input
            {...register("applicant.communicationAddress.addressLine3")}
            maxLength={50}
            className={`bg-white rounded-md px-3 py-2 border ${
              errors.applicant?.communicationAddress?.addressLine3
                ? "border-red-500"
                : "border-neutral-light/50"
            } focus:outline-none text-[14px]`}
            placeholder="Address Line 3"
          />
          {errors.applicant?.communicationAddress?.addressLine3 && <span className="text-red-500 text-[12px] font-medium">{errors.applicant.communicationAddress.addressLine3.message}</span>}
        </div>

        {/* Pincode */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[14px]">
            Pincode<span className="text-red-500">*</span>:{" "}
          </span>
          <input
            {...register("applicant.communicationAddress.pincode")}
            maxLength={6}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); }}
            className={`bg-white rounded-md px-3 py-2 border ${
              errors.applicant?.communicationAddress?.pincode
                ? "border-red-500"
                : "border-neutral-light/50"
            } focus:outline-none text-[14px]`}
            placeholder="6-digit Pincode"
          />
          {errors.applicant?.communicationAddress?.pincode && <span className="text-red-500 text-[12px] font-medium">{errors.applicant.communicationAddress.pincode.message}</span>}
        </div>
        {/* City */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[14px]">
            City<span className="text-red-500">*</span>:{" "}
          </span>
          <input
            {...register("applicant.communicationAddress.city")}
            maxLength={20}
            className={`bg-white rounded-md px-3 py-2 border ${
              errors.applicant?.communicationAddress?.city
                ? "border-red-500"
                : "border-neutral-light/50"
            } focus:outline-none text-[14px]`}
            placeholder="City"
          />
          {errors.applicant?.communicationAddress?.city && <span className="text-red-500 text-[12px] font-medium">{errors.applicant.communicationAddress.city.message}</span>}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[14px]">
            State<span className="text-red-500">*</span>:{" "}
          </span>
          <input
            {...register("applicant.communicationAddress.state")}
            maxLength={20}
            className={`bg-white rounded-md px-3 py-2 border ${
              errors.applicant?.communicationAddress?.state
                ? "border-red-500"
                : "border-neutral-light/50"
            } focus:outline-none text-[14px]`}
            placeholder="State"
          />
          {errors.applicant?.communicationAddress?.state && <span className="text-red-500 text-[12px] font-medium">{errors.applicant.communicationAddress.state.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default AadhaarAddressSection;
