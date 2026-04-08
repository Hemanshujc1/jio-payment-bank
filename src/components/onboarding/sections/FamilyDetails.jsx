import React from 'react';
import { useFormContext } from 'react-hook-form';

const NameFields = ({ prefix, label, error, register }) => (
  <div className="flex flex-col gap-2">
    <span className="font-semibold text-[14px]">{label}<span className="text-red-500">*</span>:</span>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      <div className="flex flex-col gap-1">
        <input 
          {...register(`${prefix}.firstName`)}
          type="text" 
          placeholder="First Name" 
          className={`bg-white rounded-md px-4 py-2 border ${error?.firstName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400 text-[14px]`}
        />
        {error?.firstName && <span className="text-red-500 text-[12px] font-medium">{error.firstName.message}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <input 
          {...register(`${prefix}.middleName`)}
          type="text" 
          placeholder="Middle Name (Optional)" 
          className={`bg-white rounded-md px-4 py-2 border ${error?.middleName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400 text-[14px]`}
        />
        {error?.middleName && <span className="text-red-500 text-[12px] font-medium">{error.middleName.message}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <input 
          {...register(`${prefix}.lastName`)}
          type="text" 
          placeholder="Last Name" 
          className={`bg-white rounded-md px-4 py-2 border ${error?.lastName ? 'border-red-500' : 'border-neutral-light'} shadow-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400 text-[14px]`}
        />
        {error?.lastName && <span className="text-red-500 text-[12px] font-medium">{error.lastName.message}</span>}
      </div>
    </div>
  </div>
);

const FamilyDetails = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const maritalStatus = watch("applicant.maritalStatus");

  return (
    <section className="flex flex-col w-full">
      <h2 className="font-bold text-[22px] tracking-wide mb-8 text-center">
        Family Details
      </h2>
      
      <div className="flex flex-col gap-8">
        
        {/* Marital Status */}
        <div className="flex flex-row gap-3">
          <span className="font-semibold text-[14px]">Marital Status<span className="text-red-500">*</span>:</span>
          <div className="flex items-center gap-6">
            {["Unmarried","Married"].map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  {...register("applicant.maritalStatus")}
                  value={status} 
                  className="w-5 h-5 accent-black cursor-pointer"
                />
                <span className="text-[15px]">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Father Name */}
        <NameFields 
          prefix="family.fatherName" 
          label="Father Name" 
          error={errors.family?.fatherName}
          register={register}
        />

        {/* Mother Name */}
        <NameFields 
          prefix="family.motherName" 
          label="Mother Name" 
          error={errors.family?.motherName}
          register={register}
        />

        {/* Spouse Name (Only if Married) */}
        {maritalStatus === 'Married' && (
          <NameFields 
            prefix="family.spouseName" 
            label="Spouse Name" 
            error={errors.family?.spouseName}
            register={register}
          />
        )}

      </div>
    </section>
  );
};

export default FamilyDetails;
