import React from "react";

const OnboardingHeader = () => {
  return (
    <>
      {/* On-Boarding Mode */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <h2 className="font-bold text-2xl tracking-wide text-center">
        On-Boarding Mode: E-KYC
      </h2>
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
