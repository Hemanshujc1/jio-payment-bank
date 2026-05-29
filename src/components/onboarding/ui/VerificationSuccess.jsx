import React from "react";

const VerificationSuccess = ({ isSuccess }) => {
  if (!isSuccess) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white shrink-0 font-bold text-sm mt-0.5">
        ✓
      </div>
      <div className="flex flex-col">
        <p className="text-green-800 font-bold text-[15px]">
          Verification Passed
        </p>
        <p className="text-green-600 text-[13.5px] mt-0.5">
          Aadhaar and PAN details have been successfully verified.
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccess;
