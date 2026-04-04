import React from 'react';
import ProceedButton from '../ProceedButton';

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
          dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula
          eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus. Donec quam felis,
          ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat
          massa quis enim. Donec pede justo, fringilla vel, aliquet nec,
          vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
          venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
          Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
          vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat
          vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra
          quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius
          laoreet. Quisque rutrum. Aenean imperdiet.
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
