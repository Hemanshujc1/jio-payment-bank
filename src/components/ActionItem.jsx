import React from 'react';

const ActionItem = ({ img, label, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center gap-2 cursor-pointer group w-24 bg-transparent border-none p-0 m-0"
    >
      <div className="w-17.5 h-17.5 rounded-full bg-linear-to-b from-primary to-primary-dark flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
        <img src={img} alt="" />
      </div>
      <span className="text-[15px] text-center text-sand-900 leading-tight">
        {label}
      </span>
    </button>
  );
};

export default ActionItem;
