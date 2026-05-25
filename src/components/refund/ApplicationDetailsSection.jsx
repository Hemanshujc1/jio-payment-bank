import React from "react";
import ProceedButton from "../common/ProceedButton";

const ApplicationDetailsSection = ({
  customerName = "Sai Vinayak Shekhar Bangera",
  applicationStatus = "Rejected",
  transactionType = "Savings Account",
  refundStatus = "In-Progress",
  onProceed,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full bg-white p-2 sm:p-4 rounded-xl flex flex-col gap-6">
        
        {/* Title */}
        <h3 className="text-[20px] sm:text-[22px] font-extrabold text-sand-900 text-center tracking-tight">
          Application Details
        </h3>

        {/* Details Grid */}
        <div className="w-full flex flex-col gap-5 border-t border-b border-sand-300 py-6">
          {/* Customer Name */}
          <div className="flex justify-between items-start gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold min-w-30">
              Customer Name
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right max-w-50 leading-tight">
              {customerName}
            </span>
          </div>

          {/* Application Status */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Application Status
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {applicationStatus}
            </span>
          </div>

          {/* Transaction Type */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Transaction Type
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {transactionType}
            </span>
          </div>

          {/* Refund Status */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Refund Status
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {refundStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-center">
        <ProceedButton
          text="PROCEED"
          onClick={onProceed}
          className="w-full rounded-xl text-[14px] py-2.5 h-11"
        />
      </div>
    </div>
  );
};

export default ApplicationDetailsSection;
