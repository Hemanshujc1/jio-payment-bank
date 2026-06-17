import { useState } from "react";
import onboardingService from "../../../services/onboardingService";
import { MOBILE_REGEX, isRepeatingDigits } from "../../../utils/validationUtils";
import { useToast } from "../../ui/Toast";

export const useOtpVerification = ({
  mobileNumber,
  emailId,
  applicationNumber,
  externalAppRefNumber,
  setApplicationNumber,
  setExternalAppRefNumber,
  setShowOtp,
  setIsMobileVerified,
  setShowEmailOtp,
  setIsEmailVerified,
  variantDetails,
}) => {
  const toast = useToast();

  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailApiLoading, setIsEmailApiLoading] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);

  const handleGenerateOtp = async () => {
    if (MOBILE_REGEX.test(mobileNumber) && !isRepeatingDigits(mobileNumber)) {
      setIsApiLoading(true);
      try {
        const response = await onboardingService.generateOtp(
          mobileNumber,
          emailId,
          variantDetails
        );

        if (response.applicationNumber)
          setApplicationNumber(response.applicationNumber);
        if (response.externalAppRefNumber)
          setExternalAppRefNumber(response.externalAppRefNumber);

        if (response.status === "SUCCESS") {
          toast.success(response.message || "OTP Sent successfully.");
          setShowOtp(true);
        } else {
          toast.error(
            response.error?.message ||
              response.message ||
              "Failed to generate mobile OTP. Please try again."
          );
        }
      } catch (error) {
        toast.error(error.message || "An error occurred while generating OTP.");
      } finally {
        setIsApiLoading(false);
      }
    } else {
      toast.warning("Please enter a valid mobile number.");
    }
  };

  const handleVerifyMobileOtp = async (otp) => {
    setIsVerifyingOtp(true);
    try {
      const response = await onboardingService.verifyOtp({
        applicationNumber,
        externalAppRefNumber,
        otp,
        mobileNumber,
      });

      if (response.status === "SUCCESS") {
        toast.success(response.message || "OTP Verified successfully.");
        setIsMobileVerified(true);
      } else {
        toast.error(
          response.error?.message ||
            response.message ||
            "Invalid OTP. Please try again."
        );
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while verifying OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!applicationNumber) {
      toast.warning("Please generate mobile OTP first to start the application.");
      return;
    }
    if (emailId.length > 0) {
      setIsEmailApiLoading(true);
      try {
        const response = await onboardingService.sendEmailOtp({
          emailId: emailId,
          applicationNumber,
          externalAppRefNumber,
        });

        if (response.status === "SUCCESS") {
          setShowEmailOtp(true);
        } else {
          toast.error(
            response.error?.message ||
              response.message ||
              "Failed to send email OTP. Please try again."
          );
        }
      } catch (error) {
        toast.error(error.message || "An error occurred while sending email OTP.");
      } finally {
        setIsEmailApiLoading(false);
      }
    }
  };

  const handleVerifyEmailOtp = async (otp) => {
    setIsVerifyingEmailOtp(true);
    try {
      const response = await onboardingService.verifyEmailOtp({
        otp,
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });

      if (response.status === "SUCCESS") {
        setIsEmailVerified(true);
      } else {
        toast.error(
          response.error?.message ||
            response.message ||
            "Invalid Email OTP. Please try again."
        );
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while verifying email OTP.");
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleResendMobileOtp = async () => {
    setIsApiLoading(true);
    try {
      const response = await onboardingService.resendOtp({
        applicationNumber,
        externalAppRefNumber
      });

      if (response.status === "SUCCESS") {
        toast.success("Mobile OTP resent successfully.");
      } else {
        toast.error(
          response.error?.message ||
            response.message ||
            "Failed to resend OTP. Please try again."
        );
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while resending OTP.");
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    setIsEmailApiLoading(true);
    try {
      const response = await onboardingService.resendEmailOtp({
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });

      if (response.status === "SUCCESS") {
        toast.success("Email OTP resent successfully.");
      } else {
        toast.error(
          response.error?.message ||
            response.message ||
            "Failed to resend email OTP. Please try again."
        );
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while resending email OTP.");
    } finally {
      setIsEmailApiLoading(false);
    }
  };

  return {
    isApiLoading,
    isVerifyingOtp,
    isEmailApiLoading,
    isVerifyingEmailOtp,
    handleGenerateOtp,
    handleVerifyMobileOtp,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    handleResendMobileOtp,
    handleResendEmailOtp,
  };
};
