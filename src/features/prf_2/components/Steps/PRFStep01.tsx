import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { ChevronDownIcon } from "lucide-react";
import { formatDate } from "@/shared/utils/formatDate.ts";
import { Calendar } from "@/shared/components/ui/calendar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/shared/components/ui/radio-group.tsx";
import type { User } from "@/features/auth/types/auth.types.ts";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData.ts";
import React from "react";
import type { BusinessUnit } from "@/features/prf_2/types/enums/BusinessUnit.ts";
import type { ImmediateSupervisorObject } from "@/features/prf_2/types/PRF";
import { useDepartmentByBusinessUnit } from "@/features/department/hooks/useDepartmentByBusinessUnit.ts";
import { useUsersByDepartment } from "@/features/prf/hooks/useUsers";
import {
  getDepartmentName,
  getImmediateSupervisorDisplay,
} from "@/features/prf_2/utils/displayMappers";

interface PRFStep01Props {
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
}

function toImmediateSupervisorObject(user: User): ImmediateSupervisorObject {
  return {
    id: user.id,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    role: user.role,
  };
}

export default function PRFStep01({
  formData,
  updateFormData,
}: PRFStep01Props) {
  const selectedBusinessUnit = formData.prf_input.business_unit || undefined;
  const selectedDepartmentId =
    typeof formData.job_posting.department === "number"
      ? formData.job_posting.department
      : 0;

  const { departments, loading: departmentsLoading } =
    useDepartmentByBusinessUnit(selectedBusinessUnit);

  const { users, loading: usersLoading } = useUsersByDepartment({
    business_unit: selectedBusinessUnit ?? "all",
    department: selectedDepartmentId,
    include: "supervisor",
  });

  const supervisors = users.filter((user) => user.role === "supervisor");

  const handleBusinessUnitChange = (value: BusinessUnit) => {
    updateFormData((prev) => ({
      ...prev,
      job_posting: {
        ...prev.job_posting,
        department: "",
        department_display: null,
      },
      prf_input: {
        ...prev.prf_input,
        business_unit: value,
        immediate_supervisor: "",
        immediate_supervisor_display: null,
      },
    }));
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = Number(value);
    const selectedDepartment =
      departments.find((department) => department.id === departmentId) ?? null;

    updateFormData((prev) => ({
      ...prev,
      job_posting: {
        ...prev.job_posting,
        department: departmentId,
        department_display: getDepartmentName(selectedDepartment),
      },
      prf_input: {
        ...prev.prf_input,
        immediate_supervisor: "",
        immediate_supervisor_display: null,
      },
    }));
  };

  const handleImmediateSupervisorChange = (value: string) => {
    if (value === "no-supervisor") {
      updateFormData((prev) => ({
        ...prev,
        prf_input: {
          ...prev.prf_input,
          immediate_supervisor: "",
          immediate_supervisor_display: null,
        },
      }));
      return;
    }

    const selectedSupervisor = users.find((usr) => usr.id === Number(value));
    const immediateSupervisor = selectedSupervisor
      ? toImmediateSupervisorObject(selectedSupervisor)
      : null;

    updateFormData((prev) => ({
      ...prev,
      prf_input: {
        ...prev.prf_input,
        immediate_supervisor: immediateSupervisor ? immediateSupervisor.id : "",
        immediate_supervisor_display:
          getImmediateSupervisorDisplay(immediateSupervisor),
      },
    }));
  };

  const selectedDepartmentValue =
    typeof formData.job_posting.department === "number"
      ? String(formData.job_posting.department)
      : "";

  const selectedSupervisorValue =
    formData.prf_input.immediate_supervisor === ""
      ? "no-supervisor"
      : String(formData.prf_input.immediate_supervisor);

  return (
    <div className="lg:col-span-2 space-y-6">
      <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
        Position Information
      </h2>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Job Title</FieldLabel>
          <Input
            placeholder="Enter Job Title"
            value={formData.job_posting.job_title || ""}
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
                        ? `${date.getFullYear()}-${(date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}-${date
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`
                        : "",
                    },
                  }));
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field>
          <FieldLabel>No. of Vacancies</FieldLabel>
          <Input
            type="number"
            placeholder="e.g. 3"
            value={formData.job_posting.number_of_vacancies || ""}
            onChange={(e) =>
              updateFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  number_of_vacancies:
                    e.target.value === "" ? "" : Number(e.target.value),
                },
              }))
            }
          />
        </Field>

        <Field>
          <FieldLabel>Reason for Posting Position</FieldLabel>
          <Select
            value={formData.job_posting.reason_for_posting || ""}
            onValueChange={(value) => {
              updateFormData((prev) => ({
                ...prev,
                job_posting: {
                  ...prev.job_posting,
                  reason_for_posting: value,
                  other_reason_for_posting: value === "other" ? "" : "",
                },
              }));
            }}
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

          {formData.job_posting.reason_for_posting === "other" && (
            <Input
              className="w-full mt-2"
              placeholder="Please specify"
              value={formData.job_posting.other_reason_for_posting || ""}
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

      <FieldGroup>
        <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
          Department Information
        </h2>

        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>Business Unit</FieldLabel>
            <RadioGroup
              value={formData.prf_input.business_unit || ""}
              onValueChange={(value: BusinessUnit) =>
                handleBusinessUnitChange(value)
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
          </Field>

          <Field>
            <FieldLabel>Department Name</FieldLabel>
            <Select
              value={selectedDepartmentValue}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {!selectedBusinessUnit && (
                  <SelectItem value="business-unit-required" disabled>
                    Select a business unit first
                  </SelectItem>
                )}

                {selectedBusinessUnit && departmentsLoading && (
                  <SelectItem value="department-loading" disabled>
                    Loading departments...
                  </SelectItem>
                )}

                {selectedBusinessUnit &&
                  !departmentsLoading &&
                  departments.length === 0 && (
                    <SelectItem value="department-empty" disabled>
                      No departments available
                    </SelectItem>
                  )}

                {departments.map((department) => (
                  <SelectItem key={department.id} value={String(department.id)}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Immediate Supervisor</FieldLabel>
            <Select
              value={selectedSupervisorValue}
              onValueChange={handleImmediateSupervisorChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ex: Ms. Hailey Adams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-supervisor">No Supervisor</SelectItem>

                {formData.immediate_supervisor &&
                  !supervisors.some(
                    (supervisor) =>
                      supervisor.id === formData.immediate_supervisor?.id,
                  ) && (
                    <SelectItem
                      value={String(formData.immediate_supervisor.id)}
                    >
                      {formData.immediate_supervisor_display ||
                        `${formData.immediate_supervisor.first_name} ${formData.immediate_supervisor.last_name}`}
                    </SelectItem>
                  )}

                {selectedDepartmentId === 0 && (
                  <SelectItem value="supervisor-department-required" disabled>
                    Select a department first
                  </SelectItem>
                )}

                {selectedDepartmentId > 0 && usersLoading && (
                  <SelectItem value="supervisor-loading" disabled>
                    Loading supervisors...
                  </SelectItem>
                )}

                {selectedDepartmentId > 0 &&
                  !usersLoading &&
                  supervisors.length === 0 && (
                    <SelectItem value="supervisor-empty" disabled>
                      No supervisors available
                    </SelectItem>
                  )}

                {supervisors
                  .filter(
                    (supervisor: User) =>
                      supervisor.id !== formData.immediate_supervisor?.id,
                  )
                  .map((supervisor: User) => (
                    <SelectItem
                      key={supervisor.id}
                      value={String(supervisor.id)}
                    >
                      {`${supervisor.first_name} ${supervisor.last_name}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </div>
  );
}
