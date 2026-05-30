import React from "react";

const DeviceErrorModal = ({ rdError, setRdError, onRetry }) => {
  if (!rdError.show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-sm p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
        </div>

        <p className="text-center text-gray-800 font-semibold text-[15px] mb-4">
          {rdError.message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setRdError({ show: false, message: "" })}
            className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            Close
          </button>

          <button
            onClick={() => {
              setRdError({ show: false, message: "" });
              if (onRetry) onRetry();
            }}
            className="flex-1 py-2 rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceErrorModal;
