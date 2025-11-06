import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/shared/components/ui/field";
import { useUsersByDepartment } from "@/features/prf/hooks/useUsers";
import type { User } from "@/features/auth/types/auth.types";
import type { JobPostingResponsePRF } from "@/features/jobs/types/job.types";
import type { PRFHiringManagerResponse } from "@/features/prf/types/prf.types";

interface EditStep01Props {
  goToNextStep: () => void;
  formData: JobPostingResponsePRF;
  handleInputChange: (
    field: keyof JobPostingResponsePRF,
    value: string | number | boolean
  ) => void;
  handleHiringManagerChange: (index: number, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<JobPostingResponsePRF>>;
  errors?: { [key: string]: any };
}

export const EditStep01: React.FC<EditStep01Props> = ({
  goToNextStep,
  formData,
  handleInputChange,
  handleHiringManagerChange,
  setFormData,
  errors,
}) => {
  const { users } = useUsersByDepartment({
    business_unit: formData.business_unit,
    department_name: formData.department_name,
    include: "hiring_manager",
  });

  return (
    <div className="space-y-6">
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="job_title">Job Title *</FieldLabel>
          <Input
            id="job_title"
            value={formData.job_title}
            placeholder="Enter job title"
            onChange={(e) => handleInputChange("job_title", e.target.value)}
          />
          {errors?.job_posting?.job_title && (
            <FieldError>{errors.job_posting.job_title}</FieldError>
          )}
        </Field>

        {/* Target Start Date */}
        <Field>
          <FieldLabel htmlFor="target_start_date">
            Target Start Date *
          </FieldLabel>
          <Input
            id="target_start_date"
            type="date"
            value={formData.target_start_date}
            onChange={(e) =>
              handleInputChange("target_start_date", e.target.value)
            }
          />
          {errors?.job_posting?.target_start_date && (
            <FieldError>{errors.job_posting.target_start_date}</FieldError>
          )}
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
          {errors?.number_of_vacancies && (
            <FieldError>{errors.number_of_vacancies}</FieldError>
          )}
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
                  onChange={(e) => {
                    handleInputChange(
                      "business_unit",
                      e.target.value.toLocaleLowerCase()
                    );
                    handleInputChange("department_name", "");
                    handleInputChange("immediate_supervisor", "");
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  {unit}
                </span>
              </label>
            ))}
          </div>
        </Field>

        {/* Reason for Posting */}
        <Field>
          <FieldLabel htmlFor="reason_for_posting">
            Reason for Posting *
          </FieldLabel>
          <Select
            value={formData.reason_for_posting}
            onValueChange={(value) => {
              handleInputChange("reason_for_posting", value);
              handleInputChange("other_reason_for_posting", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_position">New position</SelectItem>
              <SelectItem value="replacement">Replacement</SelectItem>
              <SelectItem value="reliver">Reliver</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formData.reason_for_posting === "other" && (
            <Input
              className="w-full mt-2"
              placeholder="Please specify"
              value={formData.other_reason_for_posting}
              onChange={(e) =>
                handleInputChange("other_reason_for_posting", e.target.value)
              }
            />
          )}
        </Field>

        {/* Department */}
        <Field>
          <FieldLabel htmlFor="department">Department *</FieldLabel>
          <Select
            value={formData.department_name}
            onValueChange={(value) => {
              handleInputChange("department_name", value);
              handleInputChange("immediate_supervisor", "");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {formData.business_unit.toUpperCase() === "OORS" ? (
                <SelectItem value="sales">Sales Department</SelectItem>
              ) : (
                <>
                  <SelectItem value="sales-and-marketing">
                    Sales and Marketing Department
                  </SelectItem>
                  <SelectItem value="finance">Finance Department</SelectItem>
                  <SelectItem value="hr">Human Resources Department</SelectItem>
                  <SelectItem value="ci">
                    Continuous Improvement Department
                  </SelectItem>
                  <SelectItem value="operations-isla">
                    Operations - ISLA Department
                  </SelectItem>
                  <SelectItem value="operations-shell">
                    Operations - Shell Department
                  </SelectItem>
                  <SelectItem value="operations-prime">
                    Operations - Prime Department
                  </SelectItem>
                  <SelectItem value="operations-rpo">
                    Operations - RPO Department
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
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
              const selectedUser = users.find((usr: User) => usr.id === value);
              if (selectedUser) {
                setFormData((prev) => ({
                  ...prev,
                  immediate_supervisor: parseInt(selectedUser.id),
                  immediate_supervisor_display: `${selectedUser.first_name} ${selectedUser.last_name}`,
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  immediate_supervisor: null,
                  immediate_supervisor_display: value,
                }));
              }
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
                <SelectItem value="No Supervisor">No Supervisor</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors?.immediate_supervisor && (
            <FieldError>{errors.immediate_supervisor}</FieldError>
          )}
        </Field>

        {/* Levels of Interview */}
        <Field>
          <FieldLabel htmlFor="interview_levels">
            Levels of Interview *
          </FieldLabel>
          <Input
            id="interview_levels"
            type="number"
            min={0}
            value={formData.interview_levels}
            placeholder="Enter levels of interview"
            onChange={(e) =>
              handleInputChange("interview_levels", e.target.value)
            }
          />
        </Field>

        {/* Hiring Managers Section */}
        <Field className="md:col-span-2">
          <div className="mt-6">
            <div className="grid grid-cols-2 bg-gray-100 p-3 font-medium text-sm text-gray-700 border border-gray-200 rounded-t-md">
              <div>LEVELS OF INTERVIEW</div>
              <div>HIRING MANAGERS</div>
            </div>
            {Array.from({ length: formData.interview_levels }, (_, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4 items-center border-b border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Hiring Manager {i + 1}
                </div>
                <Select
                  value={
                    formData.hiring_managers?.[i] === 0
                      ? "0"
                      : formData.hiring_managers?.[i]?.toString() || ""
                  }
                  onValueChange={(value) => handleHiringManagerChange(i, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.hiring_managers.length > 0 ? (
                      formData.hiring_managers_display.map(
                        (hm: PRFHiringManagerResponse) => (
                          <SelectItem key={hm.id} value={hm.id.toString()}>
                            {hm.name}
                          </SelectItem>
                        )
                      )
                    ) : (
                      <SelectItem value="no-hiring-manager">
                        No Hiring Manager
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          {errors?.hiring_managers && (
            <FieldError>{errors.hiring_managers}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end mt-10">
        <Button
          className="bg-[#0056D2] hover:bg-blue-700 text-white"
          onClick={goToNextStep}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
