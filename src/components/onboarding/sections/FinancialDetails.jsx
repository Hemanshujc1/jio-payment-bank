import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import CustomDropdown from "../../common/CustomDropdown";

const occupationOptions = [
  { label: "Private Sector Service", value: "JP1" },
  { label: "Public Sector Service", value: "JP2" },
  { label: "Government Sector Service", value: "JP3" },
  { label: "Business", value: "JP4" },
  { label: "Professional", value: "JP5" },
  { label: "Self Employed", value: "JP6" },
  { label: "Retired", value: "JP7" },
  { label: "Homemaker", value: "JP8" },
  { label: "Student", value: "JP9" },
  { label: "Farmer", value: "JP10" },
  // { label: "Others", value: "JP11" },
];

const sourceOfIncomeOptions = [
  { label: "Salary", value: "A01" },
  { label: "Business", value: "A02" },
  { label: "Professional Fees", value: "A03" },
  { label: "Agriculture", value: "A04" },
  { label: "Savings", value: "A05" },
  { label: "Family Wealth", value: "A06" },
  { label: "Inheritance", value: "A07" },
  // { label: "Others", value: "A08" },
];

const annualIncomeOptions = [
  { label: "Upto 50K", value: "1" },
  { label: "50K – 1 lakh", value: "2" },
  { label: "1 lakh – 5 lakhs", value: "3" },
  { label: "5 lakhs – 25 lakhs", value: "4" },
  { label: "25 lakhs – 1 crore", value: "5" },
  { label: "Above 1 crore", value: "6" },
];

const getSourceOfIncomeOptions = (occupation) => {
  switch (occupation) {
    case "JP1": // Private Sector Service
    case "JP2": // Public Sector Service
    case "JP3": // Government Sector Service
      return sourceOfIncomeOptions.filter((o) => ["A01"].includes(o.value)); // Salary

    case "JP4": // Business
      return sourceOfIncomeOptions.filter((o) => ["A02"].includes(o.value)); // Business

    case "JP5": // Professional
      return sourceOfIncomeOptions.filter((o) => ["A03"].includes(o.value)); // Professional Fees

    case "JP6": // Self Employed
      return sourceOfIncomeOptions.filter((o) =>
        ["A02", "A03"].includes(o.value)
      ); // Business, Professional Fees

    case "JP7": // Retired
    case "JP8": // Homemaker
    case "JP9": // Student
      return sourceOfIncomeOptions.filter((o) =>
        ["A05", "A06", "A07"].includes(o.value)
      ); // Savings, Family Wealth, Inheritance

    case "JP10": // Farmer
      return sourceOfIncomeOptions.filter((o) => ["A04"].includes(o.value)); // Agriculture

    default:
      return sourceOfIncomeOptions;
  }
};

const getAnnualIncomeOptions = (occupation) => {
  switch (occupation) {
    case "JP8": // Homemaker
    case "JP9": // Student
      return annualIncomeOptions.filter((o) =>
        ["1", "2", "3"].includes(o.value)
      ); // Upto 50K, 50K-1L, 1L-5L
    default:
      return annualIncomeOptions;
  }
};

const FinancialDetails = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedOccupation = watch("financial.occupation");
  const selectedSource = watch("financial.sourceOfIncome");
  const selectedIncome = watch("financial.annualIncome");

  const filteredSourceOptions = getSourceOfIncomeOptions(selectedOccupation);
  const filteredIncomeOptions = getAnnualIncomeOptions(selectedOccupation);

  useEffect(() => {
    if (
      selectedSource &&
      !filteredSourceOptions.find((o) => o.value === selectedSource)
    ) {
      setValue("financial.sourceOfIncome", "", { shouldValidate: true });
    }
    if (
      selectedIncome &&
      !filteredIncomeOptions.find((o) => o.value === selectedIncome)
    ) {
      setValue("financial.annualIncome", "", { shouldValidate: true });
    }
  }, [selectedOccupation]);

  return (
    <section className="flex flex-col w-full">
      <h2 className="font-bold text-[19px] sm:text-[22px] tracking-wide mb-6 sm:mb-8 text-center text-gray-800">
        Financial Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full max-w-6xl mx-auto">
        {/* Occupation */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">
            Occupation<span className="text-red-500">*</span>:
          </span>
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
          {errors.financial?.occupation && (
            <span className="text-red-500 text-[12px]">
              {errors.financial.occupation.message}
            </span>
          )}
        </div>

        {/* Source of Income */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">
            Source of Income<span className="text-red-500">*</span>:
          </span>
          <div className="relative z-20">
            <Controller
              name="financial.sourceOfIncome"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  options={filteredSourceOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  error={!!errors.financial?.sourceOfIncome}
                />
              )}
            />
          </div>
          {errors.financial?.sourceOfIncome && (
            <span className="text-red-500 text-[12px]">
              {errors.financial.sourceOfIncome.message}
            </span>
          )}
        </div>

        {/* Annual Income */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-[14px]">
            Annual Income<span className="text-red-500">*</span>:
          </span>
          <div className="relative z-10">
            <Controller
              name="financial.annualIncome"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  options={filteredIncomeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  error={!!errors.financial?.annualIncome}
                />
              )}
            />
          </div>
          {errors.financial?.annualIncome && (
            <span className="text-red-500 text-[12px]">
              {errors.financial.annualIncome.message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinancialDetails;
