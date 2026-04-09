import React from "react";
import { useNavigate } from "react-router-dom";
import VariantCard from "../components/common/VariantCard";
import debitcardimg from "../assets/debit-card-img.webp";

const SavingsVariantPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-col px-4 md:px-8 py-1 items-center justify-center flex text-black font-sans">
      {/* Page Title */}
      <h2 className="font-bold text-xl md:text-[22px] tracking-tight mb-8 text-center">
        Select Savings A/C Variant
      </h2>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-start justify-center w-full max-w-6xl mx-auto">
        {/* Card 1: Physical Debit Card */}
        <VariantCard
          title="Platinum Savings Account"
          subtitle="With Platinum Physical Debit Card"
          description="Experience lifestyle benefits like Airport Lounge Access, Insurance cover, exclusive shopping & dining offers & much more."
          charges="400"
          imgsrc={debitcardimg}
          imageAlt="Physical Card Placeholder"
          benefits={[
            "Complimentary Domestic Airport/Railway Lounge Access, once per year",
            "Complimentary RuPay Platinum Debit Card",
            "Upto 2 lakhs personal accident insurance cover",
            "Exclusive lifestyle offers provided by merchants",
            "Enhanced daily PoS / E-commerce shopping limit of Rs. 50,000/-",
            "5 free ATM transactions per month with daily withdrawable limit of Rs. 50,000/-",
            "No minimum balance requirement",
            "Upto 4%* p.a. Interest",
            "Free Fund Transfers",
            "Free Monthly E-statements",
            "UPI for transfers, bill payments, recharges & more",
          ]}
          onPayClick={() => {
            navigate("/onboarding-flow");
          }}
        />

        {/* Card 2: Virtual Debit Card */}
        <VariantCard
          title="Standard Savings Account"
          subtitle="With Platinum Virtual Debit Card"
          description="Enjoy seamless and secure online transactions & much more."
          charges="100"
          imgsrc={debitcardimg}
          imageAlt="Virtual Card Placeholder"
          benefits={[
            "No minimum balance requirement",
            "Upto 4%* p.a. Interest",
            "Free Fund Transfers",
            "Free Monthly E-statements",
            "UPI for transfers, bill payments, recharges & more",
          ]}
          onPayClick={() => {
            navigate("/onboarding-flow");
          }}
        />
      </div>
    </div>
  );
};

export default SavingsVariantPage;
