import React from "react";

const ProductSelection = ({ productType, setProductType }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-10">
      <h2 className="font-semibold text-[19px] tracking-tight">
        Select Product Type:
      </h2>

      <div className="flex gap-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="w-5 h-5 rounded-full border-[3px] border-black flex items-center justify-center shrink-0">
            {productType === "savings" && (
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            )}
          </div>
          <span className="text-[16px]">Savings Account</span>
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
