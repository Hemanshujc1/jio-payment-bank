import React from "react";
import ProceedButton from "../common/ProceedButton";

const RefundSuccessSection = ({
  applicationNumber,
  transactionId,
  refundAmount,
  mobileNumber,
  customerName,
  onClose,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 font-sans">
      <div className="w-full bg-white p-4 sm:p-6 rounded-xl flex flex-col gap-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20 mx-auto">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Header Titles */}
        <div className="text-center">
          <h3 className="text-[20px] sm:text-[22px] font-extrabold text-sand-900 tracking-tight">
            Refund Initiated Successfully
          </h3>
          <p className="text-[14px] sm:text-[15px] font-bold text-sand-900 mt-2">
            Application No.: {applicationNumber}
          </p>
        </div>

        {/* Details Grid */}
        <div className="w-full flex flex-col gap-5 border-t border-sand-300 pt-6">
          {/* Transaction ID */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Transaction ID
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {transactionId}
            </span>
          </div>

          {/* Refund Amount */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Refund Amount
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {refundAmount}
            </span>
          </div>


          {/* Mobile Number */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Mobile Number
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {mobileNumber}
            </span>
          </div>

          {/* Customer Name */}
          <div className="flex justify-between items-start gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold min-w-30">
              Customer Name
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right max-w-50 leading-tight">
              {customerName}
            </span>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="w-full flex justify-center mt-2">
        <ProceedButton
          text="CLOSE"
          onClick={onClose}
          className="w-full rounded-xl text-[14px] py-2.5 h-11"
        />
      </div>
    </div>
  );
};

export default RefundSuccessSection;
