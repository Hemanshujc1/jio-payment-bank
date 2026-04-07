import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const AadhaarAddressSection = ({ mockAadhaarAddress }) => {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const sameAsAadhaar = watch("applicant.sameAsAadhaar");

    useEffect(() => {
        if (sameAsAadhaar && mockAadhaarAddress) {
            setValue("applicant.communicationAddress.houseNo", mockAadhaarAddress.houseNo);
            setValue("applicant.communicationAddress.building", mockAadhaarAddress.building);
            setValue("applicant.communicationAddress.street", mockAadhaarAddress.street);
            setValue("applicant.communicationAddress.city", mockAadhaarAddress.city);
            setValue("applicant.communicationAddress.state", mockAadhaarAddress.state);
            setValue("applicant.communicationAddress.pincode", mockAadhaarAddress.pincode);
        }
    }, [sameAsAadhaar, mockAadhaarAddress, setValue]);

    return (
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
                {/* House/Flat No */}
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px]">House/Flat No<span className="text-red-500">*</span>: </span>
                    <input
                        {...register("applicant.communicationAddress.houseNo")}
                        className={`bg-white rounded-md px-3 py-1.5 border ${
                            errors.applicant?.communicationAddress?.houseNo ? "border-red-500" : "border-neutral-light/50"
                        } focus:outline-none text-[14px]`}
                        placeholder="House/Flat No"
                    />
                </div>

                {/* Building Name */}
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px]">Building Name<span className="text-red-500">*</span>: </span>
                    <input
                        {...register("applicant.communicationAddress.building")}
                        className={`bg-white rounded-md px-3 py-1.5 border ${
                            errors.applicant?.communicationAddress?.building ? "border-red-500" : "border-neutral-light/50"
                        } focus:outline-none text-[14px]`}
                        placeholder="Building Name"
                    />
                </div>

                {/* Street/Area */}
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px]">Street/Area<span className="text-red-500">*</span>: </span>
                    <input
                        {...register("applicant.communicationAddress.street")}
                        className={`bg-white rounded-md px-3 py-1.5 border ${
                            errors.applicant?.communicationAddress?.street ? "border-red-500" : "border-neutral-light/50"
                        } focus:outline-none text-[14px]`}
                        placeholder="Street/Area"
                    />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px]">City<span className="text-red-500">*</span>: </span>
                    <input
                        {...register("applicant.communicationAddress.city")}
                        className={`bg-white rounded-md px-3 py-1.5 border ${
                            errors.applicant?.communicationAddress?.city ? "border-red-500" : "border-neutral-light/50"
                        } focus:outline-none text-[14px]`}
                        placeholder="City"
                    />
                </div>

                {/* State */}
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px]">State<span className="text-red-500">*</span>: </span>
                    <input
                        {...register("applicant.communicationAddress.state")}
                        className={`bg-white rounded-md px-3 py-1.5 border ${
                            errors.applicant?.communicationAddress?.state ? "border-red-500" : "border-neutral-light/50"
                        } focus:outline-none text-[14px]`}
                        placeholder="State"
                    />
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px]">Pincode<span className="text-red-500">*</span>: </span>
                    <input
                        {...register("applicant.communicationAddress.pincode")}
                        maxLength={6}
                        className={`bg-white rounded-md px-3 py-2 border ${
                            errors.applicant?.communicationAddress?.pincode ? "border-red-500" : "border-neutral-light/50"
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
    );
};

export default AadhaarAddressSection;
