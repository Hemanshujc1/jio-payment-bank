import React from "react";
import ReviewHeader from "./ReviewHeader";
import { IoMdCheckmark } from "react-icons/io";
import ReviewRow from "./ReviewRow";

const ReviewSeedDetails = ({ consents, onEdit }) => {
  // Check if c44 consent exists in the provided consents array
  const c44Consent = consents?.find(
    (c) =>
      c.code?.toLowerCase() === "c44" ||
      c.consentTextCode?.toLowerCase() === "c44",
  );

  // If c44 is not selected or not present, do not render this section or render it empty
  if (!c44Consent) {
    return null;
  }

  // Use mock data as the API is not ready yet
  const mockBankName = "State Bank of India";
  const mockBankIIN = "123456";

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Seed Details" onEdit={onEdit} />

      <div className="flex flex-col gap-6 w-full mx-auto mt-4 sm:px-2">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 shrink-0 mt-[2px] flex items-center justify-center bg-gray-700 text-white rounded-[3px] shadow-sm">
            <IoMdCheckmark className="text-sm font-bold" />
          </div>
          <p className="text-gray-900 font-medium text-[14.5px] leading-snug">
            {c44Consent.consent || ""}
            {/* {
              "I have read the [[https://www.jiopayments.bank.in/terms-and-conditions||Terms and Conditions]] and voluntarily give my consent to Seed my Aadhaar/UID number issued by the UIDAI, Government of India in my name with my aforesaid account. I authorize Jio Payments Bank to use my Aadhaar details and biometric/OTP data to authenticate and verify my identity with UIDAI.\r\n\r\nTerms and Conditions:\r\nI submit my Aadhaar number and voluntarily give my consent to:\r\n1. Seed my Aadhaar/UID number issued by the UIDAI, Government of India in my name with my  aforesaid account.\r\n2. Map it at NPCI to enable me to receive Direct Benefit Transfer (DBT) from Government of India  in my above account. I understand that if more than one Benefit transfer is due to me, I will receive all Benefit Transfers in this account. \r\n3. Use my Aadhaar details to authenticate me from UIDAI \r\n4. Use my mobile number mentioned below for sending SMS alerts to me. \r\n\r\nI have been given to understand that my information submitted to the bank herewith shall not be used  for any purpose other than mentioned above, or as per requirements of law."
            } */}
          </p>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
         {/* <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 px-1"> */}

          <ReviewRow
            label="Seeded Bank Name"
            value={mockBankName}
          />

          <ReviewRow
            label="Seeded Bank IN"
            value={mockBankIIN}
          />

        </div>
      </div>
    </section>
  );
};

export default ReviewSeedDetails;
