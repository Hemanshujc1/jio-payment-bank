import React from "react";

const OnboardingHeader = () => {
  return (
    <>
      {/* On-Boarding Mode */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 text-center sm:text-left">
        <h2 className="font-bold text-xl sm:text-2xl tracking-wide">
          On-Boarding Mode:
        </h2>
        <h2 className="font-bold text-xl sm:text-2xl tracking-wide">E-KYC</h2>
      </div>
      {/* Customer should hold */}
      <div className="mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 text-center sm:text-left">
  <h2 className="font-semibold text-[17px] sm:text-[19px] tracking-tight">
    Customer should hold:
  </h2>
  <span className="text-[17px] sm:text-[19px]">
    1. Aadhaar No. | 2. Original PAN Card
  </span>
</div>
    </>
  );
};

export default OnboardingHeader;
