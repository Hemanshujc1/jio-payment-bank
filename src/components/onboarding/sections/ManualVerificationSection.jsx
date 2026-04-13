import React from "react";

const ManualVerificationSection = ({ documentStatus, setPanFile }) => {
  if (documentStatus !== "mismatch") return null;

  return (
    <div className="w-full flex flex-col mb-0 -mt-2 px-2 xl:px-0">
      <div className="flex flex-col gap-6 p-6 animate-in zoom-in-95 duration-300 ">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shrink-0 font-bold">
            !
          </div>
          <p className="text-red-700 font-bold text-[15px] pt-1">
            Verification Failed: Details do not match our system records.
            Please manually upload your supporting documents below to
            proceed.
          </p>
        </div>

        <div className="flex flex-col pl-0 md:pl-11 mt-2">
          <div className="flex flex-col gap-3 md:w-1/2">
            <label className="font-bold text-gray-800 text-[14.5px]">
              Upload PAN Document <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && !file.type.startsWith("image/")) {
                    alert("Please select an image file (e.g., JPG, PNG).");
                    e.target.value = ""; // Clear the input
                    setPanFile(null);
                  } else {
                    setPanFile(file || null);
                  }
                }}
                className="block w-fit text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border file:border-brown-700 file:text-[13.5px] file:font-extrabold file:bg-sand-500 file:text-sand-350 hover:file:bg-brown-800 file:cursor-pointer file:transition-colors bg-white rounded-xl border border-gray-200 outline-none focus-within:border-gray-800 p-1.5 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualVerificationSection;
