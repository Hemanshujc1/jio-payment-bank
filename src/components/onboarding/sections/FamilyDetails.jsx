import React from 'react';
import { useFormContext } from 'react-hook-form';

const NameFields = ({ prefix, label, error, register }) => (
  <div className="flex flex-col gap-4">
    <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">{label}<span className="text-red-500 ml-0.5">*</span></span>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
      <div className="flex flex-col gap-1.5">
        <input 
          {...register(`${prefix}.firstName`)}
          type="text" 
          placeholder="First Name" 
          className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${error?.firstName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium`}
        />
        {error?.firstName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.firstName.message}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <input 
          {...register(`${prefix}.middleName`)}
          type="text" 
          placeholder="Middle Name (Optional)" 
          className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${error?.middleName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium`}
        />
        {error?.middleName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.middleName.message}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <input 
          {...register(`${prefix}.lastName`)}
          type="text" 
          placeholder="Last Name" 
          className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all focus:outline-none ${error?.lastName ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'} placeholder:text-gray-400 text-[14px] font-medium`}
        />
        {error?.lastName && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.lastName.message}</span>}
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <span className="font-bold text-[14px] sm:text-[15px] text-gray-800 ml-0.5">Marital Status<span className="text-red-500 ml-0.5">*</span></span>
          <div className="flex items-center gap-8 sm:gap-10 mt-1 sm:mt-0 ml-1 sm:ml-0">
            {["Unmarried","Married"].map((status) => (
              <label key={status} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  {...register("applicant.maritalStatus")}
                  value={status} 
                  className="w-5 h-5 accent-black cursor-pointer shadow-sm"
                />
                <span className="text-[14px] sm:text-[15px] font-bold text-gray-600 transition-colors group-hover:text-black">{status}</span>
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
