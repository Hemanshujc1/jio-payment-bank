import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useToast } from "../components/ui/Toast";
import onboardingService from "../services/onboardingService";
import { MOBILE_REGEX, isRepeatingDigits } from "../utils/validationUtils";
import ApplicationDetailsSection from "../components/refund/ApplicationDetailsSection";
import ReviewTransactionSection from "../components/refund/ReviewTransactionSection";
import RefundSuccessSection from "../components/refund/RefundSuccessSection";

const RefundFlowPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [mobileNumber, setMobileNumber] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [externalAppRefNumber, setExternalAppRefNumber] = useState("");

  const [isApiLoading, setIsApiLoading] = useState(false);

  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [c69ConsentData, setC69ConsentData] = useState(null);

  useEffect(() => {
    const fetchConsent = async () => {
      try {
        const res = await onboardingService.getConsents("EN");
        if (res.status === "SUCCESS" && res.response?.consents) {
          const c69 = res.response.consents.find(
            (c) => c.consentTextCode === "C69"
          );
          if (c69) setC69ConsentData(c69);
        }
      } catch (err) {
        console.error("Failed to fetch C69 consent", err);
      }
    };
    fetchConsent();
  }, []);

  const handleProceedMobile = async () => {
    if (MOBILE_REGEX.test(mobileNumber) && !isRepeatingDigits(mobileNumber) && voucherCode.trim()) {
      setIsApiLoading(true);
      // Simulate API call to verify mobile and fetch details
      setTimeout(() => {
        setIsApiLoading(false);
        setIsMobileVerified(true);
        toast.success("Verification successful!");
      }, 800);
    } else {
      toast.warning("Please enter a valid mobile number and voucher code.");
    }
  };

  const handleReset = () => {
    setMobileNumber("");
    setVoucherCode("");
    setIsMobileVerified(false);
    setApplicationNumber("");
    setExternalAppRefNumber("");
    setShowReview(false);
    setShowSuccess(false);
  };

  return (
    <div className="grow w-full flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4 animate-in fade-in duration-500 font-sans">
      <div className="w-full max-w-lg p-4 sm:p-8 md:p-12 flex flex-col items-start bg-white rounded-2xl shadow-xl border border-sand-300 overflow-hidden">
        
        {isMobileVerified ? (
          <div className="w-full max-w-md mx-auto">
            {showSuccess ? (
              <RefundSuccessSection
                applicationNumber="RA2025043064689"
                transactionId="10672512062841834000"
                refundAmount="Rs. 400"
                dateTime="Wed Apr 30 17:27:27 IST 2025"
                mobileNumber={mobileNumber || "6300470001"}
                customerName="Sai Vinayak Shekhar Bangera"
                onClose={() => {
                  handleReset();
                  navigate("/refund-flow");
                }}
              />
            ) : showReview ? (
              <ReviewTransactionSection
                customerName="Sai Vinayak Shekhar Bangera"
                applicationStatus="Rejected"
                transactionType="Savings Account"
                refundStatus="In-Progress"
                amountToRefund="Rs. 400"
                mobileNumber={mobileNumber || "9876543210"}
                c69ConsentData={c69ConsentData}
                onProceed={() => setShowSuccess(true)}
              />
            ) : (
              <ApplicationDetailsSection
                customerName="Sai Vinayak Shekhar Bangera"
                applicationStatus="Rejected"
                transactionType="Savings Account"
                refundStatus="In-Progress"
                onProceed={() => setShowReview(true)}
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
                Please verify contact details to authorize the refund process.
              </p>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-md mx-auto flex flex-col items-stretch">
              
              {/* Mobile Input Group */}
              <div className="w-full flex flex-col items-start">
                <label className="text-[14px] text-sand-500 font-bold mb-2">
                  Enter Customer's Mobile Number<span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative ${
                  isMobileVerified 
                    ? 'bg-green-50/30 border-green-200' 
                    : 'bg-white border-sand-300 focus-within:border-brown-700 focus-within:bg-white'
                }`}>
                  <input
                    type="text"
                    placeholder="XXXXXXXXXX"
                    maxLength="10"
                    disabled={isMobileVerified}
                    className={`grow outline-none text-sand-900 font-semibold bg-transparent tracking-widest text-[16px] ${
                      isMobileVerified ? 'opacity-70 cursor-not-allowed' : ''
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

                {mobileNumber.length === 10 && !MOBILE_REGEX.test(mobileNumber) && (
                  <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    Invalid mobile number
                  </p>
                )}
                {mobileNumber.length === 10 && isRepeatingDigits(mobileNumber) && (
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
                
                <div className={`flex items-center rounded-xl p-3 w-full border transition-all duration-200 relative bg-white border-sand-300 focus-within:border-brown-700 focus-within:bg-white`}>
                  <input
                    type="text"
                    placeholder="Enter voucher code here"
                    className="grow outline-none text-sand-900 font-semibold bg-transparent text-[16px]"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {!isMobileVerified && (
                <button
                  onClick={handleProceedMobile}
                  disabled={
                    !MOBILE_REGEX.test(mobileNumber) ||
                    isRepeatingDigits(mobileNumber) ||
                    !voucherCode.trim() ||
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

