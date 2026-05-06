import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { JobDetailsFormData } from "../../types/application_form.types";
import type { CandidateDetailsFile } from "@/features/candidate/services/candidateProfile.service";
import { Plus, Trash2, Upload, Eye, X, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface JobDetailsSectionProps {
  formData: JobDetailsFormData;
  onInputChange: (
    field: string,
    value: string | string[] | number | File | null,
  ) => void;
  applicationForm: ApplicationFormBase;
  profilePhoto?: CandidateDetailsFile | null;
  profileMedicalCertificate?: CandidateDetailsFile | null;
}

const MAX_INTERVIEW_SCHEDULE_OPTIONS = 3;

const formatDateForInput = (dateValue: Date): string => {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTimeForInput = (dateValue: Date): string => {
  const hours = String(dateValue.getHours()).padStart(2, "0");
  const minutes = String(dateValue.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const toLocalDateInputValue = (isoDateTime: string): string => {
  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return formatDateForInput(parsed);
};

const toLocalTimeInputValue = (isoDateTime: string): string => {
  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return formatTimeForInput(parsed);
};

const buildIsoDateTime = (dateValue: string, timeValue: string): string => {
  const parsed = new Date(`${dateValue}T${timeValue}:00`);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString();
};

const createDefaultInterviewSchedule = (): string => {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1);
  defaultDate.setHours(9, 0, 0, 0);
  return defaultDate.toISOString();
};

export const JobDetailsSection = ({
  formData,
  onInputChange,
  applicationForm,
  profilePhoto,
  profileMedicalCertificate,
}: JobDetailsSectionProps) => {
  const isScheduleDisabled =
    applicationForm.preferred_interview_schedule === "disabled";
  const isScheduleRequired =
    applicationForm.preferred_interview_schedule === "required";

  const handleAddScheduleOption = () => {
    if (isScheduleDisabled) {
      return;
    }

    if (formData.interviewSchedule.length >= MAX_INTERVIEW_SCHEDULE_OPTIONS) {
      return;
    }

    onInputChange("interviewSchedule", [
      ...formData.interviewSchedule,
      createDefaultInterviewSchedule(),
    ]);
  };

  const handleRemoveScheduleOption = (indexToRemove: number) => {
    if (isScheduleDisabled || formData.interviewSchedule.length <= 1) {
      return;
    }

    onInputChange(
      "interviewSchedule",
      formData.interviewSchedule.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleScheduleDateChange = (index: number, nextDate: string) => {
    if (isScheduleDisabled || !nextDate) {
      return;
    }

    const nextSchedule = [...formData.interviewSchedule];
    const currentTime = toLocalTimeInputValue(nextSchedule[index]) || "09:00";
    const nextIsoDateTime = buildIsoDateTime(nextDate, currentTime);
    if (!nextIsoDateTime) {
      return;
    }

    nextSchedule[index] = nextIsoDateTime;
    onInputChange("interviewSchedule", nextSchedule);
  };

  const handleScheduleTimeChange = (index: number, nextTime: string) => {
    if (isScheduleDisabled || !nextTime) {
      return;
    }

    const nextSchedule = [...formData.interviewSchedule];
    const existingDate = toLocalDateInputValue(nextSchedule[index]);
    const baseDate = existingDate || formatDateForInput(new Date());
    const nextIsoDateTime = buildIsoDateTime(baseDate, nextTime);
    if (!nextIsoDateTime) {
      return;
    }

    nextSchedule[index] = nextIsoDateTime;
    onInputChange("interviewSchedule", nextSchedule);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>

      <FieldSet>
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
            disabled={applicationForm.expected_salary === "disabled"}
            required={applicationForm.expected_salary === "required"}
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
            disabled={applicationForm.willing_to_work_onsite === "disabled"}
            required={applicationForm.willing_to_work_onsite === "required"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="onsite-yes"
                className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
                disabled={applicationForm.willing_to_work_onsite === "disabled"}
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
                disabled={applicationForm.willing_to_work_onsite === "disabled"}
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
          {formData.photo ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-center mb-3">
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Photo preview"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate text-center mb-1">
                {formData.photo.name}
              </p>
              <p className="text-xs text-gray-500 text-center mb-3">New upload</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs text-gray-500 hover:text-red-500"
                onClick={() => onInputChange("photo", null)}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel and use profile photo
              </Button>
            </div>
          ) : profilePhoto ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-center mb-3">
                <img
                  src={profilePhoto.url}
                  alt="2x2 Photo"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate text-center mb-1">
                {profilePhoto.filename}
              </p>
              <p className="text-xs text-gray-500 text-center mb-3">From profile</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => window.open(profilePhoto.url, "_blank")}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <label
                  htmlFor="photo-upload-replace"
                  className="flex-1 text-xs h-8 flex items-center justify-center rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Replace
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onInputChange("photo", e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="photo-upload-replace"
                  disabled={applicationForm.photo_2x2 === "disabled"}
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onInputChange("photo", e.target.files?.[0] || null)
                }
                className="hidden"
                id="photo-upload"
                disabled={applicationForm.photo_2x2 === "disabled"}
                required={applicationForm.photo_2x2 === "required"}
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Click to upload photo</span>
              </label>
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
            Upload Medical Certificate (Optional)
          </FieldLabel>
          {formData.medicalCertificate ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{formData.medicalCertificate.name}</p>
                  <p className="text-xs text-gray-500">New upload</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs text-gray-500 hover:text-red-500"
                onClick={() => onInputChange("medicalCertificate", null)}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel and use profile certificate
              </Button>
            </div>
          ) : profileMedicalCertificate ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{profileMedicalCertificate.filename}</p>
                  <p className="text-xs text-gray-500">From profile</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => window.open(profileMedicalCertificate.url, "_blank")}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <label
                  htmlFor="medical-upload-replace"
                  className="flex-1 text-xs h-8 flex items-center justify-center rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Replace
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    onInputChange("medicalCertificate", e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="medical-upload-replace"
                  disabled={applicationForm.upload_med_cert === "disabled"}
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  onInputChange("medicalCertificate", e.target.files?.[0] || null)
                }
                className="hidden"
                id="medical-upload"
                disabled={applicationForm.upload_med_cert === "disabled"}
                required={applicationForm.upload_med_cert === "required"}
              />
              <label htmlFor="medical-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Click to upload certificate</span>
              </label>
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
            Preferred Interview Schedule
          </FieldLabel>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Add 1 to 3 preferred date and time options.
            </p>

            {formData.interviewSchedule.length === 0 && (
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600">
                No schedule options added yet.
              </div>
            )}

            {formData.interviewSchedule.map((scheduleOption, scheduleIndex) => (
              <div
                key={`${scheduleOption}-${scheduleIndex}`}
                className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <div className="space-y-1">
                  <Label
                    htmlFor={`interview-date-${scheduleIndex}`}
                    className="text-xs text-gray-600"
                  >
                    Date Option {scheduleIndex + 1}
                  </Label>
                  <Input
                    id={`interview-date-${scheduleIndex}`}
                    type="date"
                    value={toLocalDateInputValue(scheduleOption)}
                    onChange={(event) =>
                      handleScheduleDateChange(scheduleIndex, event.target.value)
                    }
                    disabled={isScheduleDisabled}
                    required={isScheduleRequired && scheduleIndex === 0}
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor={`interview-time-${scheduleIndex}`}
                    className="text-xs text-gray-600"
                  >
                    Time
                  </Label>
                  <Input
                    id={`interview-time-${scheduleIndex}`}
                    type="time"
                    value={toLocalTimeInputValue(scheduleOption)}
                    onChange={(event) =>
                      handleScheduleTimeChange(scheduleIndex, event.target.value)
                    }
                    disabled={isScheduleDisabled}
                    required={isScheduleRequired && scheduleIndex === 0}
                  />
                </div>

                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleRemoveScheduleOption(scheduleIndex)}
                    disabled={isScheduleDisabled || formData.interviewSchedule.length <= 1}
                    aria-label={`Remove schedule option ${scheduleIndex + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-600">
                {formData.interviewSchedule.length}/{MAX_INTERVIEW_SCHEDULE_OPTIONS} options
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddScheduleOption}
                disabled={
                  isScheduleDisabled ||
                  formData.interviewSchedule.length >=
                    MAX_INTERVIEW_SCHEDULE_OPTIONS
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </div>
        </Field>
      </FieldSet>
    </div>
  );
};
