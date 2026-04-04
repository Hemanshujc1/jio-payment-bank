import React, { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import CustomDropdown from "../CustomDropdown";
import CustomDatePicker from "./CustomDatePicker";

const NomineeInfo = () => {
  const { register, control, setValue, formState: { errors } } = useFormContext();
  const labelWidth = "sm:w-40";

  const applicant = useWatch({ name: "applicant", control });
  const family = useWatch({ name: "family", control });
  const relationship = useWatch({ name: "nominee.relationship", control });
  const addressType = useWatch({ name: "nominee.address", control });
  const nomineeAddress = useWatch({ name: "nominee.addressDetails", control });

  const relationshipOptions = [
    "Sister", "Brother", "Mother", "Father", "Spouse", "Son", "Daughter", "Husband", "Wife"
  ].filter(opt => {
    if (applicant.gender === "Male" && opt === "Husband") return false;
    if (applicant.gender === "Female" && opt === "Wife") return false;
    if (applicant.maritalStatus === "Single" && (opt === "Husband" || opt === "Wife" || opt === "Spouse")) return false;
    if (applicant.maritalStatus !== "Married" && opt === "Spouse") return false;
    return true;
  });

  const isAutoPopulated = ["Father", "Mother", "Spouse", "Husband", "Wife"].includes(relationship);

  const MOCK_AADHAAR_ADDRESS = {
    houseNo: "123",
    building: "Corporate House",
    street: "Marol  Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400059",
  };

  useEffect(() => {
    if (relationship === "Father") {
      setValue("nominee.firstName", family.fatherName.firstName);
      setValue("nominee.middleName", family.fatherName.middleName);
      setValue("nominee.lastName", family.fatherName.lastName);
    } else if (relationship === "Mother") {
      setValue("nominee.firstName", family.motherName.firstName);
      setValue("nominee.middleName", family.motherName.middleName);
      setValue("nominee.lastName", family.motherName.lastName);
    } else if (["Spouse", "Husband", "Wife"].includes(relationship)) {
      setValue("nominee.firstName", family.spouseName?.firstName || "");
      setValue("nominee.middleName", family.spouseName?.middleName || "");
      setValue("nominee.lastName", family.spouseName?.lastName || "");
    }
  }, [relationship, family, setValue]);

  useEffect(() => {
    if (addressType === "Same as my communication address") {
      const commAddr = applicant.communicationAddress;
      if (commAddr) {
        setValue("nominee.addressDetails.houseNo", commAddr.houseNo || "");
        setValue("nominee.addressDetails.building", commAddr.building || "");
        setValue("nominee.addressDetails.street", commAddr.street || "");
        setValue("nominee.addressDetails.city", commAddr.city || "");
        setValue("nominee.addressDetails.state", commAddr.state || "");
        setValue("nominee.addressDetails.pincode", commAddr.pincode || "");
      }
    } else if (addressType === "Same as my Aadhaar address") {
      setValue("nominee.addressDetails.houseNo", MOCK_AADHAAR_ADDRESS.houseNo);
      setValue("nominee.addressDetails.building", MOCK_AADHAAR_ADDRESS.building);
      setValue("nominee.addressDetails.street", MOCK_AADHAAR_ADDRESS.street);
      setValue("nominee.addressDetails.city", MOCK_AADHAAR_ADDRESS.city);
      setValue("nominee.addressDetails.state", MOCK_AADHAAR_ADDRESS.state);
      setValue("nominee.addressDetails.pincode", MOCK_AADHAAR_ADDRESS.pincode);
    }
  }, [addressType, applicant.communicationAddress, setValue]);

  return (
    <div className="flex flex-col gap-8">
      {/* Nominee Name */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-[14px]">
          Nominee Name<span className="text-red-500">*</span>:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col gap-1">
            <input
              {...register("nominee.firstName")}
              type="text"
              placeholder="First Name"
              readOnly={isAutoPopulated}
              className={`bg-white rounded-md px-4 py-2 border ${errors.nominee?.firstName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-500 text-[14px] font-medium ${isAutoPopulated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.nominee?.firstName && <span className="text-red-500 text-[12px] font-medium">{errors.nominee.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <input
              {...register("nominee.middleName")}
              type="text"
              placeholder="Middle Name (Optional)"
              readOnly={isAutoPopulated}
              className={`bg-white rounded-md px-4 py-2 border ${errors.nominee?.middleName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-500 text-[14px] font-medium ${isAutoPopulated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.nominee?.middleName && <span className="text-red-500 text-[12px] font-medium">{errors.nominee.middleName.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <input
              {...register("nominee.lastName")}
              type="text"
              placeholder="Last Name"
              readOnly={isAutoPopulated}
              className={`bg-white rounded-md px-4 py-2 border ${errors.nominee?.lastName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-500 text-[14px] font-medium ${isAutoPopulated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.nominee?.lastName && <span className="text-red-500 text-[12px] font-medium">{errors.nominee.lastName.message}</span>}
          </div>
        </div>
      </div>

      {/* Relationship and DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Relationship */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">
            Relationship<span className="text-red-500">*</span>:
          </span>
          <div className="relative z-40">
            <Controller
              name="nominee.relationship"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  options={relationshipOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  error={!!errors.nominee?.relationship}
                />
              )}
            />
          </div>
          {errors.nominee?.relationship && <span className="text-red-500 text-[12px]">{errors.nominee.relationship.message}</span>}
        </div>

        {/* DOB */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">
            Date Of Birth<span className="text-red-500">*</span>:
          </span>
          <div className="grow relative z-30">
            <CustomDatePicker name="nominee.dob" maxDate={new Date()} />
          </div>
        </div>

        {/* Empty space for alignment */}
        <div className="hidden lg:block"></div>
      </div>

      {/* Nominee Communication Address */}
      <div className="flex flex-col gap-4 mt-2">
        <span className="font-semibold text-[14px]">
          Nominee Communication Address<span className="text-red-500">*</span>:
        </span>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("nominee.address")}
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
                  {...register("nominee.address")}
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
                  {...register("nominee.address")}
                  value="Others"
                  className="w-5 h-5 accent-black cursor-pointer"
                />
                <span className="text-[14px] font-medium text-[#4A2b2b]">
                  Others
                </span>
              </label>
            </div>
            {errors.nominee?.address && <span className="text-red-500 text-[12px]">{errors.nominee.address.message}</span>}

            {/* Read-only Address Preview for all cases */}
            {addressType && (nomineeAddress?.houseNo || nomineeAddress?.city || nomineeAddress?.pincode) && (
              <div className="text-[13px] text-gray-600 bg-neutral-light/5 p-3 rounded border border-neutral-light/10 max-w-2xl leading-relaxed">
                <span className="font-bold text-gray-700">Selected Address: </span>
                {[
                  nomineeAddress?.houseNo,
                  nomineeAddress?.building,
                  nomineeAddress?.street,
                  nomineeAddress?.city,
                  nomineeAddress?.state
                ].filter(Boolean).join(", ")}
                {nomineeAddress?.pincode ? ` - ${nomineeAddress.pincode}` : ""}
              </div>
            )}
          </div>

          {/* Conditional Address Details for "Others" */}
          {addressType === "Others" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-light/10 p-4 rounded-lg items-start border border-dashed border-neutral-light/30">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">House/Flat No<span className="text-red-500">*</span>: </span>
                <input
                  {...register("nominee.addressDetails.houseNo")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.nominee?.addressDetails?.houseNo ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="House/Flat No"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Building Name: </span>
                <input
                  {...register("nominee.addressDetails.building")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.nominee?.addressDetails?.building ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="Building Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Street/Area<span className="text-red-500">*</span>: </span>
                <input
                  {...register("nominee.addressDetails.street")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.nominee?.addressDetails?.street ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="Street/Area"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">City<span className="text-red-500">*</span>: </span>
                <input
                  {...register("nominee.addressDetails.city")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.nominee?.addressDetails?.city ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="City"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">State<span className="text-red-500">*</span>: </span>
                <input
                  {...register("nominee.addressDetails.state")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.nominee?.addressDetails?.state ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="State"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Pincode<span className="text-red-500">*</span>: </span>
                <input
                  {...register("nominee.addressDetails.pincode")}
                  maxLength={6}
                  className={`bg-white rounded-md px-3 py-2 border ${
                    errors.nominee?.addressDetails?.pincode ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="6-digit Pincode"
                />
              </div>
              
              {(errors.nominee?.addressDetails?.houseNo || 
                errors.nominee?.addressDetails?.street || 
                errors.nominee?.addressDetails?.city || 
                errors.nominee?.addressDetails?.state || 
                errors.nominee?.addressDetails?.pincode) && (
                <span className="text-red-500 text-[12px] font-medium sm:col-span-2 lg:col-span-3">
                  Please fill all mandatory nominee address fields.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NomineeInfo;
