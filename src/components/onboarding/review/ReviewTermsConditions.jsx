import React from 'react';
import ProceedButton from '../../common/ProceedButton';

const ReviewTermsConditions = ({
  termsAccepted,
  setTermsAccepted,
  onSubmit,
}) => {
  return (
    <section className="w-full relative px-1 sm:px-0">
      <h3 className="font-bold text-[16px] sm:text-[18px] tracking-wide mb-6 text-center text-gray-800">
        Terms & Conditions
      </h3>
      <div className="w-full mb-8 text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify max-h-75 overflow-y-auto scrollbar-hide custom-scrollbar">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore doloremque quam, dolore quia perspiciatis officiis explicabo dolorum quod iste nesciunt laborum, sequi accusantium vel velit? Error quis, impedit quasi nulla minima inventore labore nemo sint ullam cum, non id! Necessitatibus ullam voluptatum maiores quasi officiis exercitationem commodi atque minima iste.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore doloremque quam, dolore quia perspiciatis officiis explicabo dolorum quod iste nesciunt laborum, sequi accusantium vel velit? Error quis, impedit quasi nulla minima inventore labore nemo sint ullam cum, non id! Necessitatibus ullam voluptatum maiores quasi officiis exercitationem commodi atque minima iste.
        </p>
      </div>
      
      <div className="flex items-start gap-3.5 mb-10 max-w-full mx-auto group cursor-pointer" 
      onClick={() => setTermsAccepted(!termsAccepted)}>
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => {
            e.stopPropagation();
            setTermsAccepted(e.target.checked);
          }}
          className="w-5 h-5 cursor-pointer rounded-sm accent-black shrink-0 mt-0.5"
        />
        <span className="text-[13px] sm:text-[14px] text-gray-700 font-bold leading-relaxed transition-colors group-hover:text-black">
          I have read and fully understood the agreement, along with Terms & Conditions
        </span>
      </div>

      <div className="flex justify-center w-full">
        <ProceedButton
          onClick={onSubmit}
          disabled={!termsAccepted}
          className="w-full sm:w-auto min-w-37.5 shadow-lg"
        />
      </div>
    </section>
  );
};

export default ReviewTermsConditions;
