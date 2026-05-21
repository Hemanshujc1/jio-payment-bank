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

      <div className="w-full max-h-62.5 sm:max-h-75 overflow-y-auto pr-2 sm:pr-4 mb-8 border border-gray-200 rounded-lg p-3 sm:p-5 bg-gray-50/50 shadow-inner">
        {consents.map((consentItem, index) => {
          const isSelected = selectedConsents[consentItem.consentTextCode] || false;
          const isMandatory = consentItem.mandatory === "Y";
          const hasError = errors?.consents && isMandatory && !isSelected;
          const isLast = index === consents.length - 1;

          return (
            <div key={consentItem.consentTextCode} className={`flex flex-col gap-4 sm:gap-2 ${isLast ? 'mb-0' : 'mb-6 sm:mb-5'}`}>
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
                <div 
                  className="text-[12.5px] sm:text-[13px] leading-snug sm:leading-tight text-gray-800 max-w-6xl select-none w-full [&_a]:text-blue-600 [&_a]:underline" 
                  onClick={(e) => {
                    if (e.target.tagName.toUpperCase() === 'A') {
                      e.stopPropagation();
                      return;
                    }
                    toggleConsent(consentItem.consentTextCode);
                  }}
                >
                  {consentItem.text1.split(/\\r\\n|\\n|\r\n|\n/).map((line, i, arr) => {
                    // Split the line by the custom pattern so we can render React elements safely
                    const parts = line.split(/(\[\[.*?\|\|.*?\]\])/g);

                    return (
                      <React.Fragment key={i}>
                        {parts.map((part, index) => {
                          const match = part.match(/\[\[(.*?)\|\|(.*?)\]\]/);
                          if (match) {
                            const url = match[1].replace(/['">]/g, '').trim();
                            const text = match[2].trim();
                            return (
                              <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                {text}
                              </a>
                            );
                          }
                          // Return normal text for anything else (any <a> tags will just be plain text)
                          return <React.Fragment key={index}>{part}</React.Fragment>;
                        })}
                        {i !== arr.length - 1 && <br />}
                      </React.Fragment>
                    );
                  })}
                  {isMandatory && <span className="text-red-500 text-lg ml-1">*</span>}
                </div>
              </div>
              {hasError && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-8 sm:ml-9">Please agree to this consent</span>}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ConsentsSection;
