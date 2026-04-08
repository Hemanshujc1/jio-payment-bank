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
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
      <h2 className="font-semibold text-[19px] tracking-tight whitespace-nowrap">
        Please enter Aadhaar & PAN Number:
      </h2>

      <div className="flex flex-col md:flex-row gap-8 mb-4 w-full xl:w-auto">

      <div className="flex flex-col flex-1 min-w-75 gap-1">
          <label className="text-[14px] font-medium">Aadhaar No</label>
          <div className={`rounded-lg flex items-center px-4 py-3 shadow-sm border ${disabled ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white ' + (errors?.aadhaar ? 'border-red-500' : 'border-neutral-light')}`}>
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
              className="text-gray-500 hover:text-black transition-colors focus:outline-none ml-2 cursor-pointer"
            >
              {showAadhaar ? (
                <IoIosEye size={22} />
              ) : (
                <IoIosEyeOff size={22} />
              )}
            </button>
          </div>
          {errors?.aadhaar && <span className="text-red-500 text-[12px] font-medium">{errors.aadhaar.message}</span>}
        </div>
        <div className="flex flex-col flex-1 min-w-75 gap-1">
          <label className="text-[14px] font-medium">PAN Number</label>
          <div className={`rounded-lg flex items-center px-4 py-3 shadow-sm border ${disabled ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white ' + (errors?.pan ? 'border-red-500' : 'border-neutral-light')}`}>
            <input
              type={showPan ? "text" : "password"}
              value={pan}
              onChange={handlePanChange}
              onBlur={() => handleBlur("pan")}
              disabled={disabled}
              placeholder="Enter your PAN Number"
              className={`grow outline-none bg-transparent placeholder-neutral-400 tracking-wider text-[14px] ${disabled ? 'cursor-not-allowed' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPan(!showPan)}
              className="text-gray-500 hover:text-black transition-colors focus:outline-none ml-2 cursor-pointer"
            >
              {showPan ? <IoIosEye size={22} /> : <IoIosEyeOff size={22} />}
            </button>
          </div>
          {errors?.pan && <span className="text-red-500 text-[12px] font-medium">{errors.pan.message}</span>}
        </div>

      </div>
    </div>
  </div>
);
};

export default IdentityInputs;
