import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const ConsentsSection = ({
  consents,
  selectedConsents,
  setSelectedConsents,
  errors,
}) => {
  const isAllSelected = consents.length > 0 && consents.every(c => selectedConsents[c.consentTextCode]);

  const toggleAllConsents = () => {
    const newState = !isAllSelected;
    const newSelectedConsents = {};
    consents.forEach(c => {
      newSelectedConsents[c.consentTextCode] = newState;
    });
    setSelectedConsents(newSelectedConsents);
  };

  const toggleConsent = (code) => {
    setSelectedConsents(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  if (!consents || consents.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full flex justify-start mb-4">
        <label className="flex items-center gap-3 cursor-pointer mt-2 select-none">
          <div 
            className="cursor-pointer shrink-0"
            onClick={toggleAllConsents}
          >
            <div className={`w-5 h-5 border-2 border-primary flex items-center justify-center`}>
              {isAllSelected && <IoMdCheckmark className="text-black text-lg" />}
            </div>
          </div>
          <span 
            className="font-bold text-[15px] cursor-pointer"
            onClick={toggleAllConsents}
          >
            Select All Consents
          </span>
        </label>
      </div>

      {consents.map((consentItem) => {
        const isSelected = selectedConsents[consentItem.consentTextCode] || false;
        const hasError = errors?.consents && !isSelected;

        return (
          <div key={consentItem.consentTextCode} className="flex flex-col gap-4 sm:gap-2 mb-6 sm:mb-5">
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div 
                className="cursor-pointer shrink-0 mt-0.5 sm:mt-1"
                onClick={() => toggleConsent(consentItem.consentTextCode)}
              >
                <div className={`w-5 h-5 shrink-0 border-2 ${hasError ? 'border-red-500' : 'border-primary'} flex items-center justify-center transition-colors group-hover:border-gray-900`}>
                  {isSelected && <IoMdCheckmark />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  readOnly
                />
              </div>
              <p 
                className="text-[12.5px] sm:text-[13px] leading-snug sm:leading-tight text-gray-800 max-w-6xl select-none" 
                onClick={() => toggleConsent(consentItem.consentTextCode)}
              >
                {consentItem.text1}
              </p>
            </div>
            {hasError && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-8 sm:ml-9">Please agree to this consent</span>}
          </div>
        );
      })}
    </>
  );
};

export default ConsentsSection;
