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
      className={`bg-sand-500 text-sand-350 border border-brown-700 font-extrabold text-[22px] py-1 px-12 rounded-3xl shadow-md hover:bg-brown-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wider flex items-center justify-center ${className}`}
    >
      {text}
    </button>
  );
};

export default ProceedButton;
