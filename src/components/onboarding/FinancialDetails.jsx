import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomDropdown from '../CustomDropdown';

const FinancialDetails = () => {
  const { register, control, formState: { errors } } = useFormContext();
  
  return (
    <section className="flex flex-col w-full mt-4">
      <h2 className="font-bold text-[22px] tracking-wide mb-8 text-center">
        Financial Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full max-w-6xl mx-auto">
        
        {/* Occupation */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">Occupation<span className="text-red-500">*</span>:</span>
          <div className="relative z-30">
            <Controller
              name="financial.occupation"
              control={control}
              render={({ field }) => (
                <CustomDropdown 
                  options={['Retired', 'Salaried', 'Business']} 
                  value={field.value} 
                  onChange={field.onChange} 
                  className="w-full"
                  error={!!errors.financial?.occupation}
                />
              )}
            />
          </div>
          {errors.financial?.occupation && <span className="text-red-500 text-[12px]">{errors.financial.occupation.message}</span>}
        </div>

        {/* Source of Income */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">Source of Income<span className="text-red-500">*</span>:</span>
          <div className="relative z-20">
            <Controller
              name="financial.sourceOfIncome"
              control={control}
              render={({ field }) => (
                <CustomDropdown 
                  options={['Savings', 'Salary', 'Business']} 
                  value={field.value} 
                  onChange={field.onChange} 
                  className="w-full"
                  error={!!errors.financial?.sourceOfIncome}
                />
              )}
            />
          </div>
          {errors.financial?.sourceOfIncome && <span className="text-red-500 text-[12px]">{errors.financial.sourceOfIncome.message}</span>}
        </div>

        {/* Annual Income */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">Annual Income<span className="text-red-500">*</span>:</span>
          <div className="relative z-10">
            <Controller
              name="financial.annualIncome"
              control={control}
              render={({ field }) => (
                <CustomDropdown 
                  options={['5 Lakhs - 25 lakhs', '26 Lakhs - 50 lakhs', '51 Lakhs - 1 Crore']} 
                  value={field.value} 
                  onChange={field.onChange} 
                  className="w-full"
                  error={!!errors.financial?.annualIncome}
                />
              )}
            />
          </div>
          {errors.financial?.annualIncome && <span className="text-red-500 text-[12px]">{errors.financial.annualIncome.message}</span>}
        </div>

      </div>

      {/* FATCA Declaration */}
      <div className="flex flex-col gap-2 mt-12 items-center justify-center w-full max-w-4xl mx-auto">
        <div className="flex items-center align-middle gap-4 justify-center w-full">
          <span className="font-semibold whitespace-nowrap pt-0.5">FATCA Declaration:</span>
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              {...register("financial.fatcaDeclared")}
              className={`w-5.5 h-5.5 border-2 ${errors.financial?.fatcaDeclared ? 'border-red-500' : 'border-[#D1A054]'} accent-black cursor-pointer rounded-sm shrink-0`}
            />
            <span className="text-[14px] text-gray-800 leading-snug">
              I hereby declare that i am Indian Citizen, Indian Tax resident and not a US Citizen / Green Card Holder.
            </span>
          </div>
        </div>
        {errors.financial?.fatcaDeclared && <span className="text-red-500 text-[12px]">{errors.financial.fatcaDeclared.message}</span>}
      </div>
      
    </section>
  );
};

export default FinancialDetails;
