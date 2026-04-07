import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import CustomDropdown from "../../common/CustomDropdown";
import CustomDatePicker from "../../common/CustomDatePicker";
import AddressForm from "./AddressForm";

const GuardianInfo = () => {
  const { register, control, formState: { errors } } = useFormContext();

  const MOCK_AADHAAR_ADDRESS = {
    houseNo: "123",
    building: "FakeVilla",
    street: "Marol Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400059",
  };

  return (
    <div className="flex flex-col gap-8 pb-4">
      {/* Guardian Note */}
      <p className="text-blue-600 font-medium text-[14px]">
        Note: Please provide guardian details as the nominee is a minor.
      </p>

      {/* Guardian Name Section */}
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

      {/* Relationship and DOB Section */}
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
