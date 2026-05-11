import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomDropdown from '../../common/CustomDropdown';

const occupationOptions = [
  { label: 'Private Sector Service', value: 'JP1' },
  { label: 'Public Sector Service', value: 'JP2' },
  { label: 'Government Sector Service', value: 'JP3' },
  { label: 'Business', value: 'JP4' },
  { label: 'Professional', value: 'JP5' },
  { label: 'Self Employed', value: 'JP6' },
  { label: 'Retired', value: 'JP7' },
  { label: 'Homemaker', value: 'JP8' },
  { label: 'Student', value: 'JP9' },
  { label: 'Farmer', value: 'JP10' },
  { label: 'Others', value: 'JP11' },
];

const sourceOfIncomeOptions = [
  { label: 'Salary', value: 'A01' },
  { label: 'Business', value: 'A02' },
  { label: 'Professional Fees', value: 'A03' },
  { label: 'Agriculture', value: 'A04' },
  { label: 'Savings', value: 'A05' },
  { label: 'Family Wealth', value: 'A06' },
  { label: 'Inheritance', value: 'A07' },
  { label: 'Others', value: 'A08' },
];

const annualIncomeOptions = [
  { label: 'Upto 50K', value: '1' },
  { label: '50K – 1 lakh', value: '2' },
  { label: '1 lakh – 5 lakhs', value: '3' },
  { label: '5 lakhs – 25 lakhs', value: '4' },
  { label: '25 lakhs – 1 crore', value: '5' },
  { label: 'Above 1 crore', value: '6' },
];

const FinancialDetails = () => {
  const { register, control, formState: { errors } } = useFormContext();
  
  return (
    <section className="flex flex-col w-full">
      <h2 className="font-bold text-[19px] sm:text-[22px] tracking-wide mb-6 sm:mb-8 text-center text-gray-800">
        Financial Details
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full max-w-6xl mx-auto">
        
        {/* Occupation */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">Occupation<span className="text-red-500">*</span>:</span>
          <div className="relative z-30">
            <Controller
              name="financial.occupation"
              control={control}
              render={({ field }) => (
                <CustomDropdown 
                  options={occupationOptions} 
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
                  options={sourceOfIncomeOptions} 
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
                  options={annualIncomeOptions} 
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

    </section>
  );
};

export default FinancialDetails;
