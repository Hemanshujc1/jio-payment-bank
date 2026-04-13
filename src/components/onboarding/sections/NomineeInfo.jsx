import React, { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import CustomDropdown from "../../common/CustomDropdown";
import CustomDatePicker from "../../common/CustomDatePicker";
import AddressForm from "./AddressForm";
const MOCK_AADHAAR_ADDRESS = {
    addressLine1: "401, XYZ House",
    addressLine2: "Fake Street",
    addressLine3: "150 Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400059",
};

const NomineeInfo = () => {
  const { register, control, setValue, formState: { errors } } = useFormContext();

  const applicant = useWatch({ name: "applicant", control });
  const family = useWatch({ name: "family", control });
  const relationship = useWatch({ name: "nominee.relationship", control });

  const relationshipOptions = [
    "Sister", "Brother", "Mother", "Father", "Spouse", "Son", "Daughter", "Husband", "Wife"
  ].filter(opt => {
    if (applicant.gender === "Male" && opt === "Husband") return false;
    if (applicant.gender === "Female" && opt === "Wife") return false;
    if (applicant.maritalStatus === "Unmarried" && (opt === "Husband" || opt === "Wife" || opt === "Spouse")) return false;
    if (applicant.maritalStatus !== "Married" && opt === "Spouse") return false;
    return true;
  });

  const isAutoPopulated = ["Father", "Mother", "Spouse", "Husband", "Wife"].includes(relationship);


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

  return (
    <div className="flex flex-col gap-8">
      {/* Nominee Name */}
      <div className="flex flex-col gap-4">
        <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
          Nominee Name<span className="text-red-500 ml-0.5">*</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          <div className="flex flex-col gap-1.5">
            <input
              {...register("nominee.firstName")}
              type="text"
              placeholder="First Name"
              readOnly={isAutoPopulated}
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${errors.nominee?.firstName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium ${isAutoPopulated ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'text-gray-900'}`}
            />
            {errors.nominee?.firstName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.nominee.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              {...register("nominee.middleName")}
              type="text"
              placeholder="Middle Name (Optional)"
              readOnly={isAutoPopulated}
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${errors.nominee?.middleName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium ${isAutoPopulated ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'text-gray-900'}`}
            />
            {errors.nominee?.middleName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.nominee.middleName.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              {...register("nominee.lastName")}
              type="text"
              placeholder="Last Name"
              readOnly={isAutoPopulated}
              className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${errors.nominee?.lastName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium ${isAutoPopulated ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'text-gray-900'}`}
            />
            {errors.nominee?.lastName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.nominee.lastName.message}</span>}
          </div>
        </div>
      </div>

      {/* Relationship and DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Relationship */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
            Relationship<span className="text-red-500 ml-0.5">*</span>
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
          {errors.nominee?.relationship && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{errors.nominee.relationship.message}</span>}
        </div>

        {/* DOB */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">
            Date Of Birth<span className="text-red-500 ml-0.5">*</span>
          </span>
          <div className="grow relative z-30">
            <CustomDatePicker name="nominee.dob" maxDate={new Date()} />
          </div>
        </div>
      </div>

      {/* Nominee Communication Address */}
      <AddressForm 
        prefix="nominee" 
        title="Nominee Communication Address" 
        mockAadhaarAddress={MOCK_AADHAAR_ADDRESS} 
      />
    </div>
  );
};

export default NomineeInfo;
