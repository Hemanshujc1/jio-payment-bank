import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import CustomDropdown from "../../common/CustomDropdown";
import CustomDatePicker from "../../common/CustomDatePicker";
import AddressForm from "./AddressForm";
const MOCK_AADHAAR_ADDRESS = {
  addressLine1: "A/1001, FakeVilla Apartment",
  addressLine2: "XYZ Buliding",
  addressLine3: "150 Road",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400013",
};

const GuardianInfo = () => {
  const { register, control, formState: { errors } } = useFormContext();


  return (
    <div className="flex flex-col gap-8 pb-4">
      {/* Guardian Note */}
      <p className="text-blue-600 font-medium text-[14px]">
        Note: Please provide guardian details as the nominee is a minor.
      </p>

      {/* Guardian Name Section */}
      <div className="flex flex-col gap-4">
        <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
          Guardian Name<span className="text-red-500 ml-0.5">*</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          <div className="flex flex-col gap-1.5">
            <input
              {...register("guardian.firstName")}
              type="text"
              placeholder="First Name"
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${errors.guardian?.firstName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium text-gray-900`}
            />
            {errors.guardian?.firstName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.guardian.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              {...register("guardian.middleName")}
              type="text"
              placeholder="Middle Name (Optional)"
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${errors.guardian?.middleName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium text-gray-900`}
            />
            {errors.guardian?.middleName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.guardian.middleName.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              {...register("guardian.lastName")}
              type="text"
              placeholder="Last Name"
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${errors.guardian?.lastName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium text-gray-900`}
            />
            {errors.guardian?.lastName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.guardian.lastName.message}</span>}
          </div>
        </div>
      </div>

      {/* Relationship and DOB Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Relationship */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
            Relationship<span className="text-red-500 ml-0.5">*</span>
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
          {errors.guardian?.relationship && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.guardian.relationship.message}</span>}
        </div>

        {/* DOB */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
            Date Of Birth<span className="text-red-500 ml-0.5">*</span>
          </span>
          <div className="grow relative z-10">
            <CustomDatePicker 
              name="guardian.dob" 
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))} 
            />
          </div>
        </div>
      </div>

      {/* Guardian Communication Address Section */}
      <AddressForm 
        prefix="guardian" 
        title="Guardian Communication Address" 
        mockAadhaarAddress={MOCK_AADHAAR_ADDRESS} 
      />
    </div>
  );
};

export default GuardianInfo;
