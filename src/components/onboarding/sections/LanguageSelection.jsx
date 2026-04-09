import React from "react";

const LanguageSelection = ({ language, setLanguage, languages }) => {
  return (
    <>
      <h2 className="font-bold text-[17px] sm:text-[19px] mb-4 sm:mb-5 tracking-tight mt-6 text-gray-800">
        Choose any alternative language to view the translation:
      </h2>
      <div className="flex flex-wrap gap-4 sm:gap-x-6 sm:gap-y-5 mb-10 sm:mb-16 max-w-4xl">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`flex-1 min-w-30 sm:flex-none sm:w-37.5 py-2 sm:py-1.5 rounded-full font-bold border transition-all shadow-sm text-[14px] sm:text-[15px] ${
              language === lang
                ? "bg-sand-500 text-sand-350 border-brown-700"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </>
  );
};

export default LanguageSelection;
