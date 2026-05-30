import React from "react";

const DeviceSelector = ({ selectedDevice, onDeviceChange }) => {
  return (
    <div className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col gap-3 shrink-0">
      <label className="font-bold text-[14px] text-gray-800">
        Select Fingerprint Device:
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-[14px] font-medium">
          <input
            type="radio"
            name="device"
            value="mantra"
            checked={selectedDevice === "mantra"}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          Mantra
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[14px] font-medium">
          <input
            type="radio"
            name="device"
            value="morpho"
            checked={selectedDevice === "morpho"}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          Morpho
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[14px] font-medium">
          <input
            type="radio"
            name="device"
            value="startek"
            checked={selectedDevice === "startek"}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          Startek
        </label>
      </div>
    </div>
  );
};

export default DeviceSelector;
