import React from "react";
import LanguageSelection from "./LanguageSelection";
import ConsentsSection from "./ConsentsSection";

const ConsentModal = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  languagesList,
  consentsList,
  selectedConsents,
  setSelectedConsents,
  errors,
  isAllConsentsSelected
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F4E4C1] rounded-3xl border border-[#A67C52]/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 pt-4 pb-4 text-center">
          <h2 className="text-3xl font-extrabold text-[#3E2723]">
            Terms & Conditions
          </h2>
          <p className="text-[#5D4037] text-sm mt-1">
            Please review and accept the terms to proceed.
          </p>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="bg-white rounded-xl p-3 border border-[#B08968]/30 shadow-inner">
            <LanguageSelection
              language={language}
              setLanguage={setLanguage}
              languages={languagesList}
            />
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#B08968]/30 shadow-inner">
            <ConsentsSection
              consents={consentsList}
              selectedConsents={selectedConsents}
              setSelectedConsents={setSelectedConsents}
              errors={errors}
            />
          </div>

          <button
            onClick={onClose}
            disabled={!isAllConsentsSelected}
            className={`w-full py-3 rounded-2xl font-bold text-[16px] transition-all duration-300 ${
              isAllConsentsSelected
                ? "bg-[#4E342E] hover:bg-[#3E2723] text-white"
                : "bg-[#8D6E63]/50 text-white/70 cursor-not-allowed"
            }`}
          >
            I AGREE & CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
