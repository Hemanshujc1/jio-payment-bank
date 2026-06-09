import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useToast } from "../components/ui/Toast";
import onboardingService from "../services/onboardingService";
import refundService from "../services/refundService";
import { MOBILE_REGEX, isRepeatingDigits } from "../utils/validationUtils";
import ReviewTransactionSection from "../components/refund/ReviewTransactionSection";
import RefundSuccessSection from "../components/refund/RefundSuccessSection";

const RefundFlowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [mobileNumber, setMobileNumber] = useState(
    location.state?.mobileNumber || "",
  );
  const [voucherCode, setVoucherCode] = useState(
    location.state?.voucherCode || "",
  );
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const [isApiLoading, setIsApiLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [refundConsentData, setRefundConsentData] = useState(null);

  useEffect(() => {
    const fetchConsent = async () => {
      try {
        const res = await onboardingService.getConsents("EN");
        if (res.status === "SUCCESS" && res.response?.consents) {
          const refundConsent = res.response.consents.find(
            (c) => c.activityType === "FINAL_SUBMISSION",
          );
          if (refundConsent) setRefundConsentData(refundConsent);
        }
      } catch (err) {
        console.error("Failed to fetch Nominee consent", err);
      }
    };
    fetchConsent();
  }, []);

  const handleProceedMobile = async () => {
    if (
      MOBILE_REGEX.test(mobileNumber) &&
      !isRepeatingDigits(mobileNumber) &&
      voucherCode.length === 15 &&
      !isRepeatingDigits(voucherCode)
    ) {
      setIsApiLoading(true);
      try {
        const payload = { mobileNumber, voucherCode };
        const res = await refundService.verifyVoucher(payload);
        if (res.status === "SUCCESS") {
          setIsMobileVerified(true);
          setVerificationData(res);
          toast.success("Verification successful!");
        } else {
          toast.error(res.message || res.error?.message || "Verification failed.");
        }
      } catch (err) {
        toast.error(err?.data?.message || err?.message || "Verification failed.");
      } finally {
        setIsApiLoading(false);
      }
    } else {
      toast.warning("Please enter a valid mobile number and voucher code.");
    }
  };

  const handleReset = () => {
    setMobileNumber("");
    setVoucherCode("");
    setIsMobileVerified(false);
    setVerificationData(null);
    setShowSuccess(false);
  };

  return (
    <div className="grow w-full flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4 animate-in fade-in duration-500 font-sans">
      <div className="w-full max-w-xl p-4 sm:p-8 md:p-12 flex flex-col items-start bg-white rounded-2xl shadow-xl border border-sand-300 overflow-hidden">
        {isMobileVerified ? (
          <div className="w-full max-w-md mx-auto">
            {showSuccess ? (
              <RefundSuccessSection
                applicationNumber={verificationData?.applicationNumber}
                transactionId={verificationData?.externalAppRefNumber}
                refundAmount={verificationData ? `Rs. ${verificationData.data.voucherDetails[0].netAmount}` : ""}
                dateTime={new Date().toString()}
                mobileNumber={mobileNumber}
                customerName={verificationData ? `${verificationData.data.persons[0].personalDetails.firstName} ${verificationData.data.persons[0].personalDetails.lastName}` : ""}
                onClose={() => {
                  handleReset();
                  navigate("/refund-flow");
                }}
              />
            ) : (
              <ReviewTransactionSection
                customerName={verificationData ? [
                  verificationData.data.persons[0].personalDetails.firstName,
                  verificationData.data.persons[0].personalDetails.middleName,
                  verificationData.data.persons[0].personalDetails.lastName
                ].filter(Boolean).join(" ") : ""}
                applicationNumber={verificationData?.applicationNumber}
                externalAppRefNumber={verificationData?.externalAppRefNumber}
                transactionType="Savings Account"
                voucherCode={voucherCode}
                amountToRefund={verificationData ? `Rs. ${verificationData.data.voucherDetails[0].netAmount}` : ""}
                mobileNumber={mobileNumber}
                refundConsentData={refundConsentData}
                onProceed={() => setShowSuccess(true)}
              />
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="w-full border-b border-sand-500 text-center pb-4 sm:pb-6 mb-6 sm:mb-8">
              <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-extrabold text-sand-900 tracking-tight">
                Refund Customer Verification
              </h2>
              <p className="text-[13px] sm:text-[14px] md:text-[15px] text-sand-500 mt-1 sm:mt-2 font-medium leading-normal">
                Please verify details to authorize the refund process.
              </p>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-md mx-auto flex flex-col items-stretch">
              {/* Mobile Input Group */}
              <div className="w-full flex flex-col items-start">
                <label className="text-[14px] text-sand-500 font-bold mb-2">
                  Enter Customer's Mobile Number
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div
                  className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative ${
                    isMobileVerified
                      ? "bg-green-50/30 border-green-200"
                      : "bg-white border-sand-300 focus-within:border-brown-700 focus-within:bg-white"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="XXXXXXXXXX"
                    maxLength="10"
                    disabled={isMobileVerified}
                    className={`grow outline-none text-sand-900 font-semibold bg-transparent tracking-widest text-[16px] ${
                      isMobileVerified ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setMobileNumber(val);
                    }}
                  />
                  {isMobileVerified && (
                    <IoMdCheckmarkCircle className="text-green-500 text-2xl absolute right-3" />
                  )}
                </div>

                {mobileNumber.length === 10 &&
                  (!MOBILE_REGEX.test(mobileNumber) ||
                    isRepeatingDigits(mobileNumber)) && (
                    <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      Invalid mobile number
                    </p>
                  )}
              </div>

              {/* Voucher Code Input Group */}
              <div className="w-full flex flex-col items-start mt-4">
                <label className="text-[14px] text-sand-500 font-bold mb-2">
                  Enter Voucher Code<span className="text-red-500 ml-1">*</span>
                </label>

                <div
                  className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative bg-white border-sand-300 focus-within:border-brown-700 focus-within:bg-white`}
                >
                  <input
                    type="text"
                    placeholder="Enter 15-digit voucher code"
                    maxLength="15"
                    className="grow outline-none text-sand-900 font-semibold bg-transparent text-[16px]"
                    value={voucherCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setVoucherCode(val);
                    }}
                  />
                </div>

                {voucherCode.length === 15 &&
                  isRepeatingDigits(voucherCode) && (
                    <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      Invalid voucher code
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              {!isMobileVerified && (
                <button
                  onClick={handleProceedMobile}
                  disabled={
                    !MOBILE_REGEX.test(mobileNumber) ||
                    isRepeatingDigits(mobileNumber) ||
                    voucherCode.length !== 15 ||
                    isRepeatingDigits(voucherCode) ||
                    isApiLoading
                  }
                  className="mt-6 w-full h-11 bg-sand-500 text-sand-350 border border-brown-700 font-bold rounded-lg hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] flex items-center justify-center gap-2"
                >
                  {isApiLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-sand-350 border-t-transparent rounded-full animate-spin"></span>
                      Proceeding...
                    </>
                  ) : (
                    "PROCEED"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RefundFlowPage;
