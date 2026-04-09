import React from 'react';

const ReviewRow = ({ label, value, labelWidth = "sm:w-32", className = "" }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${className}`}>
      <span className={`font-bold text-[14.5px] shrink-0 text-gray-700 ${labelWidth}`}>
        {label}:
      </span>
      <span className="text-[14.5px] font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
};

export default ReviewRow;
