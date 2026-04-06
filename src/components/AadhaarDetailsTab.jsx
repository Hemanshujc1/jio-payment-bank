import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import ProceedButton from "./ProceedButton";
import CustomDatePicker from "./onboarding/CustomDatePicker";

const AadhaarDetailsTab = ({ onNext }) => {
  const MOCK_AADHAAR_ADDRESS = {
    houseNo: "A/1001",
    building: "XYZ Buliding",
    street: "150 Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400013",
  };

  const {
    register,
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useFormContext();
  const [showEmail, setShowEmail] = useState(true);
  const sameAsAadhaar = watch("applicant.sameAsAadhaar");

  React.useEffect(() => {
    if (sameAsAadhaar) {
      setValue("applicant.communicationAddress.houseNo", MOCK_AADHAAR_ADDRESS.houseNo);
      setValue("applicant.communicationAddress.building", MOCK_AADHAAR_ADDRESS.building);
      setValue("applicant.communicationAddress.street", MOCK_AADHAAR_ADDRESS.street);
      setValue("applicant.communicationAddress.city", MOCK_AADHAAR_ADDRESS.city);
      setValue("applicant.communicationAddress.state", MOCK_AADHAAR_ADDRESS.state);
      setValue("applicant.communicationAddress.pincode", MOCK_AADHAAR_ADDRESS.pincode);
    }
  }, [sameAsAadhaar, setValue]);

  const handleProceed = async () => {
    const isValid = await trigger([
      "applicant.firstName",
      "applicant.middleName",
      "applicant.lastName",
      "applicant.gender",
      "applicant.dob",
      "applicant.email",
      "applicant.communicationAddress",
    ]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="w-full flex flex-col px-4 md:px-8 py-8 items-center text-black font-sans">
      <h2 className="font-bold text-2xl tracking-wide mb-10 text-center">
        Details as per Aadhaar
      </h2>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-center items-start w-full max-w-5xl mx-auto mb-10">
        <div className="w-35 h-48 md:w-46 md:h-56 shrink-0">
          <img
            src="/jpb/2.jpeg"
            alt="user img"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-6 w-full text-[15px] pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">First Name<span className="text-red-500">*</span>: </span>
              <input
                {...register("applicant.firstName")}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  errors.applicant?.firstName
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="First Name"
              />
              {errors.applicant?.firstName && (
                <span className="text-red-500 text-[12px] font-medium">
                  {errors.applicant.firstName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">
                Middle Name (Optional):{" "}
              </span>
              <input
                {...register("applicant.middleName")}
                className={`bg-white rounded-md px-3 py-1.5 border ${
                  errors.applicant?.middleName
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Middle Name"
              />
              {errors.applicant?.middleName && (
                <span className="text-red-500 text-[12px] font-medium">
                  {errors.applicant.middleName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">Last Name<span className="text-red-500">*</span>: </span>
              <input
                {...register("applicant.lastName")}
                className={`bg-white rounded-md px-3 py-2 border ${
                  errors.applicant?.lastName
                    ? "border-red-500"
                    : "border-neutral-light/50"
                } focus:outline-none text-[14px]`}
                placeholder="Last Name"
              />
              {errors.applicant?.lastName && (
                <span className="text-red-500 text-[12px] font-medium">
                  {errors.applicant.lastName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">Gender<span className="text-red-500">*</span>: </span>
              <select
                {...register("applicant.gender")}
                className="bg-white rounded-md px-3 py-2 border border-neutral-light/50 focus:outline-none text-[14px]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">Date of Birth<span className="text-red-500">*</span>: </span>
              <CustomDatePicker 
                name="applicant.dob" 
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))} 
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[14px]">Email ID: </span>
              <div className="flex flex-col gap-1">
                <div
                  className={`bg-white rounded-md flex items-center px-3 py-2 shadow-sm border ${
                    errors.applicant?.email
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  }`}
                >
                  <input
                    type={showEmail ? "email" : "password"}
                    {...register("applicant.email")}
                    placeholder="xxxxxxx@mail.com"
                    className="grow outline-none bg-transparent placeholder-neutral-400 text-[14px] text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmail(!showEmail)}
                    className="text-black transition-colors rounded-full hover:bg-neutral-light/50 ml-1"
                  >
                    {showEmail ? (
                      <IoIosEye size={18} />
                    ) : (
                      <IoIosEyeOff size={18} />
                    )}
                  </button>
                </div>
                {errors.applicant?.email && (
                  <span className="text-red-500 text-[13px] font-medium">
                    {errors.applicant.email.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Aadhaar Address Preview */}
          <div className="mt-8">
            <h3 className="font-bold text-[16px] text-gray-900 mb-3">Aadhaar Address</h3>
            <div className="text-[14px] leading-relaxed">
              {MOCK_AADHAAR_ADDRESS.houseNo}, {MOCK_AADHAAR_ADDRESS.building}, {MOCK_AADHAAR_ADDRESS.street}, {MOCK_AADHAAR_ADDRESS.city}, {MOCK_AADHAAR_ADDRESS.state} - {MOCK_AADHAAR_ADDRESS.pincode}
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-light/30 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-bold text-[16px] text-gray-900">Communication Address</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("applicant.sameAsAadhaar")}
                  className="w-5 h-5 border-2 border-[#D1A054] accent-black cursor-pointer rounded-sm"
                />
                <span className="text-[14px] font-medium text-gray-700">
                  Same as Aadhaar Address
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">
                  House/Flat No<span className="text-red-500">*</span>:{" "}
                </span>
                <input
                  {...register("applicant.communicationAddress.houseNo")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.applicant?.communicationAddress?.houseNo
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  } focus:outline-none text-[14px]`}
                  placeholder="House/Flat No"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">
                  Building Name<span className="text-red-500">*</span>:{" "}
                </span>
                <input
                  {...register("applicant.communicationAddress.building")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.applicant?.communicationAddress?.building
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  } focus:outline-none text-[14px]`}
                  placeholder="Building Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">
                  Street/Area<span className="text-red-500">*</span>:{" "}
                </span>
                <input
                  {...register("applicant.communicationAddress.street")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.applicant?.communicationAddress?.street
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  } focus:outline-none text-[14px]`}
                  placeholder="Street/Area"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">
                  City<span className="text-red-500">*</span>:{" "}
                </span>
                <input
                  {...register("applicant.communicationAddress.city")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.applicant?.communicationAddress?.city
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  } focus:outline-none text-[14px]`}
                  placeholder="City"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">
                  State<span className="text-red-500">*</span>:{" "}
                </span>
                <input
                  {...register("applicant.communicationAddress.state")}
                  className={`bg-white rounded-md px-3 py-1.5 border ${
                    errors.applicant?.communicationAddress?.state
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  } focus:outline-none text-[14px]`}
                  placeholder="State"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">
                  Pincode<span className="text-red-500">*</span>:{" "}
                </span>
                <input
                  {...register("applicant.communicationAddress.pincode")}
                  maxLength={6}
                  className={`bg-white rounded-md px-3 py-2 border ${
                    errors.applicant?.communicationAddress?.pincode
                      ? "border-red-500"
                      : "border-neutral-light/50"
                  } focus:outline-none text-[14px]`}
                  placeholder="6-digit Pincode"
                />
              </div>
            </div>

            {(errors.applicant?.communicationAddress?.houseNo ||
              errors.applicant?.communicationAddress?.street ||
              errors.applicant?.communicationAddress?.city ||
              errors.applicant?.communicationAddress?.state ||
              errors.applicant?.communicationAddress?.pincode) && (
              <span className="text-red-500 text-[12px] font-medium block mt-4">
                Please fill all mandatory communication address fields.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10 mt-12 pt-2">
        <ProceedButton onClick={handleProceed} className="w-47.5" />
      </div>
    </div>
  );
};

export default AadhaarDetailsTab;
