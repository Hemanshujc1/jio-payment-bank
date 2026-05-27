import React from "react";

const LanguageSelection = ({
  language,
  setLanguage,
  languages,
}) => {
  return (
    <div>
      <h2 className="font-bold text-[17px] sm:text-[18px] mb-4 text-gray-800">
        Choose any alternative language to view the translation:
      </h2>

      <div className="flex flex-wrap gap-3">
        {languages.map((lang) => {
          const langName =
            typeof lang === "object" ? lang.name : lang;

          const isActive = language === langName;

          return (
            <button
              key={langName}
              type="button"
              onClick={() => setLanguage(langName)}
              className={`px-5 py-2 rounded-full border font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#4E342E] text-white border-[#4E342E]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#4E342E]"
              }`}
            >
              {langName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelection;