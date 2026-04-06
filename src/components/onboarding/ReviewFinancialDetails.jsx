import React from 'react';
import { useFormContext } from 'react-hook-form';

const ReviewFinancialDetails = ({ onEdit }) => {
  const dummyFinancial = {
    occupation: "Salaried",
    sourceOfIncome: "Salary",
    annualIncome: "5 Lakhs - 25 lakhs",
    fatcaDeclared: true
  };
  const financial = dummyFinancial;

  return (
    <section className="w-full relative">
      <div className="relative w-full flex justify-center mb-8">
        <h3 className="font-bold text-[16.5px]">Financial Details</h3>
        <button
          onClick={onEdit}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#3A1E08] text-[#EBC080] rounded px-5 py-1 text-[13px] font-bold border border-[#2A1505] shadow-sm hover:opacity-90 tracking-wide"
        >
          Edit
        </button>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-x-12 gap-y-6 w-full px-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[14.5px] shrink-0 text-gray-700">
            Occupation:
          </span>
          <span className="text-[14.5px] font-medium text-gray-900">{financial.occupation}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[14.5px] shrink-0 text-gray-700">
            Source of Income:
          </span>
          <span className="text-[14.5px] font-medium text-gray-900">{financial.sourceOfIncome}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[14.5px] shrink-0 text-gray-700">
            Annual Income:
          </span>
          <span className="text-[14.5px] font-medium text-gray-900">{financial.annualIncome}</span>
        </div>
      </div>
    
    </section>
  );
};

export default ReviewFinancialDetails;
