import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const ReviewFamilyDetails = ({ onEdit }) => {
  const { control } = useFormContext();
  const family = useWatch({ name: "family", control });
  const applicant = useWatch({ name: "applicant", control });
  const maritalStatus = "Married";

  // const maritalStatus = applicant?.maritalStatus || "Married";

  const dummyFamily = {
    fatherName: { firstName: "Rajesh", middleName: "Kumar", lastName: "Singh" },
    motherName: { firstName: "Suman", middleName: "", lastName: "Singh" },
    spouseName: { firstName: "Anjali", middleName: "Deepak", lastName: "Singh" }
  };

  const displayFamily = dummyFamily;

  const NameRow = ({ label, person }) => (
    <div className="flex md:items-center gap-2">
      <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
        {label} Name:
      </span>
      <span className="text-[14.5px] font-medium text-gray-900">
        {person?.firstName} {person?.middleName || ""} {person?.lastName}
      </span>
    </div>
  );

  return (
    <section className="w-full relative">
      <div className="relative w-full flex justify-center mb-8">
        <h3 className="font-bold text-[16.5px]">Family Details</h3>
        <button
          onClick={onEdit}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#3A1E08] text-[#EBC080] rounded px-5 py-1 text-[13px] font-bold border border-[#2A1505] shadow-sm hover:opacity-90 tracking-wide"
        >
          Edit
        </button>
      </div>
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
          <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
            Marital Status:
          </span>
          <span className="text-[14.5px] font-medium text-gray-900">
            {maritalStatus}
          </span>
        </div>
        <div className="flex flex-row gap-4 justify-between mt-4">
          <NameRow label="Father" person={displayFamily?.fatherName} />
          <NameRow label="Mother" person={displayFamily?.motherName} />
          {maritalStatus === 'Married' && (
            <NameRow label="Spouse" person={displayFamily?.spouseName} />
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewFamilyDetails;
