import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import onboardingService from "../../../services/onboardingService";
import {
  cloneAddress,
  setAddressFields,
  clearAddressFields,
  mapPincodeResponse,
  getDisplayAddress,
} from "../../../utils/addressUtils";

const AddressForm = ({ prefix, title, aadhaarAddress }) => {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    setError,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const addressType = watch(`${prefix}.address`);
  const currentAddress = watch(`${prefix}.addressDetails`);
  //Read communication address using master field names (line1, etc.)
  const applicantAddress = watch("applicant.communicationAddress");

  const prevAddressType = React.useRef(addressType);

  const getError = (path) => {
    const parts = path.split(".");
    let current = errors;
    for (const part of parts) {
      if (!current) return null;
      current = current[part];
    }
    return current;
  };

  // clone with NO transformation
  useEffect(() => {
    let targetAddress = null;

    if (addressType === "Same as my communication address" && applicantAddress) {
      // exact copy of communication address
      targetAddress = cloneAddress(applicantAddress);
    } else if (addressType === "Same as my Aadhaar address" && aadhaarAddress) {
      // exact copy of Aadhaar address
      targetAddress = cloneAddress(aadhaarAddress);
    }

    if (targetAddress) {
      const currentJSON = JSON.stringify(currentAddress || {});
      const targetJSON = JSON.stringify(targetAddress || {});
      if (currentJSON !== targetJSON) {
        setAddressFields(setValue, `${prefix}.addressDetails`, targetAddress, false);
      }
    } else if (addressType === "Others" && prevAddressType.current !== "Others") {
      // When switching to Others, clear auto-filled fields (keep manually entered)
      // Only clear if we were previously in a copy mode
      clearAddressFields(setValue, `${prefix}.addressDetails`);
    }

    prevAddressType.current = addressType;
  }, [
    addressType,
    applicantAddress,
    aadhaarAddress,
    setValue,
    prefix,
    currentAddress,
  ]);

  const pincode = watch(`${prefix}.addressDetails.pincode`);

  //  Pincode lookup — ONLY for "Others" mode
  useEffect(() => {
    let isSubscribed = true;

    const lookupPincode = async () => {
      if (addressType !== "Others") return;
      
      // Ensure the pincode hasn't been cleared synchronously by the other effect
      const currentFormPincode = getValues(`${prefix}.addressDetails.pincode`);
      if (currentFormPincode !== pincode) return;

      if (pincode?.length === 6) {
        setIsPincodeLoading(true);
        try {
          const res = await onboardingService.getPincodeDetails(pincode);
          
          if (!isSubscribed) return;
          // Verify again after the async call in case it was cleared while waiting
          if (getValues(`${prefix}.addressDetails.pincode`) !== pincode) return;

          if (res.cityName && res.stateName) {
            const mapped = mapPincodeResponse(res);
            // Rule 2: only set city/district/state/stateCode from pincode API
            setValue(`${prefix}.addressDetails.city`, mapped.city, { shouldValidate: true });
            setValue(`${prefix}.addressDetails.district`, mapped.district, { shouldValidate: true });
            setValue(`${prefix}.addressDetails.state`, mapped.state, { shouldValidate: true });
            setValue(`${prefix}.addressDetails.stateCode`, mapped.stateCode, { shouldValidate: true });
            clearErrors(`${prefix}.addressDetails.pincode`);
          } else if (res.error) {
            setError(`${prefix}.addressDetails.pincode`, {
              type: "manual",
              message: res.error.message || "Pin code not found",
            });
            setValue(`${prefix}.addressDetails.city`, "");
            setValue(`${prefix}.addressDetails.state`, "");
            setValue(`${prefix}.addressDetails.district`, "");
          }
        } catch (err) {
          if (!isSubscribed) return;
          console.error("Pincode lookup failed", err);
          setError(`${prefix}.addressDetails.pincode`, {
            type: "manual",
            message: "Failed to fetch location details",
          });
        } finally {
          if (isSubscribed) {
            setIsPincodeLoading(false);
          }
        }
      }
    };

    lookupPincode();

    return () => {
      isSubscribed = false;
    };
  }, [pincode, addressType, setValue, setError, clearErrors, prefix, getValues]);

  const error = getError(prefix);

  // "aadhaar" mode for Aadhaar copy, "others" for rest
  // const displayMode = addressType === "Same as my Aadhaar address" ? "aadhaar" : "others";
  // const displayAddress = getDisplayAddress(currentAddress, displayMode);
  const displayAddress = getDisplayAddress(currentAddress);

  return (
    <div className="flex flex-col gap-4 mt-2 sm:mt-4">
      <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
        {title}
        <span className="text-red-500 ml-0.5">*</span>
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

          {/* Error when copied address is invalid */}
          {addressType && addressType !== "Others" && error?.addressDetails && (
            <div className="p-3 flex items-center animate-in fade-in slide-in-from-top-1">
              <p className="text-red-600 text-[12px] font-medium">
                The selected address is invalid. Please select &quot;Others&quot; to enter manually.
              </p>
            </div>
          )}

          {/* display-only address string (not stored/sent in payload) */}
          {addressType &&
            addressType !== "Others" &&
            (currentAddress?.line1 || currentAddress?.city || currentAddress?.pincode) && (
              <div className="text-[13px] sm:text-[14px] text-gray-600 max-w-3xl leading-relaxed">
                <span className="font-bold text-gray-800">Selected Address: </span>
                <span className="font-medium">{displayAddress}</span>
              </div>
            )}
        </div>

        {/*  — manual entry using master field names */}
        {addressType === "Others" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5 sm:p-6 rounded-2xl items-start">
            {/* Line 1 */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                Address Line 1<span className="text-red-500">*</span>:{" "}
              </span>
              <input
                {...register(`${prefix}.addressDetails.line1`)}
                maxLength={200}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.line1
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="Address Line 1"
              />
              {error?.addressDetails?.line1 && (
                <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                  {error.addressDetails.line1.message}
                </span>
              )}
            </div>

            {/* Line 2 */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                Address Line 2 (Optional)
              </span>
              <input
                {...register(`${prefix}.addressDetails.line2`)}
                maxLength={200}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.line2
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="Address Line 2"
              />
              {error?.addressDetails?.line2 && (
                <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                  {error.addressDetails.line2.message}
                </span>
              )}
            </div>

            {/* Line 3 */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                Address Line 3 (Optional)
              </span>
              <input
                {...register(`${prefix}.addressDetails.line3`)}
                maxLength={200}
                className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.line3
                    ? "border-red-500"
                    : "border-neutral-light focus-within:border-gray-900"
                } text-[14px] font-medium text-gray-900`}
                placeholder="Address Line 3"
              />
              {error?.addressDetails?.line3 && (
                <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                  {error.addressDetails.line3.message}
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
                  {...register(`${prefix}.addressDetails.pincode`)}
                  maxLength={6}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all w-full focus:outline-none ${
                    error?.addressDetails?.pincode
                      ? "border-red-500"
                      : "border-neutral-light focus-within:border-gray-900"
                  } text-[14px] font-medium text-gray-900`}
                  placeholder="6-digit Pincode"
                />
                {isPincodeLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {error?.addressDetails?.pincode && (
                <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                  {error.addressDetails.pincode.message}
                </span>
              )}
            </div>

            {/* City — auto-filled from pincode API */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                City<span className="text-red-500">*</span>
              </span>
              <input
                {...register(`${prefix}.addressDetails.city`)}
                readOnly
                className={`bg-gray-100 rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.city
                    ? "border-red-500"
                    : "border-neutral-light"
                } text-[14px] font-medium text-gray-500 cursor-not-allowed`}
                placeholder="City"
              />
              {error?.addressDetails?.city && (
                <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                  {error.addressDetails.city.message}
                </span>
              )}
            </div>

            {/* State — auto-filled from pincode API */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">
                State<span className="text-red-500">*</span>
              </span>
              <input
                {...register(`${prefix}.addressDetails.state`)}
                readOnly
                className={`bg-gray-100 rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${
                  error?.addressDetails?.state
                    ? "border-red-500"
                    : "border-neutral-light"
                } text-[14px] font-medium text-gray-500 cursor-not-allowed`}
                placeholder="State"
              />
              {error?.addressDetails?.state && (
                <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                  {error.addressDetails.state.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
