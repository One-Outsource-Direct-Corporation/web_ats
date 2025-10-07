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
import type {
  CreatePositionFormData,
  FormFields,
} from "@/features/positions/types/createPosition";
import { memo } from "react";

interface ApplicationFormManagementProps {
  formData: CreatePositionFormData;
  setFormData: (fieldName: string, status: string) => void;
}

type FieldKey = keyof FormFields;
const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Name",
  birth_date: "Birth Date",
  gender: "Gender",
  primary_contact_number: "Primary Contact Number",
  secondary_contact_number: "Secondary Contact Number",
  email: "Email",
  linkedin_profile: "LinkedIn Profile",
  address: "Address",
  expect_salary: "Expected Salary",
  willing_to_work_onsite: "Willing to Work Onsite",
  photo_2x2: "Photo 2x2",
  upload_med_cert: "Upload Medical Certificate",
  preferred_interview_schedule: "Preferred Interview Schedule",
  education_attained: "Education Attained",
  year_graduated: "Year Graduated",
  university: "University",
  course: "Course",
  work_experience: "Work Experience",
  how_did_you_hear_about_us: "How Did You Hear About Us",
  agreement: "Agreement",
  signature: "Signature",
};

const PERSONAL_INFO_FIELDS: FieldKey[] = [
  "name",
  "birth_date",
  "gender",
  "primary_contact_number",
  "secondary_contact_number",
  "email",
  "linkedin_profile",
  "address",
  "expect_salary",
  "willing_to_work_onsite",
  "photo_2x2",
  "upload_med_cert",
  "preferred_interview_schedule",
];

const EDUCATION_FIELDS: FieldKey[] = [
  "education_attained",
  "year_graduated",
  "university",
  "course",
];

const OTHER_FIELDS: FieldKey[] = [
  "work_experience",
  "how_did_you_hear_about_us",
  "agreement",
  "signature",
];

const FieldRow = memo(
  ({
    fieldKey,
    label,
    fieldValue,
    setFormData,
  }: {
    fieldKey: FieldKey;
    label: string;
    fieldValue: string;
    setFormData: (fieldName: string, status: string) => void;
  }) => {
    return (
      <TableRow>
        <TableCell className="font-medium p-4">{label}</TableCell>
        <TableCell>
          <FormFieldRadioButton
            name={fieldKey}
            value="required"
            checked={fieldValue === "required"}
            onChange={setFormData}
          />
        </TableCell>
        <TableCell>
          <FormFieldRadioButton
            name={fieldKey}
            value="optional"
            checked={fieldValue === "optional"}
            onChange={setFormData}
          />
        </TableCell>
        <TableCell>
          <FormFieldRadioButton
            name={fieldKey}
            value="disabled"
            checked={fieldValue === "disabled"}
            onChange={setFormData}
          />
        </TableCell>
      </TableRow>
    );
  }
);

FieldRow.displayName = "FieldRow";

export const ApplicationFormManagement = memo(
  ({ formData, setFormData }: ApplicationFormManagementProps) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Application Form
          </h3>
          <p className="text-sm text-gray-600">
            Choose what information to collect from candidates who apply through
            your Careers Site.
          </p>
        </div>

        {/* Personal Information Section */}
        <FieldSet>
          <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
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
                {PERSONAL_INFO_FIELDS.map((fieldKey) => (
                  <FieldRow
                    key={fieldKey}
                    fieldKey={fieldKey}
                    label={FIELD_LABELS[fieldKey]}
                    fieldValue={formData.application_form[fieldKey]}
                    setFormData={setFormData}
                  />
                ))}
              </TableBody>
            </Table>
          </Field>
        </FieldSet>

        {/* Education Section */}
        <FieldSet>
          <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
            Education
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
                {EDUCATION_FIELDS.map((fieldKey) => (
                  <FieldRow
                    key={fieldKey}
                    fieldKey={fieldKey}
                    label={FIELD_LABELS[fieldKey]}
                    fieldValue={formData.application_form[fieldKey]}
                    setFormData={setFormData}
                  />
                ))}
              </TableBody>
            </Table>
          </Field>
        </FieldSet>

        {/* Other Information Section */}
        <FieldSet>
          <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
            Other Information
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
                {OTHER_FIELDS.map((fieldKey) => (
                  <FieldRow
                    key={fieldKey}
                    fieldKey={fieldKey}
                    label={FIELD_LABELS[fieldKey]}
                    fieldValue={formData.application_form[fieldKey]}
                    setFormData={setFormData}
                  />
                ))}
              </TableBody>
            </Table>
          </Field>
        </FieldSet>
      </div>
    );
  }
);

ApplicationFormManagement.displayName = "ApplicationFormManagement";
