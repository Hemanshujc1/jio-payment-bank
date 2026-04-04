import React from "react";
import { useFormContext } from "react-hook-form";

const NomineeChoice = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <span className="font-semibold text-[16px] shrink-0">
          Do you want to provide nominee details:
        </span>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register("nominee.provide")}
              value="Yes"
              className="w-5 h-5 accent-black cursor-pointer"
            />
            <span className="text-[16px] font-medium text-gray-900">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register("nominee.provide")}
              value="No"
              className="w-5 h-5 accent-black cursor-pointer"
            />
            <span className="text-[16px] font-medium text-gray-900">No</span>
          </label>
        </div>
      </div>
      <p className="text-[14px] text-gray-800 tracking-tight leading-snug">
        Having a nominee in account helps the account holders family to claims
        the funds lying in the account in case of the demise of the account
        holder.
      </p>
    </div>
  );
};

export default NomineeChoice;
