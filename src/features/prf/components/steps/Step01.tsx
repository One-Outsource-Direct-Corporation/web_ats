import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import type { PRFFormData } from "../../types/prf.types";
import { useUsersByDepartment } from "../../hooks/useUsers";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import type { User } from "@/features/auth/types/auth.types";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ArrowRight, ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { formatDate } from "@/shared/utils/formatDate";
import type { ValidationError } from "../../utils/validateSteps";
import {
  getJobPostingError,
  getFieldError,
} from "@/shared/utils/formValidation";

interface Step01Props {
  goToNextStep: () => void;
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
  errors?: ValidationError | null;
}

export const Step01 = ({
  goToNextStep,
  formData,
  updateFormData,
  errors,
}: Step01Props) => {
  const { users, loading } = useUsersByDepartment({
    business_unit: formData.business_unit?.toLowerCase() || "",
    department_name: formData.job_posting.department_name?.toLowerCase() || "",
    include: "hiring_manager",
  });

  const handleReasonForPostingChange = (value: string) => {
    updateFormData((prev) => ({
      ...prev,
      job_posting: {
        ...prev.job_posting,
        reason_for_posting: value,
        other_reason_for_posting: value === "Other" ? "" : null,
      },
    }));
  };

  if (loading) return <LoadingComponent />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Position Information */}
        <FieldGroup>
          <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
            Position Information
          </h2>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Job Title</FieldLabel>
              <Input
                placeholder="Enter Job Title"
                value={formData.job_posting.job_title ?? ""}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      job_title: e.target.value,
                    },
                  }))
                }
              />
              {getJobPostingError(errors, "job_title") && (
                <FieldError>
                  {getJobPostingError(errors, "job_title")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Target Start Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {formData.job_posting.target_start_date
                      ? formatDate(formData.job_posting.target_start_date)
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      formData.job_posting.target_start_date
                        ? new Date(formData.job_posting.target_start_date)
                        : undefined
                    }
                    onSelect={(date) => {
                      updateFormData((prev) => ({
                        ...prev,
                        job_posting: {
                          ...prev.job_posting,
                          target_start_date: date
                            ? formatDate(date.toLocaleDateString())
                            : null,
                        },
                      }));
                    }}
                  />
                </PopoverContent>
              </Popover>
              {getJobPostingError(errors, "target_start_date") && (
                <FieldError>
                  {getJobPostingError(errors, "target_start_date")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>No. of Vacancies</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 3"
                value={formData.job_posting.number_of_vacancies ?? 0}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      number_of_vacancies: Number(e.target.value),
                    },
                  }))
                }
              />
              {getJobPostingError(errors, "number_of_vacancies") && (
                <FieldError>
                  {getJobPostingError(errors, "number_of_vacancies")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Reason for Posting Position</FieldLabel>
              <Select
                value={formData.job_posting.reason_for_posting ?? ""}
                onValueChange={handleReasonForPostingChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Position">New position</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Reliver">Reliver</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {getJobPostingError(errors, "reason_for_posting") && (
                <FieldError>
                  {getJobPostingError(errors, "reason_for_posting")}
                </FieldError>
              )}
              {formData.job_posting.reason_for_posting === "Other" && (
                <Input
                  className="w-full mt-2"
                  placeholder="Please specify"
                  value={
                    formData.job_posting.reason_for_posting !== "Other"
                      ? ""
                      : formData.job_posting.other_reason_for_posting ?? ""
                  }
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      job_posting: {
                        ...prev.job_posting,
                        other_reason_for_posting: e.target.value,
                      },
                    }))
                  }
                />
              )}
            </Field>
          </FieldGroup>
        </FieldGroup>
        {/* Department Information */}
        <FieldGroup>
          <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
            Department Information
          </h2>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Business Unit</FieldLabel>
              <RadioGroup
                value={formData.business_unit ?? ""}
                onValueChange={(value: string) =>
                  updateFormData((prev) => ({
                    ...prev,
                    business_unit: value,
                    job_posting: {
                      ...prev.job_posting,
                      department_name: null,
                    },
                  }))
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="oodc"
                    id="oodc"
                    className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
                  />
                  <FieldLabel htmlFor="oodc">OODC</FieldLabel>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="oors"
                    id="oors"
                    className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
                  />
                  <FieldLabel htmlFor="oors">OORS</FieldLabel>
                </div>
              </RadioGroup>
              {getFieldError(errors, "business_unit") && (
                <FieldError>
                  {getFieldError(errors, "business_unit")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Department Name</FieldLabel>
              <Select
                value={formData.job_posting.department_name ?? ""}
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      department_name: value,
                      // department_display: formatDepartmentName(value),
                    },
                    immediate_supervisor: null,
                    // immediate_supervisor_display: null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {formData.business_unit?.toUpperCase() === "OORS" ? (
                    <SelectItem value="sales">Sales Department</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="sales-and-marketing">
                        Sales and Marketing Department
                      </SelectItem>
                      <SelectItem value="finance">
                        Finance Department
                      </SelectItem>
                      <SelectItem value="hr">
                        Human Resources Department
                      </SelectItem>
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
              {getJobPostingError(errors, "department_name") && (
                <FieldError>
                  {getJobPostingError(errors, "department_name")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Immediate Supervisor</FieldLabel>
              <Select
                value={
                  formData.immediate_supervisor === null
                    ? "no-supervisor"
                    : String(formData.immediate_supervisor)
                }
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    immediate_supervisor:
                      value === "no-supervisor" ? null : Number(value),
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex: Ms. Hailey Adams" />
                </SelectTrigger>
                <SelectContent>
                  {/* Always show the currently selected supervisor first, if any */}
                  {formData.immediate_supervisor &&
                    (() => {
                      const selectedUser = users.find(
                        (usr: User) => usr.id === formData.immediate_supervisor
                      );
                      return selectedUser ? (
                        <SelectItem
                          key={selectedUser.id}
                          value={String(selectedUser.id)}
                        >
                          {selectedUser.full_name}
                        </SelectItem>
                      ) : null;
                    })()}

                  {/* Then show all supervisors from the selected department */}
                  <SelectItem value="no-supervisor">No Supervisor</SelectItem>
                  {users.length > 0 &&
                  users.some(
                    (usr: User) =>
                      usr.role === "supervisor" &&
                      usr.department === formData.job_posting.department_name
                  )
                    ? users
                        .filter(
                          (usr: User) =>
                            usr.role === "supervisor" &&
                            usr.department ===
                              formData.job_posting.department_name &&
                            usr.id !== formData.immediate_supervisor
                        )
                        .map((usr: User) => (
                          <SelectItem key={usr.id} value={String(usr.id)}>
                            {usr.full_name}
                          </SelectItem>
                        ))
                    : null}
                </SelectContent>
              </Select>
              {getFieldError(errors, "immediate_supervisor") && (
                <FieldError>
                  {getFieldError(errors, "immediate_supervisor")}
                </FieldError>
              )}
            </Field>
          </FieldGroup>
        </FieldGroup>
        <div className="flex justify-end mt-10">
          <Button
            className="bg-[#0056D2] hover:bg-blue-700 text-white flex flex-row items-center"
            onClick={goToNextStep}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
