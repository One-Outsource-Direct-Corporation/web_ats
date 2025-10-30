import type { CreatePositionFormData } from "../types/create_position.types";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import useClient from "@/features/positions-client/hooks/useClient";

interface BasicDetailsFormProps {
  formData: CreatePositionFormData;
  onInputChange: (field: string, value: any) => void;
  errorFields: any;
}

// To do: Optimize the function on onChange, it is laggy
// Lagged only if dev tools are open, primary issue is the Select component from ShadCN

export const BasicDetailsForm = ({
  formData,
  onInputChange,
  errorFields,
}: BasicDetailsFormProps) => {
  const { clients, loading, error } = useClient();
  console.log(formData.client);
  return (
    <div>
      {/* Basic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Client *</FieldLabel>
              <Select
                value={formData.client ? String(formData.client) : ""}
                onValueChange={(value) => onInputChange("client", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {loading && (
                    <SelectItem value="loading">Loading...</SelectItem>
                  )}
                  {error && (
                    <SelectItem value="error">Something went wrong!</SelectItem>
                  )}
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorFields?.client && (
                <FieldError>{errorFields.client[0]}</FieldError>
              )}
              <FieldError></FieldError>
            </Field>
            <Field>
              <FieldLabel>Job Title *</FieldLabel>
              <Input
                type="text"
                value={formData.job_title}
                onChange={(e) => onInputChange("job_title", e.target.value)}
                placeholder="Enter job title"
              />
              {errorFields?.job_posting?.job_title && (
                <FieldError>{errorFields.job_posting.job_title[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Department *</FieldLabel>
              <Select
                value={formData.department ?? ""}
                onValueChange={(value) => onInputChange("department", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Department</SelectItem>
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
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errorFields?.job_posting?.department_name && (
                <FieldError>
                  {errorFields.job_posting.department_name[0]}
                </FieldError>
              )}
            </Field>

            {formData.department === "other" && (
              <Field>
                <FieldLabel>Please Specify *</FieldLabel>
                <Input
                  type="text"
                  value={formData.other_department}
                  onChange={(e) =>
                    onInputChange("other_department", e.target.value)
                  }
                />
              </Field>
            )}

            <Field>
              <FieldLabel>Employment Type *</FieldLabel>
              <Select
                value={formData.employment_type ?? ""}
                onValueChange={(value) =>
                  onInputChange("employment_type", value)
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
              {errorFields?.job_posting?.employment_type && (
                <FieldError>
                  {errorFields.job_posting.employment_type[0]}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Work Setup *</FieldLabel>
              <Select
                value={formData.work_setup ?? ""}
                onValueChange={(value) => onInputChange("work_setup", value)}
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
              {errorFields?.job_posting?.work_setup && (
                <FieldError>{errorFields.job_posting.work_setup[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Working Site *</FieldLabel>
              <Input
                type="text"
                value={formData.working_site}
                onChange={(e) => onInputChange("working_site", e.target.value)}
                placeholder="Enter working site"
              />
              {errorFields?.job_posting?.working_site && (
                <FieldError>
                  {errorFields.job_posting.working_site[0]}
                </FieldError>
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
              {errorFields?.education_level && (
                <FieldError>{errorFields.education_level[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Experience Level *</FieldLabel>
              <Select
                value={formData.experience_level ?? ""}
                onValueChange={(value) =>
                  onInputChange("experience_level", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              {errorFields?.experience_level && (
                <FieldError>{errorFields.experience_level[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Headcounts Needed *</FieldLabel>
              <Input
                type="number"
                value={formData.headcount}
                onChange={(e) => onInputChange("headcount", e.target.value)}
                placeholder="Enter number of positions"
              />
              {errorFields?.headcount && (
                <FieldError>{errorFields.headcount[0]}</FieldError>
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
                    {formData.target_start_date || "Pick a date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formData.target_start_date
                        ? new Date(formData.target_start_date)
                        : new Date()
                    }
                    onSelect={(date) =>
                      onInputChange(
                        "target_start_date",
                        date ? date.toISOString().split("T")[0] : null
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
              {errorFields?.job_posting?.target_start_date && (
                <FieldError>
                  {errorFields.job_posting.target_start_date[0]}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Reason for Hire *</FieldLabel>
              <Select
                value={formData.reason_for_posting ?? ""}
                onValueChange={(value) =>
                  onInputChange("reason_for_posting", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Reason for Hire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_position">New Position</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="others">Others, Please Specify</SelectItem>
                </SelectContent>
              </Select>
              {errorFields?.job_posting?.reason_for_posting && (
                <FieldError>
                  {errorFields.job_posting.reason_for_posting[0]}
                </FieldError>
              )}
            </Field>
            {formData.reason_for_posting === "others" && (
              <Field>
                <FieldLabel>Please Specify *</FieldLabel>
                <Input
                  type="text"
                  value={formData.other_reason_for_posting}
                  onChange={(e) =>
                    onInputChange("other_reason_for_posting", e.target.value)
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
                value={formData.min_budget}
                onChange={(e) => onInputChange("min_budget", e.target.value)}
                placeholder="Minimum salary"
              />
            </Field>
            <Field>
              <FieldLabel>Maximum</FieldLabel>
              <Input
                type="number"
                value={formData.max_budget}
                onChange={(e) => onInputChange("max_budget", e.target.value)}
                placeholder="Maximum salary"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
};
