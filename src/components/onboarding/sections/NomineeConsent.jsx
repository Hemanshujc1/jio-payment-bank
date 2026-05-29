import React from "react";

const NomineeConsent = ({ register, errors, nomineeConsentData }) => {
  return (
    <div className="flex flex-col gap-2 mt-1 px-2 sm:px-0">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="mt-1 shrink-0">
          <input
            type="checkbox"
            {...register("nominee.nomineeConsentAccepted")}
            className={`w-5 h-5 border-2 accent-black cursor-pointer rounded-sm ${
              errors.nominee?.nomineeConsentAccepted ? 'border-red-500' : 'border-[#D1A054]'
            }`}
          />
        </div>
        <span className="text-[13.5px] sm:text-[14px] leading-snug text-gray-800 select-none">
          {nomineeConsentData ? (
            nomineeConsentData.text1.split(/\\r\\n|\\n|\r\n|\n/).map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i !== arr.length - 1 && <br />}
              </React.Fragment>
            ))
          ) : (
            "Loading consent..."
          )}
          <span className="text-red-500 text-lg ml-1">*</span>
        </span>
      </label>
      {errors.nominee?.nomineeConsentAccepted && (
        <span className="text-red-500 text-[12px] font-medium ml-8">{errors.nominee.nomineeConsentAccepted.message}</span>
      )}
    </div>
  );
};

export default NomineeConsent;
