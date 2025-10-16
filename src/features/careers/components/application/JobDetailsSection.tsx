import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { JobDetailsFormData } from "../../types/applicationForm";
import { ChevronDownIcon, Upload } from "lucide-react";
import type { ApplicationForm } from "../../types/job";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

interface JobDetailsSectionProps {
  data: JobDetailsFormData;
  onChange: (field: string, value: string | File | null) => void;
  applicationForm: ApplicationForm;
  errors?: Record<string, string>;
}

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  data,
  onChange,
  applicationForm,
  errors = {},
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>

      <div className="space-y-6">
        {/* Position Applying For */}
        <div className="space-y-2">
          <Label htmlFor="positionApplyingFor">Position Applying For</Label>
          <Input
            id="positionApplyingFor"
            value={data.positionApplyingFor}
            onChange={(e) => onChange("positionApplyingFor", e.target.value)}
            placeholder="Enter position"
            disabled={true}
          />
        </div>

        {/* Expected Salary */}
        {applicationForm.expected_salary !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected Salary</Label>
            <Input
              id="expectedSalary"
              value={data.expectedSalary}
              onChange={(e) => onChange("expectedSalary", e.target.value)}
              placeholder="Enter expected salary"
              required={applicationForm.expected_salary === "required"}
            />
            {errors.expectedSalary && (
              <p className="text-sm text-red-600">{errors.expectedSalary}</p>
            )}
          </div>
        )}

        {/* Willing to Work Onsite */}
        {applicationForm?.willing_to_work_onsite !== "disabled" && (
          <div className="space-y-2">
            <Label>Willing to Work Onsite?</Label>
            <RadioGroup
              value={data.willingToWorkOnsite}
              onValueChange={(value) => onChange("willingToWorkOnsite", value)}
              className="flex gap-4 mt-2"
              required={applicationForm.willing_to_work_onsite === "required"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="onsite-yes" />
                <Label
                  htmlFor="onsite-yes"
                  className="cursor-pointer font-normal"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="onsite-no" />
                <Label
                  htmlFor="onsite-no"
                  className="cursor-pointer font-normal"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
            {errors.willingToWorkOnsite && (
              <p className="text-sm text-red-600">
                {errors.willingToWorkOnsite}
              </p>
            )}
          </div>
        )}

        {/* Photo Upload */}
        {applicationForm?.photo_2x2 !== "disabled" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload Recent 2x2 Photo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onChange("photo", e.target.files?.[0] || null)}
                className="hidden"
                id="photo-upload"
                required={applicationForm.photo_2x2 === "required"}
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {data.photo ? data.photo.name : "Click to upload photo"}
                </span>
              </label>
            </div>
            {errors.photo && (
              <p className="text-sm text-red-600">{errors.photo}</p>
            )}
          </div>
        )}

        {/* Medical Certificate */}
        {applicationForm?.upload_med_cert !== "disabled" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload Medical Certificate (Optional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  onChange("medicalCertificate", e.target.files?.[0] || null)
                }
                className="hidden"
                id="medical-upload"
                required={applicationForm.upload_med_cert === "required"}
              />
              <label htmlFor="medical-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {data.medicalCertificate
                    ? data.medicalCertificate.name
                    : "Click to upload certificate"}
                </span>
              </label>
            </div>
            {errors.medicalCertificate && (
              <p className="text-sm text-red-600">
                {errors.medicalCertificate}
              </p>
            )}
          </div>
        )}

        {/* Interview Schedule */}

        {applicationForm?.preferred_interview_schedule !== "disabled" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Preferred Interview Schedule
            </Label>
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
                      {data.interviewSchedule
                        ? new Date(data.interviewSchedule).toLocaleDateString()
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
                        data.interviewSchedule
                          ? new Date(data.interviewSchedule)
                          : undefined
                      }
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          onChange("interviewSchedule", date.toISOString());
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
          </div>
        )}
      </div>
    </div>
  );
};
