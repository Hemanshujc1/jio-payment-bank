import React from "react";

const StepIndicator = ({ currentStep, steps = [] }) => {
  const progress =
    steps.length > 1
      ? ((currentStep - 1) / (steps.length - 1)) * 100
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto mb-10 px-4">
      <div className="relative flex items-center justify-between">

        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-0.75 bg-[#D1A054]/30 -translate-y-1/2 z-0" />

        {/* Progress line */}
        <div
          className="absolute top-6 left-0 h-0.75 bg-[#3A1E08] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

        {steps.map((step) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center z-10">
              
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-sm transition-all duration-300
                ${
                  done
                    ? "bg-[#3A1E08] border-[#3A1E08] text-[#EBC080]"
                    : active
                    ? "bg-[#EBC080] border-[#3A1E08] text-[#3A1E08]"
                    : "bg-white border-[#D1A054]/50 text-[#9b8878]"
                }`}
              >
                {done ? "✓" : step.id}
              </div>

              {/* Label */}
              <span
                className={`mt-1 text-xs font-semibold text-center w-24 leading-tight
                ${
                  active
                    ? "text-[#3A1E08]"
                    : done
                    ? "text-[#3A1E08]/70"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
