import React from "react";

interface FormFieldRadioButtonProps {
  name: string;
  value: "required" | "optional" | "disabled";
  checked: boolean;
  onChange: () => void;
}

export const FormFieldRadioButton: React.FC<FormFieldRadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
}) => {
  return (
    <div className="flex justify-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
      />
    </div>
  );
};
