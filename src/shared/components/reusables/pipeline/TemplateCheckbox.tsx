import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { cn } from "@/lib/utils";

interface TemplateCheckboxProps {
  isTemplate: boolean;
  templateName: string | null | undefined;
  isUsingTemplateFile: boolean;
  onTemplateChange: (checked: boolean) => void;
  onNameChange: (name: string) => void;
}

export function TemplateCheckbox({
  isTemplate,
  templateName,
  isUsingTemplateFile,
  onTemplateChange,
  onNameChange,
}: TemplateCheckboxProps) {
  return (
    <FieldGroup className="pb-4">
      <Field orientation="horizontal" className="items-center gap-3">
        <Checkbox
          id="is-template"
          checked={isTemplate}
          onCheckedChange={onTemplateChange}
          disabled={isUsingTemplateFile}
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <FieldLabel
          htmlFor="is-template"
          className={cn(
            "text-sm font-medium text-gray-700",
            isUsingTemplateFile
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          )}
        >
          Save as Template
        </FieldLabel>
      </Field>

      {isTemplate && (
        <Field>
          <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
            Template Name
          </FieldLabel>
          <Input
            type="text"
            placeholder="Enter template name"
            value={templateName || ""}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full"
          />
        </Field>
      )}
    </FieldGroup>
  );
}
