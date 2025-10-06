import React from "react";
import { Field, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { FormFieldRadioButton } from "./FormFieldRadioButton";
import type { FieldConfig } from "../../../constants/formFieldsConfig";
import type { CreatePositionFormData } from "../../../types/createPosition";

interface FormFieldsTableProps {
  title: string;
  fields: FieldConfig[];
  formData: CreatePositionFormData;
  onFieldStatusChange: (
    fieldKey: string,
    status: "required" | "optional" | "disabled"
  ) => void;
}

export const FormFieldsTable: React.FC<FormFieldsTableProps> = ({
  title,
  fields,
  formData,
  onFieldStatusChange,
}) => {
  return (
    <FieldSet className="mt-10">
      <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </FieldLegend>
      <Field className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-100">
            <TableRow>
              <TableHead className="w-[20rem] p-4">Field</TableHead>
              <TableHead className="text-center p-4">Required</TableHead>
              <TableHead className="text-center p-4">Optional</TableHead>
              <TableHead className="text-center p-4">Disabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => {
              const currentStatus =
                formData.application_form?.[field.formDataKey] ||
                field.defaultStatus;
              return (
                <TableRow key={field.formDataKey}>
                  <TableCell className="font-medium p-4">
                    {field.displayName}
                  </TableCell>
                  <TableCell className="text-center p-4">
                    <FormFieldRadioButton
                      name={field.formDataKey}
                      value="required"
                      checked={currentStatus === "required"}
                      onChange={() =>
                        onFieldStatusChange(field.formDataKey, "required")
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center p-4">
                    <FormFieldRadioButton
                      name={field.formDataKey}
                      value="optional"
                      checked={currentStatus === "optional"}
                      onChange={() =>
                        onFieldStatusChange(field.formDataKey, "optional")
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center p-4">
                    <FormFieldRadioButton
                      name={field.formDataKey}
                      value="disabled"
                      checked={currentStatus === "disabled"}
                      onChange={() =>
                        onFieldStatusChange(field.formDataKey, "disabled")
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Field>
    </FieldSet>
  );
};
