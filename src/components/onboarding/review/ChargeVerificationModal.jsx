import React from 'react';
import ProceedButton from '../../common/ProceedButton';

const ChargeVerificationModal = ({ isOpen, onClose, onProceed, chargeCollected, setChargeCollected }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 md:p-8 flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors font-bold text-lg p-2"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <h2 className="font-bold text-[20px] md:text-[22px] tracking-wide text-center mt-2">
          Account Opening Charge
        </h2>

        <div className="bg-blue-50 border border-blue-200 p-5 md:p-6 rounded-lg w-full">
          <p className="text-[14px] md:text-[15px] font-semibold text-blue-900 leading-relaxed">
          Please proceed with collecting [Rs. 100/400] from the customer for the account opening charges.
          </p>
        </div>

        <div className="flex items-start gap-3 w-full px-1">
          <input
            type="checkbox"
            id="charge-agree"
            checked={chargeCollected}
            onChange={(e) => setChargeCollected(e.target.checked)}
            className="w-5 h-5 cursor-pointer rounded-sm mt-1 accent-black shrink-0"
          />
          <label 
            htmlFor="charge-agree"
            className="text-[14px] md:text-[14.5px] text-gray-800 font-medium leading-relaxed cursor-pointer"
          >
            I confirm that I have collected the specified account opening charges from the customer. I understand and agree that this amount will be deducted from my Vakrangee wallet.
          </label>
        </div>

        <div className="flex justify-center w-full mt-1">
          <ProceedButton
            onClick={onProceed}
            disabled={!chargeCollected}
            className="w-full sm:w-auto min-w-37.5"
          />
        </div>
      </div>
    </div>
  );
};

export default ChargeVerificationModal;
