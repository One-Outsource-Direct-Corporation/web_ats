import { Field, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { FormFieldRadioButton } from "../../../features/positions-client/components/FormFieldRadioButton";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import QuestionnaireBase from "@/features/positions-client/components/questionnaires/QuestionnaireBase";
import { NonNegotiableModal } from "@/features/positions-client/components/NonNegotiableModal";
import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";
import type {
  ApplicationForm,
  ApplicationFormData,
  ApplicationFormType,
  NonNegotiable,
  NonNegotiableBase,
} from "@/shared/types/application_form.types";
import type { ApplicationFormQuestionnaire } from "@/features/positions-client/types/questionnaire.types";

interface ApplicationFormManagementProps {
  applicationFormData: ApplicationFormData;
  applicationFormHandler: (
    field: keyof ApplicationForm,
    value: ApplicationFormType
  ) => void;
  nonNegotiableHandler: (updatedNonNegotiables: NonNegotiable) => void;
  questionnaireHandler: (
    updatedQuestionnaire: ApplicationFormQuestionnaire
  ) => void;
}

type FieldKey = keyof ApplicationForm;

const FIELD_LABELS: { [key in FieldKey]: string } = {
  name: "Name",
  birth_date: "Birth Date",
  gender: "Gender",
  primary_contact_number: "Primary Contact Number",
  secondary_contact_number: "Secondary Contact Number",
  email: "Email",
  linkedin_profile: "LinkedIn Profile",
  address: "Address",
  expected_salary: "Expected Salary",
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
  "expected_salary",
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

const FieldRow = ({
  fieldKey,
  label,
  fieldValue,
  setFormData,
  hasNonNegotiable,
  isNonNegotiable,
  toggleNonNegotiable,
}: {
  fieldKey: FieldKey;
  label: string;
  fieldValue: string;
  setFormData: (
    fieldName: keyof ApplicationForm,
    status: ApplicationFormType
  ) => void;
  hasNonNegotiable?: boolean;
  isNonNegotiable?: (fieldName: string) => boolean;
  toggleNonNegotiable?: (fieldName: string) => void;
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium p-4">{label}</TableCell>
      {hasNonNegotiable ? (
        <TableCell>
          <div className="flex justify-center">
            <Checkbox
              checked={isNonNegotiable?.(fieldKey) || false}
              onCheckedChange={() => toggleNonNegotiable?.(fieldKey)}
              className="cursor-pointer data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 bg-gray-200/50"
            />
          </div>
        </TableCell>
      ) : (
        <TableCell></TableCell>
      )}
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
};

export const ApplicationFormManagement = ({
  applicationFormData,
  applicationFormHandler,
  nonNegotiableHandler,
  questionnaireHandler,
}: ApplicationFormManagementProps) => {
  const nonNegotiableFields = new Set<FieldKey>([
    "expected_salary",
    "willing_to_work_onsite",
    "education_attained",
    "course",
  ]);
  // NOTE: This selectedTemplate will come from database
  // const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [candidateApplicationType, setCandidateApplicationType] =
    useState<string>("external");

  const [showNonNegotiableModal, setShowNonNegotiableModal] = useState(false);

  // Check if a field is marked as non-negotiable
  const isNonNegotiable = (fieldName: string): boolean => {
    return applicationFormData.non_negotiable.non_negotiable.some(
      (nn) => nn.field === fieldName
    );
  };

  // Toggle non-negotiable status for a field
  const toggleNonNegotiable = (fieldName: string) => {
    const currentNonNegotiables =
      applicationFormData.non_negotiable.non_negotiable;
    const isCurrentlyNonNegotiable = isNonNegotiable(fieldName);

    let updatedNonNegotiables: NonNegotiableBase[];

    if (isCurrentlyNonNegotiable) {
      // Remove from non-negotiables
      updatedNonNegotiables = currentNonNegotiables.filter(
        (nn) => nn.field !== fieldName
      );
    } else {
      // Add to non-negotiables with default value
      const newNonNegotiable: NonNegotiableBase = {
        field: fieldName,
        value: "",
      };
      updatedNonNegotiables = [...currentNonNegotiables, newNonNegotiable];
    }

    // Preserve the id if it exists (for NonNegotiableDb)
    const updatedNonNegotiable: NonNegotiable = {
      ...applicationFormData.non_negotiable,
      non_negotiable: updatedNonNegotiables,
    };

    nonNegotiableHandler(updatedNonNegotiable);
  };

  // Update non-negotiable value
  const setNonNegotiableValue = (
    fieldName: string,
    value: string | number | boolean
  ) => {
    const updatedNonNegotiables =
      applicationFormData.non_negotiable.non_negotiable.map((nn) => {
        if (nn.field === fieldName) {
          return {
            ...nn,
            value,
          };
        }
        return nn;
      });

    const updatedNonNegotiable: NonNegotiable = {
      ...applicationFormData.non_negotiable,
      non_negotiable: updatedNonNegotiables,
    };

    nonNegotiableHandler(updatedNonNegotiable);
  };

  const removeNonNegotiable = (fieldName: string) => {
    const updatedNonNegotiables =
      applicationFormData.non_negotiable.non_negotiable.filter(
        (nn) => nn.field !== fieldName
      );
    const updatedNonNegotiable: NonNegotiable = {
      ...applicationFormData.non_negotiable,
      non_negotiable: updatedNonNegotiables,
    };
    nonNegotiableHandler(updatedNonNegotiable);
  };

  const addNonNegotiable = (newNonNegotiable: NonNegotiableBase) => {
    const updatedNonNegotiables = {
      ...applicationFormData.non_negotiable,
      non_negotiable: [
        ...applicationFormData.non_negotiable.non_negotiable,
        newNonNegotiable,
      ],
    };

    nonNegotiableHandler(updatedNonNegotiables);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* Candidate Applications (selectable radio group) */}
          <div className="flex flex-col min-w-[260px] p-2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Candidate Applications
            </h3>
            <span className="text-xs text-gray-600 mb-2">
              Choose how candidates can apply to this position.
            </span>
            <div className="flex flex-col gap-2">
              {/* ShadCN RadioGroup for candidate application type (selectable) */}
              <RadioGroup
                value={candidateApplicationType}
                onValueChange={setCandidateApplicationType}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-3 mb-1">
                  <RadioGroupItem
                    value="external"
                    id="external"
                    className="accent-blue-600"
                  />
                  <label
                    htmlFor="external"
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-blue-700 font-semibold">
                      External Job Posting Platforms
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      (LinkedIn, Jobstreet, etc.)
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="internal" id="internal" className="" />
                  <label
                    htmlFor="internal"
                    className="text-sm cursor-pointer text-gray-400"
                  >
                    Internal Only
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button
            onClick={() => setShowNonNegotiableModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Non-Negotiables
          </Button>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Application Form
          </h3>
          <p className="text-sm text-gray-600">
            Choose what information to collect from candidates who apply through
            your Careers Site.
          </p>
        </div>
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
                <TableHead className="text-center p-4">
                  Non-Negotiable
                </TableHead>
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
                  fieldValue={applicationFormData.application_form[fieldKey]}
                  setFormData={applicationFormHandler}
                  hasNonNegotiable={nonNegotiableFields.has(fieldKey)}
                  isNonNegotiable={isNonNegotiable}
                  toggleNonNegotiable={toggleNonNegotiable}
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
                <TableHead className="text-center p-4">
                  Non-Negotiable
                </TableHead>
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
                  fieldValue={applicationFormData.application_form[fieldKey]}
                  setFormData={applicationFormHandler}
                  hasNonNegotiable={nonNegotiableFields.has(fieldKey)}
                  isNonNegotiable={isNonNegotiable}
                  toggleNonNegotiable={toggleNonNegotiable}
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
                <TableHead className="text-center p-4">
                  Non-Negotiable
                </TableHead>
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
                  fieldValue={applicationFormData.application_form[fieldKey]}
                  setFormData={applicationFormHandler}
                  hasNonNegotiable={nonNegotiableFields.has(fieldKey)}
                  isNonNegotiable={isNonNegotiable}
                  toggleNonNegotiable={toggleNonNegotiable}
                />
              ))}
            </TableBody>
          </Table>
        </Field>
      </FieldSet>

      {/* Available Questionnaires Section */}
      <QuestionnaireBase
        questionnaire={applicationFormData.questionnaire}
        onQuestionnaireChange={questionnaireHandler}
      />

      {/* Non-Negotiable Modal */}
      <NonNegotiableModal
        show={showNonNegotiableModal}
        onClose={() => setShowNonNegotiableModal(false)}
        onContinue={() => setShowNonNegotiableModal(false)}
        formData={applicationFormData}
        setNonNegotiableValue={setNonNegotiableValue}
        addCustomNonNegotiable={addNonNegotiable}
        removeNonNegotiable={removeNonNegotiable}
      />
    </div>
  );
};
