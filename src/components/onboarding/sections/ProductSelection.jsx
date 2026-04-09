import React from "react";

const ProductSelection = ({ productType, setProductType }) => {
  return (
    <div className="flex flex-row lg:flex-row lg:items-center gap-4 lg:gap-8 mb-6 sm:mb-10">
      <h2 className="font-bold text-[17px] sm:text-[19px] tracking-tight text-gray-800">
        Product Type:
      </h2>

      <div className="flex flex-wrap gap-6 sm:gap-8 mt-1 sm:mt-0">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-5 h-5 rounded-full border-[3px] border-black flex items-center justify-center transition-all group-hover:scale-110 shrink-0">
            {productType === "savings" && (
              <div className="w-2 h-2 bg-black rounded-full" />
            )}
          </div>
          <span className="text-[15px] sm:text-[16px] font-medium select-none text-gray-700">Savings Account</span>
          <input
            type="radio"
            className="hidden"
            checked={productType === "savings"}
            onChange={() => setProductType("savings")}
          />
        </label>
      </div>
    </div>
  );
};

export default ProductSelection;
