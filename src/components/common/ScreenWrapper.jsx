import React, { useState, useEffect } from "react";
import jio from "../../assets/jio.svg";
import vakrangeelogo from "../../assets/vakrangee.svg";

const ScreenWrapper = ({ children }) => {
  const [showSplash, setShowSplash] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem("onboarding_splash_shown");

    if (!hasShownSplash) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem("onboarding_splash_shown", "true");
        }, 800);
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showSplash) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`fixed inset-0 z-9999 bg-white flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000 ease-out">
        {/* Logos Container */}
        <div className="flex items-center gap-6 sm:gap-10 mb-12">
          <img 
            src={jio} 
            alt="Jio Logo" 
            className="h-16 sm:h-24 w-auto drop-shadow-sm" 
          />
          <div className="h-12 sm:h-20 w-px bg-gray-200"></div>
          <img 
            src={vakrangeelogo} 
            alt="Vakrangee Logo" 
            className="h-16 sm:h-24 w-auto drop-shadow-sm" 
          />
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 sm:w-64 h-1 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-sand-500 w-1/3 animate-progress origin-left"></div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      {/* <div className="absolute bottom-10 flex flex-col items-center gap-1 opacity-60">
        <p className="text-[10px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest">
          A Joint Initiative
        </p>
      </div> */}

      {/* Tailwind styles for the progress animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.5); }
          100% { transform: translateX(300%) scaleX(0.2); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default ScreenWrapper;
