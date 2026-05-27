import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ProceedButton from "../../common/ProceedButton";
import MobileOtpSection from "../sections/MobileOtpSection";
import OnboardingHeader from "../ui/OnboardingHeader";
import onboardingService from "../../../services/onboardingService";
import ProductSelection from "../sections/ProductSelection";
import IdentityInputs from "../sections/IdentityInputs";
import ConsentsSection from "../sections/ConsentsSection";
import LanguageSelection from "../sections/LanguageSelection";
import { cloneAddress, setAddressFields } from "../../../utils/addressUtils";
import BiometricSection from "../sections/BiometricSection";
import { useToast } from "../../ui/Toast";
import { MOBILE_REGEX, isRepeatingDigits, focusFirstError } from "../../../utils/validationUtils";

const OnboardingTab = ({
  onNext,
  setKycData,
  isVerificationComplete,
  setIsVerificationComplete,
  isMobileVerified,
  setIsMobileVerified,
  showOtp,
  setShowOtp,
  mobileNumber,
  setMobileNumber,
  emailId,
  setEmail,
  isEmailVerified,
  setIsEmailVerified,
  showEmailOtp,
  setShowEmailOtp,
  applicationNumber,
  externalAppRefNumber,
  setApplicationNumber,
  setExternalAppRefNumber,
}) => {
  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const toast = useToast();

  const productType = watch("onboarding.productType");
  const language = watch("onboarding.language");
  const pan = watch("onboarding.pan") || "";
  const aadhaar = watch("onboarding.aadhaar") || "";

  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);

  const [documentStatus, setDocumentStatus] = useState("idle"); // idle, success, mismatch
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [isVerifyingDocuments, setIsVerifyingDocuments] = useState(false);

  const [consentsList, setConsentsList] = useState([]);
  const [selectedConsents, setSelectedConsents] = useState({});
  const [panAadhaarFailed, setPanAadhaarFailed] = useState(false);
  const [panAadhaarSuccess, setPanAadhaarSuccess] = useState(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState("");

  const languagesList = [
    { name: "English", code: "EN" },
    { name: "Hindi", code: "HI" },
    { name: "Telugu", code: "TA" },
    { name: "Tamil", code: "TE" },
    { name: "Kannada", code: "KN" },
    { name: "Marathi", code: "MR" },
    { name: "Bengali", code: "BN" },
  ];

  const getImageSrc = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const selectedLang = languagesList.find((l) => l.name === language);
        const langCode = selectedLang ? selectedLang.code : "EN";
        const res = await onboardingService.getConsents(langCode);
        if (res.status === "SUCCESS" && res.response?.consents) {
          const allConsents = res.response.consents;
          const nomineeConsent = allConsents.find(c => c.activityType === "NOMINEE_IN");
          if (nomineeConsent) {
            setValue("onboarding.nomineeConsentData", nomineeConsent);
          }
          const filtered = allConsents.filter(c => c.activityType === "AADHAR_PAN" && (!c.language || c.language === langCode));
          setConsentsList(filtered);
          const initial = {};
          filtered.forEach((c) => {
            initial[c.consentTextCode] = false;
          });
          setSelectedConsents(initial);
        }
      } catch (err) {
        console.error("Failed to fetch consents", err);
      }
    };
    fetchConsents();
  }, [language]);

  const isAllConsentsSelected =
    consentsList.length > 0 &&
    consentsList.every((c) => c.mandatory !== "Y" || selectedConsents[c.consentTextCode]);

  const captureBiometric = async (biometricXml) => {
    setIsBiometricLoading(true);
    setPanAadhaarFailed(false);
    setPanAadhaarSuccess(false);
    setVerificationErrorMessage("");

    try {
      const finalConsents = consentsList
        .filter((c) => selectedConsents[c.consentTextCode])
        .map((c) => ({
          consent: c.text1,
          code: c.consentTextCode,
          version: "1",
          method: "checkbox",
        }));

      const payload = {
        applicationNumber,
        externalAppRefNumber,
        panNo: pan,
        aadharNo: aadhaar,
        bioMetricData: biometricXml,
        consents: finalConsents,
      };

      const response = await onboardingService.panAadhaarVerify(payload);

      console.log("DEBUG RESPONSE:", response);

      if (response.status === "SUCCESS") {
        setIsBiometricVerified(true);
        setDocumentStatus("success");
        setPanAadhaarSuccess(true);

        const apiData = response?.data?.persons;
        const aadhaarData = apiData?.aadhaar;
        const financialData = apiData?.financialDetails;

        // ✅ KEEP EXISTING KYC FLOW
        const formattedKyc = {
          name: aadhaarData?.name,
          dob: aadhaarData?.dob,
          gender: aadhaarData?.gender,
          aadhaar: aadhaarData?.maskedAadhaar,
          address: aadhaarData?.address,
          photo: aadhaarData?.photo,
        };

        setKycData(formattedKyc);

        // ✅ PAN
        setValue("applicant.pan", financialData?.panNumber || "");

        // ✅ Aadhaar (masked)
        setValue("applicant.aadhaar", aadhaarData?.maskedAadhaar || "");

        // ✅ NAME SPLIT
        const fullName = aadhaarData?.name || "";
        const names = fullName.split(" ");

        setValue("applicant.firstName", names[0] || "");
        setValue("applicant.middleName", names.slice(1, -1).join(" ") || "");
        setValue("applicant.lastName", names[names.length - 1] || "");

        // ✅ DOB
        setValue("applicant.dob", aadhaarData?.dob || "");

        // ✅ GENDER
        setValue(
          "applicant.gender",
          aadhaarData?.gender === "M" ? "Male" : "Female",
        );

        // ✅ CONSENTS
        setValue("onboarding.consents", finalConsents);

        // ✅ IMAGE (BASE64)
        setValue("applicant.photo", aadhaarData?.photo || "");

        // ✅ AADHAAR ADDRESS — Store raw API response as master structure (NO transformation)
        // Per Rule 1 of StepsTOStoreData.md: use deep clone only, no modification
        const rawAadhaarAddr = aadhaarData?.address || {};
        const aadhaarMasterAddr = cloneAddress(rawAadhaarAddr, "PERMANENT", false);
        setAddressFields(setValue, "applicant.aadhaarAddress", aadhaarMasterAddr, false);

        // ℹ️ Communication address is NOT pre-filled here.
        // It is populated only when the user selects "Same as Aadhaar Address"
        // or enters manually in AadhaarDetailsTab.

        // ✅ MOBILE (FROM OTP FLOW)
        setValue("applicant.mobileNumber", mobileNumber || "");

        // ✅ EMAIL (FROM OTP FLOW)
        setValue("applicant.emailId", emailId || "");

        console.log("✅ FINAL APPLICANT STORED:", {
          pan: financialData?.panNumber,
          aadhaar: aadhaarData?.maskedAadhaar,
          mobile: mobileNumber,
          email: emailId,
        });
      } else {
        setIsBiometricVerified(false);
        setDocumentStatus("mismatch");
        setPanAadhaarFailed(true);
        const msg = response.error?.message || response.message || "Identity verification failed.";
        setVerificationErrorMessage(msg);
        toast.error(msg);
      }
    } catch (error) {
      console.error("ERROR:", error);
      setIsBiometricVerified(false);
      setDocumentStatus("mismatch");
      setPanAadhaarFailed(true);
      const msg = error.message || "An error occurred during verification.";
      setVerificationErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsBiometricLoading(false);
    }
  };

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
        );

        // Always try to capture IDs if returned, as they might be needed for other retries
        if (response.applicationNumber)
          setApplicationNumber(response.applicationNumber);
        if (response.externalAppRefNumber)
          setExternalAppRefNumber(response.externalAppRefNumber);

        if (response.status === "SUCCESS") {
          setShowOtp(true);
        } else {
          toast.error(response.error?.message || response.message || "Failed to generate mobile OTP. Please try again.");
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
        setIsMobileVerified(true);
      } else {
        toast.error(response.error?.message || response.message || "Invalid OTP. Please try again.");
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
          toast.error(response.error?.message || response.message || "Failed to send email OTP. Please try again.");
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
      console.log("DEBUG: Verifying Email OTP", {
        otp,
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });
      const response = await onboardingService.verifyEmailOtp({
        otp,
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });

      if (response.status === "SUCCESS") {
        setIsEmailVerified(true);
      } else {
        toast.error(response.error?.message || response.message || "Invalid Email OTP. Please try again.");
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
      });

      if (response.status === "SUCCESS") {
        toast.success("Mobile OTP resent successfully.");
      } else {
        toast.error(response.error?.message || response.message || "Failed to resend OTP. Please try again.");
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
      console.log("DEBUG: Resending Email OTP", { emailId, applicationNumber });
      const response = await onboardingService.resendEmailOtp({
        emailId: emailId,
        applicationNumber,
        externalAppRefNumber,
      });

      if (response.status === "SUCCESS") {
        toast.success("Email OTP resent successfully.");
      } else {
        toast.error(response.error?.message || response.message || "Failed to resend email OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while resending email OTP.");
    } finally {
      setIsEmailApiLoading(false);
    }
  };
  const handleAadhaarChange = (e) => {
    const val = e.target.value;
    let chars = "";

    if (showAadhaar) {
      chars = val.replace(/[^0-9]/g, "").slice(0, 16);
    } else {
      const maskedVal = formatAadhaar(aadhaar).replace(/[0-9]/g, "X");
      if (val.length > maskedVal.length) {
        const added = val.slice(-1);
        if (/[0-9]/.test(added)) {
          chars = (aadhaar + added).slice(0, 16);
        } else {
          chars = aadhaar;
        }
      } else if (val.length < maskedVal.length) {
        chars = aadhaar.slice(0, -1);
      } else {
        chars = aadhaar;
      }
    }
    setValue("onboarding.aadhaar", chars, { shouldValidate: false });
    if (documentStatus !== "idle") setDocumentStatus("idle");
    if (panAadhaarFailed || panAadhaarSuccess) {
      setPanAadhaarFailed(false);
      setPanAadhaarSuccess(false);
      setVerificationErrorMessage("");
    }
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase();
    const chars = val.replace(/[^A-Z0-9]/g, "");
    setValue("onboarding.pan", chars.slice(0, 10), { shouldValidate: false });
    if (documentStatus !== "idle") setDocumentStatus("idle");
    if (panAadhaarFailed || panAadhaarSuccess) {
      setPanAadhaarFailed(false);
      setPanAadhaarSuccess(false);
      setVerificationErrorMessage("");
    }
  };

  const handleBlur = (field) => {
    trigger(`onboarding.${field}`);
  };

  const formatAadhaar = (val) => {
    if (!val) return "";
    const parts = val.match(/.{1,4}/g);
    return parts ? parts.join("-") : val;
  };

  const displayAadhaar = showAadhaar
    ? formatAadhaar(aadhaar)
    : aadhaar
      ? formatAadhaar(aadhaar).replace(/[0-9]/g, "X")
      : "";



  const handleProceed = async () => {
    const isValid = await trigger("onboarding");

    console.log("isValid:", isValid);
    console.log("panAadhaarSuccess:", panAadhaarSuccess);

    if (isValid && panAadhaarSuccess) {
      console.log("➡️ MOVING TO NEXT TAB");
      onNext();
    } else if (!isValid) {
      toast.error("Please enter valid information in all fields.");
      focusFirstError();
    } else if (!panAadhaarSuccess) {
      toast.warning("Please complete biometric verification successfully first.");
    }
  };

  if (!isVerificationComplete) {
    return (
      <MobileOtpSection
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        email={emailId}
        setEmail={setEmail}
        showMobileOtp={showOtp}
        handleGenerateMobileOtp={handleGenerateOtp}
        isMobileVerified={isMobileVerified}
        setIsMobileVerified={setIsMobileVerified}
        showEmailOtp={showEmailOtp}
        isEmailVerified={isEmailVerified}
        setIsEmailVerified={setIsEmailVerified}
        onProceed={() => setIsVerificationComplete(true)}
        isApiLoading={isApiLoading}
        isVerifyingOtp={isVerifyingOtp}
        handleVerifyMobileOtp={handleVerifyMobileOtp}
        isEmailApiLoading={isEmailApiLoading}
        handleGenerateEmailOtp={handleSendEmailOtp}
        isVerifyingEmailOtp={isVerifyingEmailOtp}
        handleVerifyEmailOtp={handleVerifyEmailOtp}
        handleResendMobileOtp={handleResendMobileOtp}
        handleResendEmailOtp={handleResendEmailOtp}
        applicationNumber={applicationNumber}
      />
    );
  }

  return (
    <div className="w-full flex-col px-4 md:px-8 pt-2 pb-0 text-black animate-in fade-in duration-500 max-w-7xl mx-auto">
      <OnboardingHeader />

      <ProductSelection
        productType={productType}
        setProductType={(val) => setValue("onboarding.productType", val)}
      />

      <IdentityInputs
        showPan={showPan}
        setShowPan={setShowPan}
        showAadhaar={showAadhaar}
        setShowAadhaar={setShowAadhaar}
        aadhaar={aadhaar}
        handleAadhaarChange={handleAadhaarChange}
        handlePanChange={handlePanChange}
        handleBlur={handleBlur}
        displayAadhaar={displayAadhaar}
        pan={pan}
        errors={errors.onboarding}
      />

      <ConsentsSection
        consents={consentsList}
        selectedConsents={selectedConsents}
        setSelectedConsents={setSelectedConsents}
        errors={errors.onboarding}
      />

      <LanguageSelection
        language={language}
        setLanguage={(val) => setValue("onboarding.language", val)}
        languages={languagesList}
      />

      {/* Biometric Integration Step */}
      <BiometricSection
        isBiometricVerified={isBiometricVerified}
        setIsBiometricVerified={setIsBiometricVerified} // ✅ ADD THIS
        aadhaar={aadhaar}
        pan={pan}
        documentStatus={documentStatus}
        onCaptureSuccess={captureBiometric}
      />



      {panAadhaarSuccess && (
        <div className="w-full max-w-4xl mx-auto mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white shrink-0 font-bold text-sm mt-0.5">
            ✓
          </div>
          <div className="flex flex-col">
            <p className="text-green-800 font-bold text-[15px]">
              Verification Passed
            </p>
            <p className="text-green-600 text-[13.5px] mt-0.5">
              Aadhaar and PAN details have been successfully verified.
            </p>
          </div>
        </div>
      )}

      {/* Final Proceed */}
      <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
        <ProceedButton
          onClick={handleProceed}
          disabled={
            !panAadhaarSuccess || isVerifyingDocuments || !isAllConsentsSelected
          }
          className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default OnboardingTab;
