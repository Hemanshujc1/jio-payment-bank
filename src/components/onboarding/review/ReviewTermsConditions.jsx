import React from 'react';
import ProceedButton from '../../common/ProceedButton';

const ReviewTermsConditions = ({
  termsAccepted,
  setTermsAccepted,
  onSubmit,
}) => {
  return (
    <section className="w-full">
      <h3 className="font-bold text-[18px] tracking-wide mb-6 text-center">
        Terms & Conditions
      </h3>
      <div className="w-full mb-8 text-[15px] leading-relaxed text-gray-800 text-justify">
        <p>
         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore doloremque quam, dolore quia perspiciatis officiis explicabo dolorum quod iste nesciunt laborum, sequi accusantium vel velit? Error quis, impedit quasi nulla minima inventore labore nemo sint ullam cum, non id! Necessitatibus ullam voluptatum maiores quasi officiis exercitationem commodi atque minima iste.
        </p>
      </div>
      <div className="flex items-center gap-3 mb-10">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="w-5 h-5 cursor-pointer rounded-sm"
          style={{
            backgroundColor: termsAccepted ? "#D1A054" : "transparent",
            border: "2px solid #D1A054",
          }}
        />
        <span className="text-[14px] text-gray-900 font-medium">
          I have read and fully understood the agreement, along with Terms &
          Conditions
        </span>
      </div>

      <div className="flex justify-center w-full mb-10">
        <ProceedButton
          onClick={onSubmit}
          disabled={!termsAccepted}
          className="w-fit"
        />
      </div>
    </section>
  );
};

export default ReviewTermsConditions;
