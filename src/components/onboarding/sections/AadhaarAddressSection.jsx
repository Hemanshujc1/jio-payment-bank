import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import onboardingService from "../../../services/onboardingService";
import {
  cloneAddress,
  setAddressFields,
  clearAddressFields,
  mapPincodeResponse,
} from "../../../utils/addressUtils";

const AadhaarAddressSection = ({ aadhaarAddress, onSameAsAadhaarChange }) => {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext();

  const sameAsAadhaar = watch("applicant.sameAsAadhaar");
  // Watch pincode from the master field (not addressLine* anymore)
  const pincode = watch("applicant.communicationAddress.pincode");
  const prevSameAsAadhaar = useRef(sameAsAadhaar);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  useEffect(() => {
    if (sameAsAadhaar && aadhaarAddress) {
      const cloned = cloneAddress(aadhaarAddress, "CURRENT", true);
      setAddressFields(setValue, "applicant.communicationAddress", cloned, true);
    } else if (!sameAsAadhaar && prevSameAsAadhaar.current === true) {
      // Clear fields when unchecked
      clearAddressFields(setValue, "applicant.communicationAddress");
    }
    prevSameAsAadhaar.current = sameAsAadhaar;
  }, [sameAsAadhaar, aadhaarAddress, setValue]);

  // Pincode lookup — ONLY when not sameAsAadhaar (Others mode)
  useEffect(() => {
    const lookupPincode = async () => {
      if (sameAsAadhaar) return; // Rule 1: no API call when copying Aadhaar
      if (pincode?.length === 6) {
        setIsPincodeLoading(true);
        try {
          const res = await onboardingService.getPincodeDetails(pincode);
          if (res.cityName && res.stateName) {
            const mapped = mapPincodeResponse(res);
            setValue("applicant.communicationAddress.city", mapped.city, { shouldValidate: true });
            setValue("applicant.communicationAddress.district", mapped.district, { shouldValidate: true });
            setValue("applicant.communicationAddress.state", mapped.state, { shouldValidate: true });
            setValue("applicant.communicationAddress.stateCode", mapped.stateCode, { shouldValidate: true });
            clearErrors("applicant.communicationAddress.pincode");
          } else if (res.error) {
            setError("applicant.communicationAddress.pincode", {
              type: "manual",
              message: res.error.message || "Pin code not found",
            });
            setValue("applicant.communicationAddress.city", "");
            setValue("applicant.communicationAddress.state", "");
            setValue("applicant.communicationAddress.district", "");
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
            defaultChecked={false}
            onChange={(e) => {
              register("applicant.sameAsAadhaar").onChange(e);
              onSameAsAadhaarChange?.(e.target.checked);
            }}
            className="w-5 h-5 border-2 border-[#D1A054] accent-black cursor-pointer rounded-sm"
          />
          <span className="text-[13px] sm:text-[14px] font-bold text-gray-600 transition-colors group-hover:text-black">
            Same as Aadhaar Address
          </span>
        </label>
      </div>

      {sameAsAadhaar && errors.applicant?.communicationAddress && (
        <div className="mb-4 p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <p className="text-red-600 text-[12px] font-medium">
            The communication address is invalid. Please enter address manually.
          </p>
        </div>
      )}

      {/*  Manual entry form — hidden when sameAsAadhaar checked */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 ${sameAsAadhaar ? "hidden" : ""}`}>

        {/* Line 1 (mapped to houseNumber/primary address) */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Address Line 1<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.line1")}
            maxLength={200}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.line1
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="Address Line 1"
          />
          {errors.applicant?.communicationAddress?.line1 && (
            <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
              {errors.applicant.communicationAddress.line1.message}
            </span>
          )}
        </div>

        {/* Line 2 (Optional) */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Address Line 2 (Optional)
          </span>
          <input
            {...register("applicant.communicationAddress.line2")}
            maxLength={200}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.line2
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="Address Line 2"
          />
          {errors.applicant?.communicationAddress?.line2 && (
            <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
              {errors.applicant.communicationAddress.line2.message}
            </span>
          )}
        </div>

        {/* Line 3 (Optional) */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            Address Line 3 (Optional)
          </span>
          <input
            {...register("applicant.communicationAddress.line3")}
            maxLength={200}
            className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.line3
                ? "border-red-500"
                : "border-neutral-light focus-within:border-gray-900"
            } text-[14px]`}
            placeholder="Address Line 3"
          />
          {errors.applicant?.communicationAddress?.line3 && (
            <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
              {errors.applicant.communicationAddress.line3.message}
            </span>
          )}
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
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
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
          {errors.applicant?.communicationAddress?.pincode && (
            <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
              {errors.applicant.communicationAddress.pincode.message}
            </span>
          )}
        </div>

        {/* City — auto-filled from pincode API (read-only) */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            City<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.city")}
            readOnly
            className={`bg-gray-100 rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.city
                ? "border-red-500"
                : "border-neutral-light"
            } text-[14px] cursor-not-allowed text-gray-500`}
            placeholder="City"
          />
          {errors.applicant?.communicationAddress?.city && (
            <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
              {errors.applicant.communicationAddress.city.message}
            </span>
          )}
        </div>

        {/* State — auto-filled from pincode API (read-only) */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
            State<span className="text-red-500">*</span>
          </span>
          <input
            {...register("applicant.communicationAddress.state")}
            readOnly
            className={`bg-gray-100 rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
              errors.applicant?.communicationAddress?.state
                ? "border-red-500"
                : "border-neutral-light"
            } text-[14px] cursor-not-allowed text-gray-500`}
            placeholder="State"
          />
          {errors.applicant?.communicationAddress?.state && (
            <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
              {errors.applicant.communicationAddress.state.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarAddressSection;
