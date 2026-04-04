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
  displayAadhaar,
  pan,
  errors,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
      <h2 className="font-semibold text-[19px] tracking-tight whitespace-nowrap">
        Please enter PAN & Aadhaar Number:
      </h2>

      <div className="flex flex-col md:flex-row gap-8 mb-4 w-full xl:w-auto">
        <div className="flex flex-col flex-1 min-w-75 gap-1">
          <label className="text-[14px] font-medium">PAN Number</label>
          <div className={`bg-white rounded-lg flex items-center px-4 py-3 shadow-sm border ${errors?.pan ? 'border-red-500' : 'border-neutral-light'}`}>
            <input
              type={showPan ? "text" : "password"}
              value={pan}
              onChange={handlePanChange}
              placeholder="Enter your PAN Number"
              className="grow outline-none bg-transparent placeholder-neutral-400 tracking-wider text-[14px]"
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

        <div className="flex flex-col flex-1 min-w-75 gap-1">
          <label className="text-[14px] font-medium">Aadhaar No</label>
          <div className={`bg-white rounded-lg flex items-center px-4 py-3 shadow-sm border ${errors?.aadhaar ? 'border-red-500' : 'border-neutral-light'}`}>
            <input
              type="text"
              value={displayAadhaar}
              onChange={handleAadhaarChange}
              placeholder="XXXX-XXXX-XXXX"
              className="grow outline-none bg-transparent placeholder-neutral-400 font-mono tracking-[0.15em] text-[14px]"
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
      </div>
    </div>
  </div>
);
};

export default IdentityInputs;
