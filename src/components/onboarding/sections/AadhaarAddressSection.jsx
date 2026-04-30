import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import onboardingService from "../../../services/onboardingService";

const AadhaarAddressSection = ({ mockAadhaarAddress }) => {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext();
  const sameAsAadhaar = watch("applicant.sameAsAadhaar");
  const pincode = watch("applicant.communicationAddress.pincode");
  const prevSameAsAadhaar = useRef(sameAsAadhaar);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

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

  // Pincode Lookup logic
  useEffect(() => {
    const lookupPincode = async () => {
      if (pincode?.length === 6 && !sameAsAadhaar) {
        setIsPincodeLoading(true);
        try {
          const res = await onboardingService.getPincodeDetails(pincode);
          if (res.cityName && res.stateName) {
            setValue("applicant.communicationAddress.city", res.cityName, { shouldValidate: true });
            setValue("applicant.communicationAddress.state", res.stateName, { shouldValidate: true });
            clearErrors("applicant.communicationAddress.pincode");
          } else if (res.error) {
            setError("applicant.communicationAddress.pincode", {
              type: "manual",
              message: res.error.message || "Pin code not found",
            });
            setValue("applicant.communicationAddress.city", "");
            setValue("applicant.communicationAddress.state", "");
          }
        } catch (err) {
          console.error("Pincode lookup failed", err);
          setError("applicant.communicationAddress.pincode", {
            type: "manual",
            message: "Failed to fetch location details",
          });
        } finally {
          setIsPincodeLoading(false);
        }
      }
    };

    lookupPincode();
  }, [pincode, sameAsAadhaar, setValue, setError, clearErrors]);

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
          <div className="relative">
            <input
              {...register("applicant.communicationAddress.pincode")}
              maxLength={6}
              onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); }}
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all w-full focus:outline-none ${
                errors.applicant?.communicationAddress?.pincode
                  ? "border-red-500"
                  : "border-neutral-light focus-within:border-gray-900"
              } text-[14px]`}
              placeholder="6-digit Pincode"
            />
            {isPincodeLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
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
            readOnly
            className={`bg-gray-100 rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.city
                ? "border-red-500"
                : "border-neutral-light"
            } text-[14px] cursor-not-allowed text-gray-500`}
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
            readOnly
            className={`bg-gray-100 rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.state
                ? "border-red-500"
                : "border-neutral-light"
            } text-[14px] cursor-not-allowed text-gray-500`}
            placeholder="State"
          />
          {errors.applicant?.communicationAddress?.state && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.applicant.communicationAddress.state.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default AadhaarAddressSection;
