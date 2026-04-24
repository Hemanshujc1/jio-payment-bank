import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

const AadhaarAddressSection = ({ mockAadhaarAddress }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const sameAsAadhaar = watch("applicant.sameAsAadhaar");
  const prevSameAsAadhaar = useRef(sameAsAadhaar);

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
    } else if (!sameAsAadhaar && prevSameAsAadhaar.current === true) {
      // Clear fields when unchecked
      setValue("applicant.communicationAddress.addressLine1", "");
      setValue("applicant.communicationAddress.addressLine2", "");
      setValue("applicant.communicationAddress.addressLine3", "");
      setValue("applicant.communicationAddress.city", "");
      setValue("applicant.communicationAddress.state", "");
      setValue("applicant.communicationAddress.pincode", "");
    }
    prevSameAsAadhaar.current = sameAsAadhaar;
  }, [sameAsAadhaar, mockAadhaarAddress, setValue]);

  return (
    <div className="mt-2 sm:mt-4 border-t border-neutral-light/50 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="font-bold text-[15px] sm:text-[16px] text-gray-900">
          Communication Address
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            {...register("applicant.sameAsAadhaar")}
            className="w-5 h-5 border-2 border-[#D1A054] accent-black cursor-pointer rounded-sm"
          />
          <span className="text-[13px] sm:text-[14px] font-bold text-gray-600 transition-colors group-hover:text-black">
            Same as Aadhaar Address
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {/* Address Line 1 */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Address Line 1<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.addressLine1")}
            maxLength={100}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.addressLine1
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="Address Line 1"
          />
          {errors.applicant?.communicationAddress?.addressLine1 && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.addressLine1.message}</span>}
        </div>

        {/* Address Line 2 */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Address Line 2 (Optional)
          </span>
          <input
            {...register("applicant.communicationAddress.addressLine2")}
            maxLength={100}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.addressLine2
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="Address Line 2"
          />
          {errors.applicant?.communicationAddress?.addressLine2 && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.addressLine2.message}</span>}
        </div>

        {/* Address Line 3 */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Address Line 3 (Optional)
          </span>
          <input
            {...register("applicant.communicationAddress.addressLine3")}
            maxLength={100}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.addressLine3
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="Address Line 3"
          />
          {errors.applicant?.communicationAddress?.addressLine3 && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.addressLine3.message}</span>}
        </div>

        {/* Pincode */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Pincode<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.pincode")}
            maxLength={6}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); }}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.pincode
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="6-digit Pincode"
          />
          {errors.applicant?.communicationAddress?.pincode && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.pincode.message}</span>}
        </div>
        {/* City */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            City<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.city")}
            maxLength={20}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.city
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="City"
          />
          {errors.applicant?.communicationAddress?.city && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.city.message}</span>}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            State<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.state")}
            maxLength={20}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.state
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="State"
          />
          {errors.applicant?.communicationAddress?.state && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.state.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default AadhaarAddressSection;
