import React from 'react';
import ProceedButton from '../../common/ProceedButton';

const ReviewTermsConditions = ({
  onSubmit,
}) => {
  return (
    <section className="w-full relative px-1 sm:px-0">
      <div className="flex justify-center w-full mt-2 mb-5 py-3 sm:mt-4">
        <ProceedButton
          onClick={onSubmit}
          className="w-fit shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        />
      </div>
    </section>
  );
};

export default ReviewTermsConditions;
