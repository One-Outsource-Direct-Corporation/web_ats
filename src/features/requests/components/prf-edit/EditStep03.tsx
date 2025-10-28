import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/shared/components/ui/field";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import type { JobPostingResponsePRF } from "@/features/jobs/types/job.types";
import formatName from "@/shared/utils/formatName";

interface EditStep03Props {
  handleSubmit: () => Promise<void>;
  goToPreviousStep: () => void;
  formData: JobPostingResponsePRF;
  handleInputChange: (
    field: keyof JobPostingResponsePRF,
    value: string | number | boolean
  ) => void;
  handleAssessmentTypeToggle: (type: string) => void;
  handleRequirementsToggle: (requirement: string) => void;
  handleSoftwareToggle: (software: string) => void;
  loading: boolean;
}

export const EditStep03: React.FC<EditStep03Props> = ({
  handleSubmit,
  goToPreviousStep,
  formData,
  handleInputChange,
  handleAssessmentTypeToggle,
  handleRequirementsToggle,
  handleSoftwareToggle,
  loading,
}) => {
  const formattedOtherAssessment =
    formData.other_assessment.length > 0
      ? formData.other_assessment
          .map((item: string) => formatName(item))
          .join(", ")
      : null;

  return (
    <div className="space-y-6">
      <FieldGroup className="grid md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Salary Budget</FieldLabel>
          <Input
            id="salary_budget"
            value={formData.salary_budget}
            placeholder="Enter salary budget"
            onChange={(e) => handleInputChange("salary_budget", e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              checked={formData.is_salary_range}
              onCheckedChange={(value) =>
                handleInputChange("is_salary_range", Boolean(value))
              }
              id="salaryRangeToggle"
            />
            <label htmlFor="salaryRangeToggle" className="text-sm">
              Is Salary Range?
            </label>
          </div>
        </Field>
      </FieldGroup>

      {formData.is_salary_range && (
        <FieldGroup className="grid md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="min_salary">Minimum Salary</FieldLabel>
            <Input
              id="min_salary"
              type="number"
              value={formData.min_salary}
              placeholder="Enter minimum salary"
              onChange={(e) => handleInputChange("min_salary", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="max_salary">Maximum Salary</FieldLabel>
            <Input
              id="max_salary"
              type="number"
              value={formData.max_salary}
              placeholder="Enter maximum salary"
              onChange={(e) => handleInputChange("max_salary", e.target.value)}
            />
          </Field>
        </FieldGroup>
      )}

      <Field>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={formData.assessment_required}
            onCheckedChange={(checked) =>
              handleInputChange("assessment_required", Boolean(checked))
            }
            id="assessment_required"
          />
          <FieldLabel htmlFor="assessment_required" className="text-sm">
            Assessment Required?
          </FieldLabel>
        </div>
      </Field>

      {formData.assessment_required && (
        <>
          <Field className="md:col-span-2">
            <FieldLabel>Assessment Types</FieldLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { value: "technical", label: "Technical" },
                { value: "language", label: "Language" },
                { value: "cognitive", label: "Cognitive" },
                { value: "personality", label: "Personality" },
                { value: "behavioral", label: "Behavioral" },
                { value: "cultural", label: "Cultural" },
              ].map((assessmentType) => (
                <div
                  key={assessmentType.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={assessmentType.value}
                    checked={
                      Array.isArray(formData.assessment_types)
                        ? formData.assessment_types.some(
                            (at: { id: number; name: string }) =>
                              at.name === assessmentType.value
                          )
                        : false
                    }
                    onCheckedChange={() =>
                      handleAssessmentTypeToggle(assessmentType.value)
                    }
                  />
                  <Label htmlFor={assessmentType.value} className="text-sm">
                    {assessmentType.label}
                  </Label>
                </div>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="other_assessment">
              Other Assessments
            </FieldLabel>
            <Input
              id="other_assessment"
              value={formattedOtherAssessment || ""}
              placeholder="Enter other assessments (comma-separated)"
              onChange={(e) =>
                handleInputChange("other_assessment", e.target.value)
              }
            />
          </Field>
        </>
      )}

      <Field>
        <FieldLabel htmlFor="hardware_required">Hardware Required</FieldLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { value: "desktop", label: "Desktop" },
            { value: "handset", label: "Handset" },
            { value: "headset", label: "Headset" },
            { value: "laptop", label: "Laptop" },
          ].map((hardware) => (
            <div key={hardware.value} className="flex items-center space-x-2">
              <Checkbox
                id={hardware.value}
                checked={
                  Array.isArray(formData.hardware_requirements)
                    ? formData.hardware_requirements.some(
                        (at: { id: number; name: string }) =>
                          at.name === hardware.value
                      )
                    : false
                }
                onCheckedChange={() => handleRequirementsToggle(hardware.value)}
              />
              <Label htmlFor={hardware.value} className="text-sm">
                {hardware.label}
              </Label>
            </div>
          ))}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="software_required">Software Required</FieldLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { value: "adobe_photoshop", label: "Adobe Photoshop" },
            { value: "google_chrome", label: "Google Chrome" },
            { value: "ms_teams", label: "MS Teams" },
            { value: "open_vpn", label: "Open VPN" },
            { value: "winrar", label: "WinRAR" },
            { value: "zoho", label: "Zoho" },
            { value: "email", label: "Email" },
            { value: "microsoft_office", label: "Microsoft Office" },
            { value: "nitro_pro_8_pdf", label: "Nitro Pro 8 PDF" },
            { value: "viber", label: "Viber" },
            { value: "xlite", label: "Xlite" },
            { value: "zoom", label: "Zoom" },
          ].map((software) => (
            <div key={software.value} className="flex items-center space-x-2">
              <Checkbox
                id={software.value}
                checked={
                  Array.isArray(formData.software_requirements)
                    ? formData.software_requirements.some(
                        (at: { id: number; name: string }) =>
                          at.name === software.value
                      )
                    : false
                }
                onCheckedChange={() => handleSoftwareToggle(software.value)}
              />
              <Label htmlFor={software.value} className="text-sm">
                {software.label}
              </Label>
            </div>
          ))}
        </div>
      </Field>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={goToPreviousStep}>
          &larr; Previous
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
