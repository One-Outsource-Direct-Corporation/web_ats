import type {
  ApplicationForm,
  ApplicationFormType,
} from "../../../shared/types/application_form.types";

interface FormFieldRadioButtonProps {
  name: keyof ApplicationForm;
  value: ApplicationFormType;
  checked: boolean;
  onChange: (
    fieldName: keyof ApplicationForm,
    status: ApplicationFormType
  ) => void;
}

export const FormFieldRadioButton = ({
  name,
  value,
  checked,
  onChange,
}: FormFieldRadioButtonProps) => {
  return (
    <div className="flex justify-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(name, value)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
      />
    </div>
  );
};

FormFieldRadioButton.displayName = "FormFieldRadioButton";
