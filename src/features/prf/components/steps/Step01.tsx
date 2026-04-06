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
import { useDepartmentListQuery } from "@/features/department";
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
  const { departments, loading: departmentsLoading } = useDepartmentListQuery();
  const selectedBusinessUnit = formData.business_unit?.toLowerCase() ?? "";

  const filteredDepartments = departments.filter((department) => {
    if (!selectedBusinessUnit) {
      return true;
    }

    return (
      (department.business_unit ?? "").toLowerCase() === selectedBusinessUnit
    );
  });

  const { users, loading } = useUsersByDepartment({
    business_unit: selectedBusinessUnit || "all",
    department: formData.job_posting.department ?? 0,
    include: "human_resources",
  });

  const handleReasonForPostingChange = (value: string) => {
    updateFormData((prev) => ({
      ...prev,
      job_posting: {
        ...prev.job_posting,
        reason_for_posting: value,
        other_reason_for_posting: value === "other" ? "" : null,
      },
    }));
  };

  if (loading || departmentsLoading) return <LoadingComponent />;

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
                            ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
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
                  <SelectItem value="new_position">New position</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="reliver">Reliver</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {getJobPostingError(errors, "reason_for_posting") && (
                <FieldError>
                  {getJobPostingError(errors, "reason_for_posting")}
                </FieldError>
              )}
              {formData.job_posting.reason_for_posting === "other" && (
                <Input
                  className="w-full mt-2"
                  placeholder="Please specify"
                  value={
                    formData.job_posting.reason_for_posting !== "other"
                      ? ""
                      : (formData.job_posting.other_reason_for_posting ?? "")
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
                      department: null,
                    },
                    immediate_supervisor: null,
                    immediate_supervisor_display: null,
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
                value={
                  formData.job_posting.department === null
                    ? ""
                    : String(formData.job_posting.department)
                }
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      department: Number(value),
                    },
                    immediate_supervisor: null,
                    immediate_supervisor_display: null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={String(department.id)}
                    >
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getJobPostingError(errors, "department") && (
                <FieldError>
                  {getJobPostingError(errors, "department")}
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
                    immediate_supervisor_display:
                      value === "no-supervisor"
                        ? null
                        : users.find((usr: User) => usr.id === Number(value)) ||
                          null,
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
                        (usr: User) => usr.id === formData.immediate_supervisor,
                      );
                      return selectedUser ? (
                        <SelectItem
                          key={selectedUser.id}
                          value={String(selectedUser.id)}
                        >
                          {`${selectedUser.first_name} ${selectedUser.last_name}`}
                        </SelectItem>
                      ) : null;
                    })()}

                  {/* Then show all supervisors from the selected department */}
                  <SelectItem value="no-supervisor">No Supervisor</SelectItem>
                  {users.length > 0 &&
                  users.some(
                    (usr: User) =>
                      usr.role === "supervisor" &&
                      usr.department?.id === formData.job_posting.department,
                  )
                    ? users
                        .filter(
                          (usr: User) =>
                            usr.role === "supervisor" &&
                            usr.department?.id ===
                              formData.job_posting.department &&
                            usr.id !== formData.immediate_supervisor,
                        )
                        .map((usr: User) => (
                          <SelectItem key={usr.id} value={String(usr.id)}>
                            {`${usr.first_name} ${usr.last_name}`}
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
