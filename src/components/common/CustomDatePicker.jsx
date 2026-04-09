import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ name, maxDate, disabled }) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const value = watch(name);

  const getError = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const error = getError(errors, name);

  // Parse "DD/MM/YYYY" to Date
  const parseToDateObj = (str) => {
    if (!str) return null;
    const parts = str.split("/");
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  // Format Date obj to "DD/MM/YYYY"
  const formatDateObj = (dateObj) => {
    if (!dateObj) return "";
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className={`flex ${disabled ? 'bg-gray-100' : 'bg-white'} rounded-xl px-4 py-3 border shadow-sm transition-all focus-within:border-gray-900 ${error ? 'border-red-500' : 'border-neutral-light'} items-center justify-between`}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePicker
            selected={parseToDateObj(value)}
            onChange={(date) => onChange(formatDateObj(date))}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            scrollableYearDropdown
            yearDropdownItemNumber={100} // last 100 years
            onKeyDown={(e) => {
              const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete", "/", "Enter"];
              if (e.metaKey || e.ctrlKey) return;
              if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
            maxLength={10}
            onBlur={onBlur}
            maxDate={maxDate}
            disabled={disabled}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className={`bg-transparent focus:outline-none w-full text-[14px] font-medium placeholder-neutral-400 p-0 ${disabled ? 'text-gray-500 cursor-not-allowed' : ''}`}
            wrapperClassName="w-full flex items-center"
          />
          )}
        />
      </div>
      {error && <span className="text-red-500 text-[11px] sm:text-[12px] font-medium ml-1">{error.message}</span>}
    </div>
  );
};

export default CustomDatePicker;
