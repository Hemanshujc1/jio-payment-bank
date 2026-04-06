import React, { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import CustomDropdown from "../CustomDropdown";
import CustomDatePicker from "./CustomDatePicker";

const GuardianInfo = () => {
  const { register, control, setValue, formState: { errors } } = useFormContext();
  const addressType = useWatch({ name: "guardian.address", control });
  const guardianAddress = useWatch({ name: "guardian.addressDetails", control });
  const applicant = useWatch({ name: "applicant", control });

  const MOCK_AADHAAR_ADDRESS = {
    houseNo: "123",
    building: "FakeVilla",
    street: "Marol Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400059",
  };

  useEffect(() => {
    if (addressType === "Same as my communication address") {
      const commAddr = applicant.communicationAddress;
      if (commAddr) {
        setValue("guardian.addressDetails.houseNo", commAddr.houseNo || "");
        setValue("guardian.addressDetails.building", commAddr.building || "");
        setValue("guardian.addressDetails.street", commAddr.street || "");
        setValue("guardian.addressDetails.city", commAddr.city || "");
        setValue("guardian.addressDetails.state", commAddr.state || "");
        setValue("guardian.addressDetails.pincode", commAddr.pincode || "");
      }
    } else if (addressType === "Same as my Aadhaar address") {
      setValue("guardian.addressDetails.houseNo", MOCK_AADHAAR_ADDRESS.houseNo);
      setValue("guardian.addressDetails.building", MOCK_AADHAAR_ADDRESS.building);
      setValue("guardian.addressDetails.street", MOCK_AADHAAR_ADDRESS.street);
      setValue("guardian.addressDetails.city", MOCK_AADHAAR_ADDRESS.city);
      setValue("guardian.addressDetails.state", MOCK_AADHAAR_ADDRESS.state);
      setValue("guardian.addressDetails.pincode", MOCK_AADHAAR_ADDRESS.pincode);
    }
  }, [addressType, applicant.communicationAddress, setValue]);

  const hasAddressContent = guardianAddress?.houseNo || guardianAddress?.city || guardianAddress?.pincode;

  return (
    <div className="flex flex-col gap-8 pb-4">
      {/* Guardian Name */}
      <p className="text-blue-600 font-medium text-[14px]">
        Note: Please provide guardian details as the nominee is a minor.
      </p>
      {/* Guardian Name */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-[14px]">
          Guardian Name<span className="text-red-500">*</span>:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col gap-1">
            <input
              {...register("guardian.firstName")}
              type="text"
              placeholder="First Name"
              className={`bg-white rounded-md px-4 py-2 border ${errors.guardian?.firstName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-500 text-[14px] font-medium`}
            />
            {errors.guardian?.firstName && <span className="text-red-500 text-[12px] font-medium">{errors.guardian.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <input
              {...register("guardian.middleName")}
              type="text"
              placeholder="Middle Name (Optional)"
              className={`bg-white rounded-md px-4 py-2 border ${errors.guardian?.middleName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-500 text-[14px] font-medium`}
            />
            {errors.guardian?.middleName && <span className="text-red-500 text-[12px] font-medium">{errors.guardian.middleName.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <input
              {...register("guardian.lastName")}
              type="text"
              placeholder="Last Name"
              className={`bg-white rounded-md px-4 py-2 border ${errors.guardian?.lastName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-500 text-[14px] font-medium`}
            />
            {errors.guardian?.lastName && <span className="text-red-500 text-[12px] font-medium">{errors.guardian.lastName.message}</span>}
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
          <div className="relative z-20">
            <Controller
              name="guardian.relationship"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  options={["Father", "Mother", "Uncle", "Aunt"]}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  error={!!errors.guardian?.relationship}
                />
              )}
            />
          </div>
          {errors.guardian?.relationship && <span className="text-red-500 text-[12px]">{errors.guardian.relationship.message}</span>}
        </div>

        {/* DOB */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">
            Date Of Birth<span className="text-red-500">*</span>:
          </span>
          <div className="grow relative z-10">
            <CustomDatePicker 
              name="guardian.dob" 
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))} 
              showAge={true}
            />
          </div>
        </div>

        {/* Empty space for alignment */}
        <div className="hidden lg:block"></div>
      </div>

      {/* Guardian Communication Address */}
      <div className="flex flex-col gap-4 mt-2">
        <span className="font-semibold text-[14px]">
          Guardian Communication Address<span className="text-red-500">*</span>:
        </span>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("guardian.address")}
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
                  {...register("guardian.address")}
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
                  {...register("guardian.address")}
                  value="Others"
                  className="w-5 h-5 accent-black cursor-pointer"
                />
                <span className="text-[14px] font-medium text-[#4A2b2b]">
                  Others
                </span>
              </label>
            </div>
            {errors.guardian?.address && <span className="text-red-500 text-[12px]">{errors.guardian.address.message}</span>}

            {/* Read-only Address Preview for all cases */}
            {addressType && hasAddressContent && (
              <div className="text-[13px] text-gray-600 bg-neutral-light/5 p-3 rounded border border-neutral-light/10 max-w-2xl leading-relaxed">
                <span className="font-bold text-gray-700">Selected Address: </span>
                {[
                  guardianAddress?.houseNo,
                  guardianAddress?.building,
                  guardianAddress?.street,
                  guardianAddress?.city,
                  guardianAddress?.state
                ].filter(Boolean).join(", ")}
                {guardianAddress?.pincode ? ` - ${guardianAddress.pincode}` : ""}
              </div>
            )}
          </div>

          {/* Conditional Address Details for "Others" */}
          {addressType === "Others" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-light/10 p-4 rounded-lg items-start border border-dashed border-neutral-light/30">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">House/Flat No<span className="text-red-500">*</span>: </span>
                <input
                  {...register("guardian.addressDetails.houseNo")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.guardian?.addressDetails?.houseNo ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="House/Flat No"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Building Name: </span>
                <input
                  {...register("guardian.addressDetails.building")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.guardian?.addressDetails?.building ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="Building Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Street/Area<span className="text-red-500">*</span>: </span>
                <input
                  {...register("guardian.addressDetails.street")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.guardian?.addressDetails?.street ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="Street/Area"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">City<span className="text-red-500">*</span>: </span>
                <input
                  {...register("guardian.addressDetails.city")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.guardian?.addressDetails?.city ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="City"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">State<span className="text-red-500">*</span>: </span>
                <input
                  {...register("guardian.addressDetails.state")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.guardian?.addressDetails?.state ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="State"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Pincode<span className="text-red-500">*</span>: </span>
                <input
                  {...register("guardian.addressDetails.pincode")}
                  maxLength={6}
                  className={`bg-white rounded-md px-3 py-2 border ${
                    errors.guardian?.addressDetails?.pincode ? 'border-red-500' : 'border-neutral-light/50'
                  } focus:outline-none text-[14px]`}
                  placeholder="6-digit Pincode"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuardianInfo;
