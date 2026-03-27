import { useState } from "react";
import type {
  PositionBase,
  PositionFormData,
} from "../types/externalPosting.types";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldLegend,
  FieldDescription,
  FieldError,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  LoaderCircle,
} from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { ClientAddModal, useClientQuery } from "@/features/client";
import { DepartmentAddModal, useDepartmentQuery } from "@/features/department";
import { formatDate } from "@/shared/utils/formatDate";
import type { ValidationError } from "../utils/validateSteps";
import {
  getFieldError,
  getJobPostingError,
} from "@/shared/utils/formValidation";
import { cn } from "@/lib/utils";

interface BasicDetailsFormProps {
  formData: PositionFormData;
  onInputChange: (
    field: keyof PositionBase,
    value: string | number | null,
  ) => void;
  handleJobPostingChange: (
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null,
  ) => void;
  errorFields: ValidationError | null;
}

// To do: Optimize the function on onChange, it is laggy
// Lagged only if dev tools are open, primary issue is the Select component from ShadCN

export const BasicDetailsForm = ({
  formData,
  onInputChange,
  handleJobPostingChange,
  errorFields,
}: BasicDetailsFormProps) => {
  const parseNullableNumber = (value: string): number | null => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  };

  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [departmentPickerOpen, setDepartmentPickerOpen] = useState(false);
  const {
    clients,
    loading,
    refetch,
    setSearch,
    loadMore,
    hasMore,
    isFetchingNextPage,
  } = useClientQuery();
  const {
    departments,
    loading: loadingDepartments,
    refetch: refetchDepartments,
    setSearch: setDepartmentSearch,
    loadMore: loadMoreDepartments,
    hasMore: hasMoreDepartments,
    isFetchingNextPage: isFetchingNextDepartmentPage,
  } = useDepartmentQuery();

  const selectedClient = clients.find(
    (client) => client.id === formData.client,
  );
  const selectedDepartment = departments.find(
    (department) => department.name === formData.job_posting.department_name,
  );

  const getRootError = (field: string) => {
    const rootError = getFieldError(errorFields, field);

    // Step-level errors can remain stale until the next full submit cycle.
    // Hide "required" errors when a valid value is already selected.
    if (field === "client" && formData.client !== null) {
      return undefined;
    }

    if (
      field === "education_level" &&
      typeof formData.education_level === "string" &&
      formData.education_level.trim().length > 0
    ) {
      return undefined;
    }

    return rootError;
  };
  const getJobError = (field: string) => getJobPostingError(errorFields, field);

  return (
    <div>
      {/* Basic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Client *</FieldLabel>
              <Field orientation="horizontal">
                <div className="flex w-full items-center gap-2">
                  <Popover
                    open={clientPickerOpen}
                    onOpenChange={setClientPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={clientPickerOpen}
                        className="flex-1 justify-between"
                      >
                        {selectedClient?.name ?? "Select Client"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search clients..."
                          className="h-9"
                          onValueChange={setSearch}
                        />
                        <CommandList
                          className="max-h-[300px] overflow-y-auto"
                          onScroll={(event) => {
                            const target = event.currentTarget;
                            if (
                              target.scrollHeight - target.scrollTop <=
                                target.clientHeight + 100 &&
                              hasMore &&
                              !isFetchingNextPage
                            ) {
                              void loadMore();
                            }
                          }}
                        >
                          <CommandEmpty>
                            {loading
                              ? "Loading clients..."
                              : "No client found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {clients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={String(client.id)}
                                onSelect={() => {
                                  onInputChange("client", client.id);
                                  setClientPickerOpen(false);
                                }}
                              >
                                {client.name}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    formData.client === client.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                            {hasMore && !isFetchingNextPage && (
                              <CommandItem
                                disabled
                                className="justify-center text-sm text-gray-500"
                              >
                                Scroll for more...
                              </CommandItem>
                            )}
                            {isFetchingNextPage && (
                              <CommandItem
                                disabled
                                className="justify-center text-sm text-gray-500"
                              >
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                Loading more clients...
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <ClientAddModal onClientAdded={() => void refetch()} />
              </Field>
              {getRootError("client") && (
                <FieldError>{getRootError("client")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Job Title *</FieldLabel>
              <Input
                type="text"
                value={formData.job_posting.job_title ?? ""}
                onChange={(e) =>
                  handleJobPostingChange("job_title", e.target.value)
                }
                placeholder="Enter job title"
              />
              {getJobError("job_title") && (
                <FieldError>{getJobError("job_title")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Department *</FieldLabel>
              <Field orientation="horizontal">
                <div className="flex w-full items-center gap-2">
                  <Popover
                    open={departmentPickerOpen}
                    onOpenChange={setDepartmentPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={departmentPickerOpen}
                        className="flex-1 justify-between"
                      >
                        {selectedDepartment?.name ?? "Select Department"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search departments..."
                          className="h-9"
                          onValueChange={setDepartmentSearch}
                        />
                        <CommandList
                          className="max-h-[300px] overflow-y-auto"
                          onScroll={(event) => {
                            const target = event.currentTarget;
                            if (
                              target.scrollHeight - target.scrollTop <=
                                target.clientHeight + 100 &&
                              hasMoreDepartments &&
                              !isFetchingNextDepartmentPage
                            ) {
                              void loadMoreDepartments();
                            }
                          }}
                        >
                          <CommandEmpty>
                            {loadingDepartments
                              ? "Loading departments..."
                              : "No department found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {departments.map((department) => (
                              <CommandItem
                                key={department.id}
                                value={department.name}
                                onSelect={() => {
                                  handleJobPostingChange(
                                    "department_name",
                                    department.name,
                                  );
                                  setDepartmentPickerOpen(false);
                                }}
                              >
                                {department.name}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    formData.job_posting.department_name ===
                                      department.name
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                            {hasMoreDepartments &&
                              !isFetchingNextDepartmentPage && (
                                <CommandItem
                                  disabled
                                  className="justify-center text-sm text-gray-500"
                                >
                                  Scroll for more...
                                </CommandItem>
                              )}
                            {isFetchingNextDepartmentPage && (
                              <CommandItem
                                disabled
                                className="justify-center text-sm text-gray-500"
                              >
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                Loading more departments...
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <DepartmentAddModal
                  onDepartmentAdded={() => void refetchDepartments()}
                />
              </Field>
              {getJobError("department_name") && (
                <FieldError>{getJobError("department_name")}</FieldError>
              )}
            </Field>

            {formData.job_posting.department_name === "other" && (
              <Field>
                <FieldLabel>Please Specify *</FieldLabel>
                <Input
                  type="text"
                  value={formData.job_posting.department_name_other ?? ""}
                  onChange={(e) =>
                    handleJobPostingChange(
                      "department_name_other",
                      e.target.value,
                    )
                  }
                />
              </Field>
            )}

            <Field>
              <FieldLabel>Employment Type *</FieldLabel>
              <Select
                value={formData.job_posting.employment_type ?? ""}
                onValueChange={(value) =>
                  handleJobPostingChange("employment_type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-Time</SelectItem>
                  <SelectItem value="part_time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
              {getJobError("employment_type") && (
                <FieldError>{getJobError("employment_type")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Work Setup *</FieldLabel>
              <Select
                value={formData.job_posting.work_setup ?? ""}
                onValueChange={(value) =>
                  handleJobPostingChange("work_setup", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Work Setup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {getJobError("work_setup") && (
                <FieldError>{getJobError("work_setup")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Working Site *</FieldLabel>
              <Input
                type="text"
                value={formData.job_posting.working_site ?? ""}
                onChange={(e) =>
                  handleJobPostingChange("working_site", e.target.value)
                }
                placeholder="Enter working site"
              />
              {getJobError("working_site") && (
                <FieldError>{getJobError("working_site")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Work Schedule From *</FieldLabel>
              <Input
                type="time"
                value={formData.job_posting.work_schedule_from ?? ""}
                onChange={(e) =>
                  handleJobPostingChange("work_schedule_from", e.target.value)
                }
              />
              {getJobError("work_schedule_from") && (
                <FieldError>{getJobError("work_schedule_from")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Work Schedule To *</FieldLabel>
              <Input
                type="time"
                value={formData.job_posting.work_schedule_to ?? ""}
                onChange={(e) =>
                  handleJobPostingChange("work_schedule_to", e.target.value)
                }
              />
              {getJobError("work_schedule_to") && (
                <FieldError>{getJobError("work_schedule_to")}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Education Needed *</FieldLabel>
              <Select
                value={formData.education_level ?? ""}
                onValueChange={(value) =>
                  onInputChange("education_level", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="associate">Associate's Degree</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
              {getRootError("education_level") && (
                <FieldError>{getRootError("education_level")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Experience Level *</FieldLabel>
              <Select
                value={formData.job_posting.experience_level ?? ""}
                onValueChange={(value) =>
                  handleJobPostingChange("experience_level", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry_level">Entry Level</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid_level">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              {getJobError("experience_level") && (
                <FieldError>{getJobError("experience_level")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Headcounts Needed *</FieldLabel>
              <Input
                type="number"
                value={formData.job_posting.number_of_vacancies ?? ""}
                onChange={(e) =>
                  handleJobPostingChange(
                    "number_of_vacancies",
                    parseNullableNumber(e.target.value),
                  )
                }
                placeholder="Enter number of positions"
                min={0}
              />
              {getJobError("number_of_vacancies") && (
                <FieldError>{getJobError("number_of_vacancies")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Date Needed *</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    // data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal"
                  >
                    {formData.job_posting.target_start_date || "Pick a date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formData.job_posting.target_start_date
                        ? new Date(formData.job_posting.target_start_date)
                        : new Date()
                    }
                    onSelect={(date) =>
                      handleJobPostingChange(
                        "target_start_date",
                        date ? formatDate(date.toLocaleDateString()) : null,
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
              {getJobError("target_start_date") && (
                <FieldError>{getJobError("target_start_date")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Reason for Hire *</FieldLabel>
              <Select
                value={formData.job_posting.reason_for_posting ?? ""}
                onValueChange={(value) =>
                  handleJobPostingChange("reason_for_posting", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Reason for Hire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_position">New Position</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="reliver">Reliver</SelectItem>
                  <SelectItem value="other">Others, Please Specify</SelectItem>
                </SelectContent>
              </Select>
              {getJobError("reason_for_posting") && (
                <FieldError>{getJobError("reason_for_posting")}</FieldError>
              )}
            </Field>
            {formData.job_posting.reason_for_posting === "other" && (
              <Field>
                <FieldLabel>Please Specify *</FieldLabel>
                <Input
                  type="text"
                  value={formData.job_posting.other_reason_for_posting ?? ""}
                  onChange={(e) =>
                    handleJobPostingChange(
                      "other_reason_for_posting",
                      e.target.value,
                    )
                  }
                  placeholder="Enter reason for hire"
                />
              </Field>
            )}
          </FieldGroup>
        </FieldSet>
      </div>

      {/* Budget Range */}
      <div className="mb-8">
        <FieldSet>
          <FieldLegend>Budget Range</FieldLegend>
          <FieldDescription>
            Specify the minimum and maximum budget for this position.
          </FieldDescription>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Minimum</FieldLabel>
              <Input
                type="number"
                value={formData.job_posting.min_salary ?? ""}
                onChange={(e) =>
                  handleJobPostingChange(
                    "min_salary",
                    parseNullableNumber(e.target.value),
                  )
                }
                placeholder="Minimum salary"
              />
              {getJobError("min_salary") && (
                <FieldError>{getJobError("min_salary")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Maximum</FieldLabel>
              <Input
                type="number"
                value={formData.job_posting.max_salary ?? ""}
                onChange={(e) =>
                  handleJobPostingChange(
                    "max_salary",
                    parseNullableNumber(e.target.value),
                  )
                }
                placeholder="Maximum salary"
              />
              {getJobError("max_salary") && (
                <FieldError>{getJobError("max_salary")}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
};
