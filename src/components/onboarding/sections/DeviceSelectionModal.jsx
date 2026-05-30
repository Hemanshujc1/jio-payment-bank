import React from "react";
import { FaFingerprint } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const DeviceSelectionModal = ({ showDeviceModal, setShowDeviceModal, onSelectDevice }) => {
  if (!showDeviceModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Select Biometric Device
          </h2>

          <button
            onClick={() => setShowDeviceModal(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="space-y-4">
          {/* MANTRA */}
          <div
            onClick={() => onSelectDevice("MANTRA")}
            className="cursor-pointer p-4 border rounded-xl hover:bg-red-50 hover:border-red-400 transition-all flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">Mantra Device</p>
              <p className="text-sm text-gray-500">
                Recommended for faster capture
              </p>
            </div>
            <FaFingerprint className="text-red-500 text-xl" />
          </div>

          {/* MORPHO */}
          <div
            onClick={() => onSelectDevice("MORPHO")}
            className="cursor-pointer p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">Morpho Device</p>
              <p className="text-sm text-gray-500">
                Secure biometric authentication
              </p>
            </div>
            <FaFingerprint className="text-blue-500 text-xl" />
          </div>

          {/* STARTEK */}
          <div
            onClick={() => onSelectDevice("STARTEK")}
            className="cursor-pointer p-4 border rounded-xl hover:bg-green-50 hover:border-green-400 transition-all flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">Startek Device</p>
              <p className="text-sm text-gray-500">
                UIDAI compatible fingerprint scanner
              </p>
            </div>
            <FaFingerprint className="text-green-600 text-xl" />
          </div>
        </div>

        {/* CANCEL */}
        <button
          onClick={() => setShowDeviceModal(false)}
          className="mt-6 w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeviceSelectionModal;
