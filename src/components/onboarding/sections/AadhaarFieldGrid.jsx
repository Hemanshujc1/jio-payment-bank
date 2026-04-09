import React from "react";
import { useFormContext } from "react-hook-form";
import CustomDatePicker from "../../common/CustomDatePicker";

const AadhaarFieldGrid = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">First Name<span className="text-red-500">*</span></span>
                <input
                    {...register("applicant.firstName")}
                    disabled
                    className={`bg-gray-100 text-gray-500 rounded-xl px-4 py-3 border cursor-not-allowed ${
                        errors.applicant?.firstName ? "border-red-500" : "border-neutral-light/50"
                    } focus:outline-none text-[14px] font-medium shadow-sm`}
                    placeholder="First Name"
                />
                {errors.applicant?.firstName && (
                    <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                        {errors.applicant.firstName.message}
                    </span>
                )}
            </div>

            {/* Middle Name */}
            <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">Middle Name (Optional)</span>
                <input
                    {...register("applicant.middleName")}
                    disabled
                    className={`bg-gray-100 text-gray-500 rounded-xl px-4 py-3 border cursor-not-allowed ${
                        errors.applicant?.middleName ? "border-red-500" : "border-neutral-light/50"
                    } focus:outline-none text-[14px] font-medium shadow-sm`}
                    placeholder="Middle Name"
                />
                {errors.applicant?.middleName && (
                    <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                        {errors.applicant.middleName.message}
                    </span>
                )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">Last Name<span className="text-red-500">*</span></span>
                <input
                    {...register("applicant.lastName")}
                    disabled
                    className={`bg-gray-100 text-gray-500 rounded-xl px-4 py-3 border cursor-not-allowed ${
                        errors.applicant?.lastName ? "border-red-500" : "border-neutral-light/50"
                    } focus:outline-none text-[14px] font-medium shadow-sm`}
                    placeholder="Last Name"
                />
                {errors.applicant?.lastName && (
                    <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">
                        {errors.applicant.lastName.message}
                    </span>
                )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">Gender<span className="text-red-500">*</span></span>
                <select
                    {...register("applicant.gender")}
                    disabled
                    className="bg-gray-100 text-gray-500 rounded-xl px-4 py-3 border border-neutral-light/50 cursor-not-allowed focus:outline-none text-[14px] font-medium shadow-sm appearance-none"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[13px] sm:text-[14px] text-gray-700 ml-0.5">Date of Birth<span className="text-red-500">*</span></span>
                <div className="relative">
                  <CustomDatePicker
                      name="applicant.dob"
                      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                      disabled={true}
                  />
                  <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
                </div>
            </div>
        </div>
    );
};

export default AadhaarFieldGrid;
