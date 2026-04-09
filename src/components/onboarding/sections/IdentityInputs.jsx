import React from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const IdentityInputs = ({
  showPan,
  setShowPan,
  showAadhaar,
  setShowAadhaar,
  aadhaar,
  handleAadhaarChange,
  handlePanChange,
  handleBlur,
  displayAadhaar,
  pan,
  errors,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 items-start xl:items-center">
        <h2 className="font-bold text-[17px] sm:text-[19px] tracking-tight whitespace-normal sm:whitespace-nowrap shrink-0 text-gray-800">
          Enter Aadhaar & PAN Details:
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full xl:w-auto grow">
          <div className="flex flex-col flex-1 gap-1.5 min-w-0">
            <label className="text-[13px] sm:text-[14px] font-bold text-gray-600 ml-1">Aadhaar Card No</label>
            <div className={`rounded-xl flex items-center px-4 py-3 shadow-sm border transition-all ${disabled ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white ' + (errors?.aadhaar ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900')}`}>
              <input
                type="text"
                value={displayAadhaar}
                onChange={handleAadhaarChange}
                onBlur={() => handleBlur("aadhaar")}
                disabled={disabled}
                placeholder="XXXX-XXXX-XXXX"
                className={`grow outline-none bg-transparent placeholder-neutral-400 font-mono tracking-[0.15em] text-[14px] ${disabled ? 'cursor-not-allowed' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowAadhaar(!showAadhaar)}
                className="text-gray-400 hover:text-black transition-colors focus:outline-none ml-2 cursor-pointer"
              >
                {showAadhaar ? <IoIosEye size={22} /> : <IoIosEyeOff size={22} />}
              </button>
            </div>
            {errors?.aadhaar && <span className="text-red-500 text-[12px] font-medium ml-1">{errors.aadhaar.message}</span>}
          </div>

          <div className="flex flex-col flex-1 gap-1.5 min-w-0">
            <label className="text-[13px] sm:text-[14px] font-bold text-gray-600 ml-1">PAN Number</label>
            <div className={`rounded-xl flex items-center px-4 py-3 shadow-sm border transition-all ${disabled ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white ' + (errors?.pan ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900')}`}>
              <input
                type={showPan ? "text" : "password"}
                value={pan}
                onChange={handlePanChange}
                onBlur={() => handleBlur("pan")}
                disabled={disabled}
                placeholder="Enter PAN"
                className={`grow outline-none bg-transparent placeholder-neutral-400 tracking-wider text-[14px] ${disabled ? 'cursor-not-allowed' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPan(!showPan)}
                className="text-gray-400 hover:text-black transition-colors focus:outline-none ml-2 cursor-pointer"
              >
                {showPan ? <IoIosEye size={22} /> : <IoIosEyeOff size={22} />}
              </button>
            </div>
            {errors?.pan && <span className="text-red-500 text-[12px] font-medium ml-1">{errors.pan.message}</span>}
          </div>
        </div>
      </div>
    </div>
);
};

export default IdentityInputs;
