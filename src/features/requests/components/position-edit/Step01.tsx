import { useState } from "react";
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

export default function Step01() {
  const { clients } = useClient();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  return (
    <FieldGroup className="mt-10">
      <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Client</FieldLabel>
          <Select>
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
        </Field>

        <Field>
          <FieldLabel>Education Needed</FieldLabel>
          <Select>
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
        </Field>

        <Field>
          <FieldLabel htmlFor="job_title">Job Title</FieldLabel>
          <Input id="job_title" type="text" placeholder="Enter Job Title" />
        </Field>

        <Field>
          <FieldLabel>Experience Level</FieldLabel>
          <Select>
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
        </Field>

        <FieldGroup
          className={`grid grid-cols-1 ${
            selectedDepartment === "other" ? "md:grid-cols-2" : ""
          } gap-6`}
        >
          {" "}
          <Field>
            <FieldLabel>Department</FieldLabel>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
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
          {selectedDepartment === "other" && (
            <Field>
              <FieldLabel htmlFor="other_department">
                If Other, specify
              </FieldLabel>
              <Input
                id="other_department"
                type="text"
                placeholder="Specify Department"
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
          />
        </Field>

        <Field>
          <FieldLabel>Employment Type</FieldLabel>
          <Select>
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
                Select date
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar mode="single" captionLayout="dropdown" />
            </PopoverContent>
          </Popover>
        </Field>

        <Field>
          <FieldLabel>Work Setup</FieldLabel>
          <Select>
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

        <Field>
          <FieldLabel>Reason for Hire</FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Reason for Hire" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="working_site">Working Site</FieldLabel>
          <Input type="text" placeholder="Enter a location" />
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
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="max_budget">Maximum Budget</FieldLabel>
            <Input
              id="max_budget"
              type="number"
              min={0}
              placeholder="Enter maximum budget"
            />
          </Field>
        </FieldSet>
      </FieldSet>
    </FieldGroup>
  );
}
