import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/shared/components/ui/field";
import type { PRFResponse } from "@/features/prf/types/prfTypes";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { useUsersByDepartment } from "@/features/prf/hooks/useUsersByDepartment";
import type { User } from "@/features/auth/types/auth.types";
import formatName from "@/shared/utils/formatName";
interface PRFEditFormProps {
  initialData: PRFResponse;
  onSave: (data: PRFResponse) => Promise<void>;
  saving: boolean;
}

export default function PRFEditForm({
  initialData,
  onSave,
  saving,
}: PRFEditFormProps) {
  const [formData, setFormData] = useState<PRFResponse>(initialData);
  const [isEdited, setIsEdited] = useState(false);
  const { users } = useUsersByDepartment(formData.business_unit.toLowerCase());

  const handleInputChange = (
    field: keyof PRFResponse,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="job_title">Job Title *</FieldLabel>
          <Input
            id="job_title"
            value={formData.job_posting.job_title}
            placeholder="Enter job title"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  job_title: e.target.value,
                },
              }));
              setIsEdited(true);
            }}
          />
        </Field>

        {/* Target Start Date */}
        <Field>
          <FieldLabel htmlFor="target_start_date">
            Target Start Date *
          </FieldLabel>
          <Input
            id="target_start_date"
            type="date"
            value={formData.job_posting.target_start_date}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  target_start_date: e.target.value,
                },
              }));
              setIsEdited(true);
            }}
          />
        </Field>

        {/* Number of Vacancies */}
        <Field>
          <FieldLabel htmlFor="number_of_vacancies">
            Number of Vacancies *
          </FieldLabel>
          <Input
            id="number_of_vacancies"
            type="number"
            value={formData.number_of_vacancies}
            placeholder="Enter number of vacancies"
            onChange={(e) =>
              handleInputChange("number_of_vacancies", e.target.value)
            }
          />
        </Field>

        {/* Business Unit */}
        <Field>
          <FieldLabel>Business Unit *</FieldLabel>
          <div className="flex flex-col space-y-2">
            {["OODC", "OORS"].map((unit) => (
              <label
                key={unit}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="business_unit"
                  value={unit.toLocaleUpperCase()}
                  checked={formData.business_unit === unit.toLocaleLowerCase()}
                  onChange={(e) =>
                    handleInputChange(
                      "business_unit",
                      e.target.value.toLocaleLowerCase()
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  {unit}
                </span>
              </label>
            ))}
          </div>
        </Field>

        {/* Department */}
        <Field>
          <FieldLabel htmlFor="department">Department *</FieldLabel>
          <Input
            id="department"
            value={formatName(formData.job_posting.department_name)}
            placeholder="Enter department"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  department_name: e.target.value,
                },
              }));
              setIsEdited(true);
            }}
          />
        </Field>

        {/* Immediate Supervisor */}
        <Field>
          <FieldLabel htmlFor="immediate_supervisor">
            Immediate Supervisor *
          </FieldLabel>
          <Select
            value={
              formData.immediate_supervisor === null
                ? "No Supervisor"
                : String(formData.immediate_supervisor)
            }
            onValueChange={(value) => {
              // Find the selected user to get their full name for display
              const selectedUser = users.find((usr: User) => usr.id === value);
              if (selectedUser) {
                // Update both the ID and display name
                setFormData((prev) => ({
                  ...prev,
                  immediate_supervisor: parseInt(selectedUser.id),
                  immediate_supervisor_display: `${selectedUser.first_name} ${selectedUser.last_name}`,
                }));
              } else {
                // Handle "No Supervisor" case
                setFormData((prev) => ({
                  ...prev,
                  immediate_supervisor: null,
                  immediate_supervisor_display: value,
                }));
              }
              setIsEdited(true);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ex: Ms. Hailey Adams">
                {formData.immediate_supervisor_display || "Select supervisor"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {users.length > 0 &&
              users.some((usr: User) => usr.role === "supervisor") ? (
                users
                  .filter((usr: User) => usr.role === "supervisor")
                  .map((usr: User) => (
                    <SelectItem key={usr.id} value={usr.id}>
                      {usr.first_name} {usr.last_name}
                    </SelectItem>
                  ))
              ) : (
                <>
                  <SelectItem value="No Supervisor">No Supervisor</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </Field>

        {/* Employment Type */}
        <Field>
          <FieldLabel htmlFor="employment_type">Employment Type *</FieldLabel>
          <Select
            value={formData.job_posting.employment_type}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  employment_type: value,
                },
              }));
              setIsEdited(true);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Work Setup */}
        <Field>
          <FieldLabel htmlFor="work_setup">Work Setup *</FieldLabel>
          <Select
            value={formData.job_posting.work_setup}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  work_setup: value,
                },
              }));
              setIsEdited(true);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work setup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Salary Budget */}
        <Field>
          <FieldLabel htmlFor="salary_budget">Salary Budget *</FieldLabel>
          <Input
            id="salary_budget"
            value={formData.salary_budget}
            placeholder="Enter salary budget"
            onChange={(e) => handleInputChange("salary_budget", e.target.value)}
          />
        </Field>

        {/* Reason for Posting */}
        <Field>
          <FieldLabel htmlFor="reason_for_posting">
            Reason for Posting *
          </FieldLabel>
          <Select
            value={formData.job_posting.reason_for_posting}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  reason_for_posting: value,
                },
              }));
              setIsEdited(true);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_position">New Position</SelectItem>
              <SelectItem value="replacement">Replacement</SelectItem>
              <SelectItem value="expansion">Expansion</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      {/* Description */}
      <Field>
        <RichTextEditor
          title="Job Description *"
          value={formData.job_posting.description}
          onChange={(content) => {
            setFormData((prev) => ({
              ...prev,
              job_posting: {
                ...prev.job_posting,
                description: content,
              },
            }));
            setIsEdited(true);
          }}
        />
      </Field>

      {/* Responsibilities */}
      <Field>
        <RichTextEditor
          title="Key Responsibilities *"
          value={formData.job_posting.responsibilities}
          onChange={(content) => {
            setFormData((prev) => ({
              ...prev,
              job_posting: {
                ...prev.job_posting,
                responsibilities: content,
              },
            }));
            setIsEdited(true);
          }}
        />
      </Field>

      {/* Qualifications */}
      <Field>
        <RichTextEditor
          title="Required Qualifications *"
          value={formData.job_posting.qualifications}
          onChange={(content) => {
            setFormData((prev) => ({
              ...prev,
              job_posting: {
                ...prev.job_posting,
                qualifications: content,
              },
            }));
            setIsEdited(true);
          }}
        />
      </Field>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          disabled={saving || !isEdited}
          className="min-w-32"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
