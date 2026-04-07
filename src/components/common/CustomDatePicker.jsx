import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { parseDate } from "../../utils/validationUtils";
import { differenceInYears } from "date-fns";

const CustomDatePicker = ({ name, maxDate}) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const value = watch(name);

  const getError = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const error = getError(errors, name);

 


  // Convert DD/MM/YYYY to YYYY-MM-DD for native input
  const toNativeDate = (val) => {
    if (!val) return "";
    const parts = val.split("/");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY for form state
  const fromNativeDate = (val) => {
    if (!val) return "";
    const parts = val.split("-");
    if (parts.length !== 3) return "";
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const maxDateStr = maxDate ? toNativeDate(
    `${String(maxDate.getDate()).padStart(2, '0')}/${String(maxDate.getMonth() + 1).padStart(2, '0')}/${maxDate.getFullYear()}`
  ) : undefined;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className={`flex bg-white rounded-md px-3 py-1.5 border ${error ? 'border-red-500' : 'border-neutral-light/50'} items-center justify-between min-h-10 transition-colors focus-within:border-gray-400`}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              type="date"
              value={toNativeDate(value)}
              onChange={(e) => onChange(fromNativeDate(e.target.value))}
              onBlur={onBlur}
              max={maxDateStr}
              className="bg-transparent focus:outline-none w-full text-[14px] font-medium placeholder-neutral-400 appearance-none"
            />
          )}
        />
      </div>
      {error && <span className="text-red-500 text-[12px]">{error.message}</span>}
    </div>
  );
};

export default CustomDatePicker;
