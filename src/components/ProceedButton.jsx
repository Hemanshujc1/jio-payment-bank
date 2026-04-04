import React from 'react';

const ProceedButton = ({ 
  text = "PROCEED", 
  onClick, 
  disabled = false, 
  width, 
  className = "" 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      style={{ width: width }}
      className={`bg-sand-500 text-[#EBC080] border border-[#493118] font-extrabold text-[22px] py-2.5 px-12 rounded-3xl shadow-md hover:bg-[#5a4221] transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wider flex items-center justify-center ${className}`}
    >
      {text}
    </button>
  );
};

export default ProceedButton;
