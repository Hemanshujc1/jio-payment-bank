import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VariantCard from "../components/common/VariantCard";
import debitcardimg from "../assets/debit-card-img.webp"; 
import onboardingService from "../services/onboardingService";

const SavingsVariantPage = () => {
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await onboardingService.getAccountSubscriptions();
        if (response.status === "SUCCESS" && response.data && response.data.length > 0) {
          const subscriptionData = response.data[0].parsedValue || [];
          setVariants(subscriptionData);
        } else {
          setError("Failed to load savings account variants.");
        }
      } catch (err) {
        setError("An error occurred while loading variants.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariants();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-100 flex flex-col items-center justify-center">
        <span className="w-10 h-10 border-4 border-brown-700 border-t-transparent rounded-full animate-spin"></span>
        <p className="mt-4 text-sand-500 font-medium">Loading variants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-100 flex flex-col items-center justify-center">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-brown-700 text-sand-350 rounded-lg hover:bg-brown-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-col px-4 md:px-8 py-1 items-center justify-center flex text-black font-sans">
      {/* Page Title */}
      <h2 className="font-bold text-xl md:text-[22px] tracking-tight mb-8 [@media(max-height:700px)]:mb-4 text-center">
        Select Savings A/C Variant
      </h2>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-stretch justify-center w-full max-w-6xl mx-auto">
        {variants.map((variant) => (
          <VariantCard
            key={variant.subscriptionId}
            title={variant.display?.title || "JPB Savings Account"}
            subtitle={variant.display?.subtitle || ""}
            description={variant.display?.desciption || variant.display?.description || ""}
            charges={variant.issuanceFee}
            imgsrc={debitcardimg}
            imageAlt={`${variant.cardType} Card`}
            benefits={variant.display?.benefits || []}
            onPayClick={() => {
              navigate("/onboarding-flow");
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SavingsVariantPage;
