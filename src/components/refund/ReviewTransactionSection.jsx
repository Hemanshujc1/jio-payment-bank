import React, { useState } from "react";
import ProceedButton from "../common/ProceedButton";
import BiometricSection from "../onboarding/sections/BiometricSection";
import refundService from "../../services/refundService";
import { useToast } from "../ui/Toast";

const ReviewTransactionSection = ({
  customerName = "Sai Vinayak Shekhar Bangera",
  // applicationStatus = "Rejected",
  applicationNumber,
  transactionType = "Savings Account",
  // refundStatus = "In-Progress",
  amountToRefund = "Rs. 400",
  mobileNumber = "9876543210",
  onProceed,
  voucherCode,
  refundConsentData,
  externalAppRefNumber,
}) => {
  const toast = useToast();
  const [refundConsentAccepted, setRefundConsentAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [bioMetricData, setBioMetricData] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleProceedClick = async () => {
    if (!refundConsentAccepted) {
      setError("Please accept the terms and conditions to proceed.");
      return;
    }
    setError("");
    setIsApiLoading(true);

    try {
      const payload = {
        externalAppRefNumber,
        applicationNumber,
        mobileNumber,
        voucherCode,
        bioMetricData,
        consents: [
          {
            consent: refundConsentData?.text1 || "",
            code: refundConsentData?.consentTextCode || "C68",
            version: "1",
            method: "checkbox",
          },
        ],
      };

      const res = await refundService.redeemVoucher(payload);
      if (res.status === "SUCCESS") {
        if (onProceed) onProceed(res);
      } else {
        toast.error(res.message || res.error?.message || "Voucher redeem failed.");
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Voucher redeem failed.");
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full bg-white p-2 sm:p-4 rounded-xl flex flex-col gap-6">
        {/* Title */}
        <h3 className="text-[20px] sm:text-[22px] font-extrabold text-sand-900 text-center tracking-tight">
          Review Transaction Details
        </h3>

        {/* Details Grid */}
        <div className="w-full flex flex-col gap-5 border-t border-b border-sand-300 py-6">
          {/* Application Number */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Application Number
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {applicationNumber}
            </span>
          </div>

          {/* Customer Name */}
          <div className="flex justify-between items-start gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold min-w-30">
              Customer Name
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right leading-tight">
              {customerName}
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
              Voucher Code
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {voucherCode}
            </span>
          </div>

          {/* Amount To Refund */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-[14px] sm:text-[15px] text-sand-500 font-bold">
              Amount to be refund
            </span>
            <span className="text-[14px] sm:text-[15px] text-sand-900 font-extrabold text-right">
              {amountToRefund}
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
        </div>
      </div>

      {/* Nominee Consent Checkbox */}
      <div className="w-full flex flex-col gap-2 mt-1 px-2 sm:px-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-1 shrink-0">
            <input
              type="checkbox"
              checked={refundConsentAccepted}
              onChange={(e) => {
                setRefundConsentAccepted(e.target.checked);
                if (e.target.checked) setError("");
              }}
              className={`w-5 h-5 border-2 accent-black cursor-pointer rounded-sm ${
                error ? "border-red-500" : "border-[#D1A054]"
              }`}
            />
          </div>
          <span className="text-[13.5px] sm:text-[14px] leading-snug text-gray-800 select-none">
            {refundConsentData
              ? refundConsentData.text1
                  .split(/\\r\\n|\\n|\r\n|\n/)
                  .map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== arr.length - 1 && <br />}
                    </React.Fragment>
                  ))
              : "Loading consent..."}
            <span className="text-red-500 text-lg ml-1">*</span>
          </span>
        </label>
        {error && (
          <span className="text-red-500 text-[12px] font-medium ml-8 animate-in fade-in duration-200">
            {error}
          </span>
        )}
      </div>

      {/* Biometric Integration Step */}
      <div className="w-full mt-4 flex items-center justify-center">
        <BiometricSection
          isBiometricVerified={isBiometricVerified}
          setIsBiometricVerified={setIsBiometricVerified}
          onCaptureSuccess={(data) => setBioMetricData(data)}
          disableDocumentValidation={true}
          documentStatus="success"
        />
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-center mt-2">
        <ProceedButton
          text={isApiLoading ? "PROCEEDING..." : "PROCEED"}
          onClick={handleProceedClick}
          disabled={!refundConsentAccepted || !isBiometricVerified || isApiLoading}
          className="w-full max-w-70 rounded-xl text-[14px] h-14 font-extrabold"
        />
      </div>
    </div>
  );
};

export default ReviewTransactionSection;
