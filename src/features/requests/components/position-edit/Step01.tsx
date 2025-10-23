import useClient from "@/features/positions/hooks/create-position/useClient";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import type { JobPostingResponsePosition } from "@/features/jobs/types/jobTypes";
import { formatNameBySpace } from "@/shared/utils/formatName";

export default function Step01({
  formData,
  setFormData,
  errors,
}: {
  formData: JobPostingResponsePosition;
  setFormData: (data: JobPostingResponsePosition) => void;
  errors?: any;
}) {
  const { clients } = useClient();

  function handleChange(field: string, value: string | number | null) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  return (
    <FieldGroup className="mt-10">
      <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Client</FieldLabel>
          <Select
            value={formData.client?.toString()}
            onValueChange={(value) => handleChange("client", Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.client && (
            <p className="text-red-600 text-sm mt-1">{errors.client}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Education Needed</FieldLabel>
          <Select
            value={formData.education_level}
            onValueChange={(value) => handleChange("education_level", value)}
          >
            <SelectTrigger>
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
          {errors?.education_level && (
            <p className="text-red-600 text-sm mt-1">
              {errors.education_level}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="job_title">Job Title</FieldLabel>
          <Input
            id="job_title"
            type="text"
            placeholder="Enter Job Title"
            value={formData.job_title}
            onChange={(e) => handleChange("job_title", e.target.value)}
          />
          {errors?.job_title && (
            <p className="text-red-600 text-sm mt-1">{errors.job_title}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Experience Level</FieldLabel>
          <Select
            value={formData.experience_level}
            onValueChange={(value) => handleChange("experience_level", value)}
          >
            <SelectTrigger>
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
          {errors?.experience_level && (
            <p className="text-red-600 text-sm mt-1">
              {errors.experience_level}
            </p>
          )}
        </Field>

        <FieldGroup
          className={`grid grid-cols-1 ${
            formData.department_name === "other" ? "md:grid-cols-2" : ""
          } gap-6`}
        >
          {" "}
          <Field>
            <FieldLabel>Department</FieldLabel>
            <Select
              value={formData.department_name}
              onValueChange={(value) => handleChange("department_name", value)}
            >
              <SelectTrigger>
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
                <SelectItem value="operataions-isla">
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
                <SelectItem value="other">Other Department</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {formData.department_name === "other" && (
            <Field>
              <FieldLabel htmlFor="other_department">
                If Other, specify
              </FieldLabel>
              <Input
                id="other_department"
                type="text"
                placeholder="Specify Department"
                value={formData.department_name_other || ""}
                onChange={(e) =>
                  handleChange("department_name_other", e.target.value)
                }
              />
            </Field>
          )}
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="vacancies">Vacancies</FieldLabel>
          <Input
            id="vacancies"
            type="number"
            min={1}
            placeholder="Enter number of vacancies"
            value={formData.number_of_vacancies}
            onChange={(e) =>
              handleChange("number_of_vacancies", Number(e.target.value))
            }
          />
        </Field>

        <Field>
          <FieldLabel>Employment Type</FieldLabel>
          <Select
            value={formData.employment_type}
            onValueChange={(value) => handleChange("employment_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Employment Type" />
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

        <Field>
          <FieldLabel htmlFor="target_date">Target Start Date</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {formData.target_start_date || "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={
                  formData.target_start_date
                    ? new Date(formData.target_start_date)
                    : undefined
                }
                onSelect={(date) =>
                  handleChange(
                    "target_start_date",
                    date ? date.toISOString().split("T")[0] : null
                  )
                }
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field>
          <FieldLabel>Work Setup</FieldLabel>
          <Select
            value={formData.work_setup}
            onValueChange={(value) => handleChange("work_setup", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Work Setup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <FieldGroup
          className={`grid grid-cols-1 ${
            formData.reason_for_posting === "others" ? "md:grid-cols-2" : ""
          } gap-6`}
        >
          {" "}
          <Field>
            <FieldLabel>Reason for Hire</FieldLabel>
            <Select
              value={formData.reason_for_posting}
              onValueChange={(value) =>
                handleChange("reason_for_posting", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Reason for Hire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_position">New position</SelectItem>
                <SelectItem value="replacement">Replacement</SelectItem>
                <SelectItem value="reliver">Reliver</SelectItem>
                <SelectItem value="other">Others</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {formData.reason_for_posting === "other" && (
            <Field>
              <FieldLabel htmlFor="other_reason">If Other, specify</FieldLabel>
              <Input
                id="other_reason"
                type="text"
                placeholder="Specify Reason"
                value={formData.other_reason_for_posting || ""}
                onChange={(e) =>
                  handleChange("other_reason_for_posting", e.target.value)
                }
              />
            </Field>
          )}
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="working_site">Working Site</FieldLabel>
          <Input
            type="text"
            placeholder="Enter a location"
            value={formData.working_site}
            onChange={(e) => handleChange("working_site", e.target.value)}
          />
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Budget Range</FieldLegend>
        <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="min_budget">Minimum Budget</FieldLabel>
            <Input
              id="min_budget"
              type="number"
              min={0}
              placeholder="Enter minimum budget"
              value={formData.min_salary}
              onChange={(e) =>
                handleChange("min_salary", Number(e.target.value))
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="max_budget">Maximum Budget</FieldLabel>
            <Input
              id="max_budget"
              type="number"
              min={0}
              placeholder="Enter maximum budget"
              value={formData.max_salary}
              onChange={(e) =>
                handleChange("max_salary", Number(e.target.value))
              }
            />
          </Field>
        </FieldSet>
      </FieldSet>
    </FieldGroup>
  );
}
