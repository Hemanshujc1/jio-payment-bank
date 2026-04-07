import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import CustomDatePicker from "../../common/CustomDatePicker";

const AadhaarFieldGrid = () => {
    const { register, formState: { errors } } = useFormContext();
    const [showEmail, setShowEmail] = useState(true);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {/* First Name */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">First Name<span className="text-red-500">*</span>: </span>
                <input
                    {...register("applicant.firstName")}
                    className={`bg-white rounded-md px-3 py-1.5 border ${
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
                    className={`bg-white rounded-md px-3 py-1.5 border ${
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
                    className={`bg-white rounded-md px-3 py-2 border ${
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
                    className="bg-white rounded-md px-3 py-2 border border-neutral-light/50 focus:outline-none text-[14px]"
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
                />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-[14px]">Email ID: </span>
                <div className="flex flex-col gap-1">
                    <div className={`bg-white rounded-md flex items-center px-3 py-2 shadow-sm border ${
                        errors.applicant?.email ? "border-red-500" : "border-neutral-light/50"
                    }`}>
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
                            {showEmail ? <IoIosEye size={18} /> : <IoIosEyeOff size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AadhaarFieldGrid;
