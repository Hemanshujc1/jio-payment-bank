import React from "react";

const OnboardingHeader = () => {
  return (
    <>
      {/* On-Boarding Mode */}
      <div className="flex items-center gap-4 mb-10">
        <h2 className="font-semibold text-xl md:text-2xl tracking-tight">
          Select On-Boarding Mode<span className="text-red-500">*</span>
        </h2>
        <div className="bg-primary px-8 py-2 rounded-full font-semibold shadow-sm">
          E-KYC
        </div>
      </div>
      {/* Customer should hold */}
      <div className="mb-10">
        <h2 className="font-semibold text-[19px] inline tracking-tight">
          Customer should hold:{" "}
        </h2>
        <span className="text-[19px]">
          1. Aadhaar No. | 2. Original PAN Card
        </span>
      </div>
    </>
  );
};

export default OnboardingHeader;
