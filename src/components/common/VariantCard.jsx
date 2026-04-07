import React, { useState } from 'react';

const VariantCard = ({
  title,
  subtitle,
  description,
  charges,
  imgsrc,
  imageAlt,
  onPayClick,
  buttonText = "Proceed",
  benefits = []
}) => {
  const [showBenefits, setShowBenefits] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full md:w-95 group relative">
      <div className="bg-white rounded-[28px] p-4 flex flex-col items-center text-center shadow-lg h-115 transform transition-transform duration-300 group-hover:-translate-y-2 relative overflow-hidden">

        {/* Hover Overlay for Benefits */}
        {benefits && benefits.length > 0 && (
          <div className={`absolute inset-x-1 top-1 bottom-16 bg-white/90 backdrop-blur-sm rounded-3xl z-10 p-5 px-6 transition-all duration-300 flex flex-col items-start text-left overflow-y-auto scrollbar-hide border border-gray-100 shadow-inner ${showBenefits ? 'opacity-100 visible' : 'opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible'}`}>
            <h4 className="font-bold text-[16px] mb-3 tracking-wide">BENEFITS:</h4>
            <ul className="space-y-1.5">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="text-[13px] leading-snug flex items-start gap-1.5 font-medium text-gray-800">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Image Placeholder */}
        <div className="w-full h-48 bg-neutral-light rounded-2xl mb-6 overflow-hidden flex items-center justify-center text-sm text-gray-500 font-medium shrink-0">
          <img 
            src={imgsrc}
            alt={imageAlt} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <h3 className="text-primary font-bold text-[22px] tracking-tight mb-1">{title}</h3>
        <p className="font-medium text-[16px] mb-5">{subtitle}</p>
        
        <p className="text-[15px] leading-snug mb-8 grow flex items-start justify-center pt-2">
          {description}
        </p>
        
        <div className="w-full flex justify-between items-center mt-auto px-1 z-20">
          <span className="text-[17px]">Charges: <strong className="font-extrabold text-[20px]">{charges}</strong></span>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowBenefits(!showBenefits);
            }}
            className="text-[#641E1E] text-[12px] text-right hover:underline font-medium z-20 relative cursor-pointer"
          >
            {showBenefits ? "Hide benefits <<" : "More benefits >>"}
          </button>
        </div>
      </div>
      
      {/* Action Button (always visible on mobile, shown on hover on desktop) */}
      <button 
        onClick={onPayClick}
        className="w-full bg-[#f6c374] text-black font-extrabold text-[22px] py-3 tracking-wide rounded-2xl shadow-md cursor-pointer hover:bg-[#eab768] transition-all duration-300 opacity-100 visible lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible mt-2"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default VariantCard;
