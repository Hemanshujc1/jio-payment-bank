import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const CustomDropdown = ({ options, value, onChange, className = "", error = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* Closed State Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white rounded-xl px-4 py-3 border shadow-sm transition-all flex items-center justify-between cursor-pointer focus:outline-none min-h-11.5 grow min-w-35 ${
          error ? 'border-red-500' : 'border-neutral-light focus-within:border-gray-900'
        } ${isOpen ? 'invisible' : 'visible'}`}
      >
        <span className={`${value ? 'text-gray-900' : 'text-gray-400'} font-medium text-[14px] truncate`}>
          {value || "Select Option"}
        </span>
       <IoIosArrowDown className="text-gray-400 text-lg" />
      </div>

      {/* Expanded Menu Popup */}
      {isOpen && (
        <div className="absolute -top-1 md:-top-1.5 -left-1 md:-left-1.5 w-[calc(100%+8px)] md:w-[calc(100%+12px)] bg-[#fdfdfd] rounded-[10px] shadow-2xl border border-gray-200 z-50 flex flex-col animate-in fade-in duration-100">
          
          {/* Header row mirroring the trigger, styled exactly like the mockup */}
          <div 
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-5 pt-4 pb-2 cursor-pointer bg-white rounded-t-[10px]"
          >
            <span className="font-bold text-black text-[14px] tracking-wide">
              {value}
            </span>
           <IoIosArrowDown/>
          </div>

          <div className="px-3 pb-0 max-h-30 overflow-y-auto overscroll-contain scrollbar-hide">
            {options.map((opt, idx) => (
              <div 
                key={idx}
                onClick={() => handleSelect(opt)}
                className={`py-2 cursor-pointer text-[12px] font-semibold tracking-wide text-[#555] hover:text-[#222] transition-colors ${idx !== options.length - 1 ? 'border-b border-[#3e3e3e]' : ''}`}
              >
                {opt}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
