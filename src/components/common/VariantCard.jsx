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
    <div className="flex flex-col gap-2 w-[92%] sm:w-full max-w-85 sm:max-w-sm md:max-w-95 lg:max-w-100 mx-auto group relative">
      <div 
        onClick={onPayClick} 
        onMouseEnter={() => setShowBenefits(true)}
        onMouseLeave={() => setShowBenefits(false)}
        className="bg-white rounded-3xl sm:rounded-[28px] p-5 sm:p-6 [@media(max-height:700px)]:p-4 flex flex-col items-center text-center shadow-lg h-auto min-h-105 sm:min-h-120 lg:min-h-125 [@media(max-height:700px)]:lg:min-h-[410px] transform transition-transform duration-300 lg:group-hover:-translate-y-2 relative overflow-hidden"
      >

        {/* Hover Overlay for Benefits */}
        {benefits && benefits.length > 0 && (
          <div className={`absolute inset-x-1 top-1 bottom-16 sm:bottom-20 bg-white/95 backdrop-blur-sm rounded-[22px] sm:rounded-3xl z-10 p-5 px-5 sm:px-6 transition-all duration-300 flex flex-col items-start text-left overflow-y-auto scrollbar-hide border border-gray-100 shadow-inner ${showBenefits ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <h4 className="font-bold text-[15px] sm:text-[16px] mb-2 sm:mb-3 tracking-wide">BENEFITS:</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="text-[12px] sm:text-[13px] leading-snug flex items-start gap-1.5 font-medium text-gray-800">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Image Placeholder */}
        <div className="w-[90%] sm:w-full h-36 sm:h-44 [@media(max-height:700px)]:h-32 [@media(max-height:700px)]:sm:h-36 bg-neutral-light rounded-2xl sm:rounded-2xl mb-4 sm:mb-6 [@media(max-height:700px)]:mb-3 overflow-hidden flex items-center justify-center shrink-0">
          <img 
            src={imgsrc}
            alt={imageAlt} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <h3 className="text-primary font-bold text-[19px] sm:text-[22px] tracking-tight mb-1 leading-tight">{title}</h3>
        <p className="font-medium text-[14px] sm:text-[16px] [@media(max-height:700px)]:text-[14px] mb-4 sm:mb-5 [@media(max-height:700px)]:mb-2 text-gray-600">{subtitle}</p>
        
        <p className="text-[13px] sm:text-[15px] [@media(max-height:700px)]:text-[13px] leading-relaxed mb-6 sm:mb-8 [@media(max-height:700px)]:mb-4 grow flex items-start justify-center pt-1 sm:pt-2">
          {description}
        </p>
        
        <div className="w-full flex justify-between items-center mt-auto px-1 sm:px-2 z-20">
          <span className="text-[15px] sm:text-[17px]">Charges: <strong className="font-extrabold text-[18px] sm:text-[20px]">{charges}</strong></span>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBenefits(!showBenefits);
            }}
            className="text-[#641E1E] text-[11px] sm:text-[12px] text-right hover:underline font-medium z-20 relative cursor-pointer"
          >
            {showBenefits ? "Hide benefits <<" : "More benefits >>"}
          </button>
        </div>
      </div>
      
      {/* Action Button (always visible on mobile, shown on hover on desktop) */}
      {/* <button 
        onClick={onPayClick}
        className="w-full bg-[#f6c374] text-black font-extrabold text-[18px] sm:text-[22px] py-3 sm:py-3.5 tracking-wide rounded-2xl sm:rounded-2xl shadow-md cursor-pointer hover:bg-[#eab768] transition-all duration-300 opacity-100 visible lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible mt-2 sm:mt-3"
      >
        {buttonText}
      </button> */}
    </div>
  );
};

export default VariantCard;
