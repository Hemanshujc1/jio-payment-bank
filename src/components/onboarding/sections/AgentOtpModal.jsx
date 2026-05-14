import React, { useEffect, useState } from "react";
import onboardingService from "../../../services/onboardingService";

const AgentOtpModal = ({ isOpen, onVerified }) => {
  const vkid =
    localStorage.getItem("vkid") || sessionStorage.getItem("vkid") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // success | error

  if (!isOpen) return null;

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);

      const payload = {
        vkid,
      };

      console.log("SEND OTP PAYLOAD:", payload);

      const res = await onboardingService.sendAgentOtp(payload);

      console.log("SEND OTP RESPONSE:", res);

      if (res?.status === "SUCCESS") {
        setOtpSent(true);
        setAlertType("success");
        setAlertMessage(res?.message || "OTP sent successfully");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      } else {
        setAlertType("error");
        setAlertMessage(res?.message || "Failed to send OTP");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMessage("Failed to send OTP");
      setTimeout(() => {
          setAlertMessage("");
        }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      const payload = {
        vkid,
        otp,
      };

      console.log("VERIFY OTP PAYLOAD:", payload);

      const res = await onboardingService.verifyAgentOtp(payload);

      console.log("VERIFY OTP RESPONSE:", res);

      if (res?.status === "SUCCESS") {
        sessionStorage.setItem("agentVerified", "true");
        sessionStorage.setItem("vkid", vkid);
        onVerified();
      } else {
        setAlertType("error");
        setAlertMessage(res?.message || "Invalid / Expired OTP");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center px-4 backdrop-blur-[2px]">
      <div className="bg-[#F4E4C1] border border-[#A67C52]/30 rounded-3xl shadow-2xl w-full max-w-md p-7 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
        {/* TITLE */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-extrabold text-[#3E2723] tracking-wide">
            Agent Verification
          </h2>

          <p className="text-[15px] text-[#6D4C41] text-center font-medium">
            Verify VKID before starting onboarding
          </p>
        </div>

        {/* VKID DISPLAY */}
        <div className="flex items-center justify-between bg-[#FFF8E7] border border-[#B08968] rounded-2xl px-5 py-4 shadow-inner">
          <span className="font-bold text-[15px] text-[#4E342E]">VKID :</span>
          <span className="text-[#3E2723] font-bold text-[16px] tracking-wide">
            {vkid}
          </span>
        </div>

        {/* OTP FIELD */}
        {otpSent && (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[15px] text-[#4E342E]">
              Enter OTP
            </label>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full border border-[#B08968] bg-white rounded-2xl px-5 py-4 outline-none text-[16px] tracking-[4px] text-center font-bold focus:ring-2 focus:ring-[#8D6E63]"
            />
          </div>
        )}

        {/* CUSTOM ALERT */}
        {alertMessage && (
          <div
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold border shadow-sm transition-all duration-300
      ${
        alertType === "success"
          ? "bg-green-100 border-green-300 text-green-800"
          : "bg-red-100 border-red-300 text-red-800"
      }`}
          >
            {alertMessage}
          </div>
        )}

        {/* SEND OTP BUTTON */}
        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className={`h-14 rounded-2xl font-bold text-[16px] tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-3
            ${
              loading
                ? "bg-[#8D6E63]/70 text-white cursor-not-allowed"
                : "bg-[#4E342E] hover:bg-[#3E2723] text-white hover:scale-[1.01]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending OTP...
              </>
            ) : (
              "SEND OTP"
            )}
          </button>
        ) : (
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className={`h-14 rounded-2xl font-bold text-[16px] tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-3
            ${
              loading || otp.length !== 6
                ? "bg-[#8D6E63]/70 text-white cursor-not-allowed"
                : "bg-[#4E342E] hover:bg-[#3E2723] text-white hover:scale-[1.01]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              "VERIFY OTP"
            )}
          </button>
        )}

        {/* RESEND */}
        {otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="text-sm font-semibold text-[#6D4C41] underline hover:text-[#3E2723] transition"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentOtpModal;
