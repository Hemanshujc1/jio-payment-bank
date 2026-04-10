import React from 'react';

const ReviewHeader = ({ title, onEdit }) => {
  return (
    <div className="relative w-full flex justify-center mb-3 sm:mb-4 text-gray-800">
      <h3 className="font-bold text-[16px] sm:text-[18px]">{title}</h3>
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-brown-700 text-sand-350 rounded-lg px-4 sm:px-5 py-1.5 sm:py-1 text-[12px] sm:text-[13px] font-bold border border-brown-700 shadow-md hover:bg-brown-800 transition-colors tracking-wide"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default ReviewHeader;
