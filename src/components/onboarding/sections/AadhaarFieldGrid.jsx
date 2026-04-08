import React from "react";
import { useFormContext } from "react-hook-form";
import CustomDatePicker from "../../common/CustomDatePicker";

const AadhaarFieldGrid = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* First Name */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">First Name<span className="text-red-500">*</span>: </span>
                <input
                    {...register("applicant.firstName")}
                    disabled
                    className={`bg-gray-100 text-gray-600 rounded-md px-3 py-2 border cursor-not-allowed ${
                        errors.applicant?.firstName ? "border-red-500" : "border-neutral-light/50"
                    } focus:outline-none text-[14px]`}
                    placeholder="First Name"
                />
                {errors.applicant?.firstName && (
                    <span className="text-red-500 text-[12px] font-medium">
                        {errors.applicant.firstName.message}
                    </span>
                )}
            </div>

            {/* Middle Name */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Middle Name (Optional): </span>
                <input
                    {...register("applicant.middleName")}
                    disabled
                    className={`bg-gray-100 text-gray-600 rounded-md px-3 py-2 border cursor-not-allowed ${
                        errors.applicant?.middleName ? "border-red-500" : "border-neutral-light/50"
                    } focus:outline-none text-[14px]`}
                    placeholder="Middle Name"
                />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Last Name<span className="text-red-500">*</span>: </span>
                <input
                    {...register("applicant.lastName")}
                    disabled
                    className={`bg-gray-100 text-gray-600 rounded-md px-3 py-2 border cursor-not-allowed ${
                        errors.applicant?.lastName ? "border-red-500" : "border-neutral-light/50"
                    } focus:outline-none text-[14px]`}
                    placeholder="Last Name"
                />
                {errors.applicant?.lastName && (
                    <span className="text-red-500 text-[12px] font-medium">
                        {errors.applicant.lastName.message}
                    </span>
                )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Gender<span className="text-red-500">*</span>: </span>
                <select
                    {...register("applicant.gender")}
                    disabled
                    className="bg-gray-100 text-gray-600 rounded-md px-3 py-2.5 border border-neutral-light/50 cursor-not-allowed focus:outline-none text-[14px]"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Date of Birth<span className="text-red-500">*</span>: </span>
                <CustomDatePicker
                    name="applicant.dob"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                    disabled={true}
                />
            </div>
        </div>
    );
};

export default AadhaarFieldGrid;
