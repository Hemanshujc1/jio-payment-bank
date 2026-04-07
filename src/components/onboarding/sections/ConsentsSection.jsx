import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const ConsentsSection = ({
  agreeTerms,
  setAgreeTerms,
  aepsConsent,
  setAepsConsent,
  agreeAeps,
  setAgreeAeps,
  agreeSweep,
  setAgreeSweep,
  fatcaDeclared,
  setFatcaDeclared,
  errors,
}) => {
  return (
    <>
      {/* T&C Checkbox */}
      <div className="flex flex-col gap-1 mb-8">
        <div 
          className="flex items-center gap-3 cursor-pointer w-fit"
          onClick={() => setAgreeTerms(!agreeTerms)}
        >
          <div className={`w-5 h-5 border-2 ${errors?.agreeTerms ? 'border-red-500' : 'border-primary'} flex items-center justify-center shrink-0`}>
            {agreeTerms && <IoMdCheckmark />}
          </div>
          <span className="text-[15px]">
            I agree to the{" "}
            <span className="text-[blue] font-medium">Terms & Conditions</span>
          </span>
          <input
            type="checkbox"
            className="hidden"
            checked={agreeTerms}
            readOnly
          />
        </div>
        {errors?.agreeTerms && <span className="text-red-500 text-[12px] font-medium ml-8">{errors.agreeTerms.message}</span>}
      </div>

      {/* Consent AePS */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
        <h2 className="font-semibold text-[19px] tracking-tight">
          Consent to Enable AePS Service
        </h2>
        <div className="flex gap-4">
          <button
            className={`w-16 py-1.5 rounded-full border border-black font-semibold transition-colors ${
              aepsConsent === "yes"
                ? "bg-primary border-transparent"
                : "bg-transparent"
            }`}
            onClick={() => setAepsConsent("yes")}
          >
            YES
          </button>
          <button
            className={`w-16 py-1.5 rounded-full border border-black font-semibold transition-colors ${
              aepsConsent === "no"
                ? "bg-primary border-transparent"
                : "bg-transparent"
            }`}
            onClick={() => setAepsConsent("no")}
          >
            NO
          </button>
        </div>
      </div>

      {/* Long Checkboxes */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-start gap-4">
          <div 
            className="cursor-pointer shrink-0 mt-0.5"
            onClick={() => setAgreeAeps(!agreeAeps)}
          >
            <div className={`w-5 h-5 border-2 ${errors?.agreeAeps ? 'border-red-500' : 'border-primary'} flex items-center justify-center`}>
              {agreeAeps && <IoMdCheckmark />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={agreeAeps}
              readOnly
            />
          </div>
          <p className="text-[13px] leading-tight text-black max-w-6xl">
            I hereby give consent to activate Aadhaar-enabled Payment System
            (AePS) services for my bank account with Jio Payments Bank Ltd. I
            understand and agree to the use of my Aadhaar data solely for secure
            AePS financial transactions. I authorize communication for transaction
            updates.
          </p>
        </div>
        {errors?.agreeAeps && <span className="text-red-500 text-[12px] font-medium ml-9">{errors.agreeAeps.message}</span>}
      </div>

      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-start gap-4">
          <div 
            className="cursor-pointer shrink-0 mt-0.5"
            onClick={() => setAgreeSweep(!agreeSweep)}
          >
            <div className={`w-5 h-5 border-2 ${errors?.agreeSweep ? 'border-red-500' : 'border-primary'} flex items-center justify-center`}>
              {agreeSweep && <IoMdCheckmark />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={agreeSweep}
              readOnly
            />
          </div>
          <p className="text-[13px] leading-tight text-black max-w-6xl">
            I agree to opening a Sweep Savings Account with Jio Payments Bank’s
            partner bank. I hereby provide my consent to Jio Payments Bank Limited
            (Bank) for opening and sharing my KYC details with Suryoday Small
            Finance Bank (“Partner Bank”) for the purpose of opening my Current
            Account and/or Savings Account to transfer amounts exceeding the
            maximum limit (currently 1.95 Lakhs but subject to change) in my
            Current Account, Savings Account and Pre-Paid Instrument put together
            with the Bank. I understand and agree to the terms and conditions
            governing the bank services as available on the bank’s website. {"("}
            <span className="underline">www.jiopaymentsbank.com</span>
            {")"}
          </p>
        </div>
        {errors?.agreeSweep && <span className="text-red-500 text-[12px] font-medium ml-9">{errors.agreeSweep.message}</span>}
      </div>

      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-start gap-4">
          <div 
            className="cursor-pointer shrink-0 mt-0.5"
            onClick={() => setFatcaDeclared(!fatcaDeclared)}
          >
            <div className={`w-5 h-5 border-2 ${errors?.fatcaDeclared ? 'border-red-500' : 'border-primary'} flex items-center justify-center`}>
              {fatcaDeclared && <IoMdCheckmark />}
            </div>
            <input 
              type="checkbox" 
              className="hidden"
              checked={fatcaDeclared}
              readOnly
            />
          </div>
          <p className="text-[14px] leading-tight text-black max-w-6xl">
            I hereby declare that i am Indian Citizen, Indian Tax resident and not a US Citizen / Green Card Holder. (FATCA Declaration)
          </p>
        </div>
        {errors?.fatcaDeclared && <span className="text-red-500 text-[12px] font-medium ml-9">{errors.fatcaDeclared.message}</span>}
      </div>
    </>
  );
};

export default ConsentsSection;
