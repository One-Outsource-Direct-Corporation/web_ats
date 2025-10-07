import type { CreatePositionFormData } from "../../../types/createPosition";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldLegend,
  FieldDescription,
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
import useClient from "@/features/positions/hooks/create-position/useClient";

interface BasicDetailsFormProps {
  formData: CreatePositionFormData;
  onInputChange: (field: string, value: string) => void;
}

export const BasicDetailsForm = ({
  formData,
  onInputChange,
}: BasicDetailsFormProps) => {
  const { clients, loading, error } = useClient();
  return (
    <div>
      {/* Basic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Client *</FieldLabel>
              <Select onValueChange={(value) => onInputChange("client", value)}>
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
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Job Title *</FieldLabel>
              <Input
                type="text"
                value={formData.job_title}
                onChange={(e) => onInputChange("job_title", e.target.value)}
                placeholder="Enter job title"
              />
            </Field>
            <Field>
              <FieldLabel>Department *</FieldLabel>
              <Select
                onValueChange={(value) => onInputChange("department", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Employment Type *</FieldLabel>
              <Select
                onValueChange={(value) =>
                  onInputChange("employment_type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Work Setup *</FieldLabel>
              <Select
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
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Education Needed *</FieldLabel>
              <Select
                onValueChange={(value) =>
                  onInputChange("education_level", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="associate_degree">
                    Associate's Degree
                  </SelectItem>
                  <SelectItem value="bachelor_degree">
                    Bachelor's Degree
                  </SelectItem>
                  <SelectItem value="master_degree">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Experience Level *</FieldLabel>
              <Select
                onValueChange={(value) =>
                  onInputChange("experience_level", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry_level">Entry Level</SelectItem>
                  <SelectItem value="mid_level">Mid Level</SelectItem>
                  <SelectItem value="senior_level">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Headcounts Needed *</FieldLabel>
              <Input
                type="number"
                value={formData.headcount}
                onChange={(e) => onInputChange("headcount", e.target.value)}
                placeholder="Enter number of positions"
              />
            </Field>
            <Field>
              <FieldLabel>Date Needed *</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    // data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                    {formData.date_needed
                      ? new Date(formData.date_needed).toLocaleDateString(
                          "en-PH",
                          {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                          }
                        )
                      : "Pick a date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formData.date_needed
                        ? new Date(formData.date_needed)
                        : new Date()
                    }
                    onSelect={(date) =>
                      onInputChange(
                        "date_needed",
                        date ? date.toLocaleDateString("en-PH") : ""
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel>Reason for Hire *</FieldLabel>
              <Select
                onValueChange={(value) =>
                  onInputChange("reason_for_hiring", value)
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
            </Field>
            {formData.reason_for_hiring === "others" && (
              <Field>
                <FieldLabel>Please Specify *</FieldLabel>
                <Input
                  type="text"
                  value={formData.other_reason_for_hiring}
                  onChange={(e) =>
                    onInputChange("other_reason_for_hiring", e.target.value)
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
