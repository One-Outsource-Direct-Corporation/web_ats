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
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import type React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { PreviewInfo } from "../PreviewInfo";

interface Step02Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  step: number;
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
}

export const Step02 = ({
  goToNextStep,
  goToPreviousStep,
  step,
  formData,
  updateFormData,
}: Step02Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Job Details */}
        <div>
          <h2 className="text-blue-700 font-bold text-sm mb-4 border-l-4 border-blue-700 pl-2 uppercase">
            Job Details
          </h2>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Contract Type</FieldLabel>
              <Select
                value={formData.job_posting.employment_type ?? ""}
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      employment_type: value,
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Contract Type" />
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
              <FieldLabel>Work Setup</FieldLabel>
              <Select
                value={formData.job_posting.work_setup ?? ""}
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      work_setup: value,
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Work Arrangement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={formData.category ?? ""}
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="managerial">Managerial</SelectItem>
                  <SelectItem value="supervisory">Supervisory</SelectItem>
                  <SelectItem value="rank_and_file">Rank &amp; File</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Experience Level</FieldLabel>
              <Select
                value={formData.job_posting.experience_level ?? ""}
                onValueChange={(value) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      experience_level: value,
                    },
                  }))
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
            </Field>
            <Field>
              <FieldLabel>Working Site</FieldLabel>
              <Input
                placeholder="Enter Working Site"
                value={formData.job_posting.working_site ?? ""}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      working_site: e.target.value,
                    },
                  }))
                }
              />
            </Field>
            <div className="flex gap-5 items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Work Schedule From
                </label>
                <Input
                  type="time"
                  value={formData.work_schedule_from ?? ""}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      work_schedule_from: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Work Schedule To
                </label>
                <Input
                  type="time"
                  value={formData.work_schedule_to ?? ""}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      work_schedule_to: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </FieldGroup>
        </div>
        {/* Job Description */}
        <FieldGroup>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Job Description
          </h2>
          <Field>
            <RichTextEditor
              title="Description"
              value={formData.job_posting.description ?? ""}
              onChange={(value) =>
                updateFormData((prev) => ({
                  ...prev,
                  job_posting: {
                    ...prev.job_posting,
                    description: value,
                  },
                }))
              }
              placeholder="Enter job description"
            />
          </Field>
          <Field>
            <RichTextEditor
              title="Responsibilities"
              value={formData.job_posting.responsibilities ?? ""}
              onChange={(value) =>
                updateFormData((prev) => ({
                  ...prev,
                  job_posting: {
                    ...prev.job_posting,
                    responsibilities: value,
                  },
                }))
              }
              placeholder="Enter responsibilities"
            />
          </Field>
          <Field>
            <RichTextEditor
              title="Qualifications"
              value={formData.job_posting.qualifications ?? ""}
              onChange={(value) =>
                updateFormData((prev) => ({
                  ...prev,
                  job_posting: {
                    ...prev.job_posting,
                    qualifications: value,
                  },
                }))
              }
              placeholder="Enter qualifications"
            />
          </Field>
        </FieldGroup>
        {/* Salary Budget */}
        <div>
          <h2 className="text-blue-700 font-bold text-sm mb-4 border-l-4 border-blue-700 pl-2 uppercase">
            Salary Budget
          </h2>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Min Salary</FieldLabel>
              <Input
                type="number"
                placeholder="Minimum Salary"
                value={formData.job_posting.min_budget ?? 0}
                min={0}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      min_budget: Number(e.target.value),
                    },
                  }))
                }
              />
            </Field>
            <Field>
              <FieldLabel>Max Salary</FieldLabel>
              <Input
                type="number"
                placeholder="Maximum Salary"
                value={formData.job_posting.max_budget ?? 0}
                min={0}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    job_posting: {
                      ...prev.job_posting,
                      max_budget: Number(e.target.value),
                    },
                  }))
                }
              />
            </Field>
          </FieldGroup>
        </div>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            className="bg-[#0056D2] hover:bg-blue-700 text-white"
            onClick={goToNextStep}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <PreviewInfo step={step} formData={formData} />
    </div>
  );
};
