import React from "react";

type DynamicInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string, isFocused?: boolean) => void;
  isFocused: boolean;
  type: string;
};

const DynamicInput: React.FC<DynamicInputProps> = ({
  id,
  label,
  value,
  onChange,
  isFocused,
  type,
}) => {
  const handleFocus = () => {
    onChange(id, value, true);
  };

  const handleBlur = () => {
    onChange(id, value, false);
  };

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-300 urbanist-500 ${
          isFocused || value
            ? "top-[5px] text-white text-sm bg-black px-2 tracking-wider"
            : "top-7 text-white"
        }`}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        className="w-full border border-[#FFFFFF] bg-black rounded-md px-3 py-3 mt-4 text-white focus:outline-none autofill:bg-black autofill:text-white"
      />
    </div>
  );
};

export default DynamicInput;
