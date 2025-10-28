import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { JobDetailsFormData } from "../../types/application_form.types";
import { ChevronDownIcon, Upload } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";

interface JobDetailsSectionProps {
  formData: JobDetailsFormData;
  onInputChange: (field: string, value: string | number | File | null) => void;
  // errors?: {[key in keyof JobDetailsFormData]?: string | number | File | null};
}

export const JobDetailsSection = ({
  formData,
  onInputChange,
}: JobDetailsSectionProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>

      <FieldSet>
        <Field>
          <FieldLabel htmlFor="positionApplyingFor">
            Position Applying For
          </FieldLabel>
          <Input
            id="positionApplyingFor"
            value={formData.positionApplyingFor ?? ""}
            onChange={(e) =>
              onInputChange("positionApplyingFor", e.target.value)
            }
            placeholder="Enter position"
            disabled={true}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="expectedSalary">Expected Salary</FieldLabel>
          <Input
            id="expectedSalary"
            type="number"
            min={0}
            value={formData.expectedSalary ?? ""}
            onChange={(e) =>
              onInputChange("expectedSalary", Number(e.target.value))
            }
            placeholder="Enter expected salary"
          />
        </Field>

        <FieldSet>
          <FieldLabel>Willing to Work Onsite?</FieldLabel>
          <RadioGroup
            value={formData.willingToWorkOnsite}
            onValueChange={(value) =>
              onInputChange("willingToWorkOnsite", value)
            }
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="onsite-yes"
                className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
              />
              <Label
                htmlFor="onsite-yes"
                className="cursor-pointer font-normal"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="onsite-no"
                className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
              />
              <Label htmlFor="onsite-no" className="cursor-pointer font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
        </FieldSet>

        <Field>
          <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
            Upload Recent 2x2 Photo
          </FieldLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onInputChange("photo", e.target.files?.[0] || null)
              }
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">
                {formData.photo ? formData.photo.name : "Click to upload photo"}
              </span>
            </label>
          </div>
        </Field>

        <Field>
          <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
            Upload Medical Certificate (Optional)
          </FieldLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                onInputChange("medicalCertificate", e.target.files?.[0] || null)
              }
              className="hidden"
              id="medical-upload"
            />
            <label htmlFor="medical-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">
                {formData.medicalCertificate
                  ? formData.medicalCertificate.name
                  : "Click to upload certificate"}
              </span>
            </label>
          </div>
        </Field>

        <Field>
          <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
            Preferred Interview Schedule
          </FieldLabel>
          <div className="flex gap-2">
            {" "}
            <div className="space-y-2">
              <Label htmlFor="date-picker" className="px-1">
                Date
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-32 justify-between font-normal"
                  >
                    {formData.interviewSchedule
                      ? new Date(
                          formData.interviewSchedule
                        ).toLocaleDateString()
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
                      formData.interviewSchedule
                        ? new Date(formData.interviewSchedule)
                        : undefined
                    }
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        onInputChange("interviewSchedule", date.toISOString());
                        setOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </Field>
      </FieldSet>
    </div>
  );
};
