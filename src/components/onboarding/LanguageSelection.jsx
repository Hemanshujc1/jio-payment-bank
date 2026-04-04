import React from "react";

const LanguageSelection = ({ language, setLanguage, languages }) => {
  return (
    <>
      <h2 className="font-semibold text-[19px] mb-5 tracking-tight mt-6">
        Choose any alternative language to view the translation:
      </h2>
      <div className="flex flex-wrap gap-x-6 lg:gap-x-12 gap-y-5 mb-16 max-w-4xl">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`w-32.5 lg:w-37.5 py-1.5 rounded-[20px] font-semibold border transition-colors shadow-sm ${
              language === lang
                ? "bg-primary border-transparent"
                : "bg-transparent border-black"
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
