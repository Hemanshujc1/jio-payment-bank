import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpVerification from "../components/OtpVerification";
import ProceedButton from "../components/ProceedButton";
import mobileicon from "../assets/mobileicon.svg";
import PasswordIcon from "../assets/PasswordIcon.svg";
import { IoEye, IoEyeOff } from "react-icons/io5";

const LoginPage = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (username.trim().length >= 5 && password.length >= 4) {
      setShowOtp(true);
    } else {
      alert("Please enter a valid username and password.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 md:px-0">
      <h2 className="text-[20px] font-bold mb-6 tracking-wide text-center">
        Login
      </h2>

      {/* Username / Mobile Number */}
      <div className="w-full max-w-100 mb-2">
        <label className="block text-[14px] font-semibold mb-1 text-gray-800">
          User Name / Mobile Number
        </label>
        <div className="flex items-center bg-white rounded-lg p-3 w-full shadow-sm border border-gray-100">
          <div className="px-2 shrink-0">
            <img src={mobileicon} alt="mobile icon" />
          </div>
          <input
            type="text"
            placeholder="XXXXXXXXXX"
            maxLength="10"
            className="grow outline-none text-black font-bold bg-transparent tracking-widest text-lg"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Password */}
      <div className="w-full max-w-100 mb-8">
        <label className="block text-[14px] font-semibold mb-1 text-gray-800">
          Password
        </label>
        <div className="flex items-center bg-white rounded-lg p-3 w-full shadow-sm border border-gray-100">
          <div className="px-2 shrink-0">
            <img src={PasswordIcon} alt="Password icon" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="********"
            className="grow outline-none text-black font-bold bg-transparent tracking-widest text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pl-2 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
          >
            {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
          </button>
        </div>
      </div>

      <ProceedButton
        text="Generate OTP"
        onClick={handleLoginClick}
        disabled={username.trim().length < 5 || password.length < 4}
        className="mb-8"
      />
      {showOtp && (
        <OtpVerification
          length={6}
          message="Enter the OTP Code sent to your Registered Mobile Number"
          onComplete={(code) => {
            console.log("OTP Completed:", code);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default LoginPage;
