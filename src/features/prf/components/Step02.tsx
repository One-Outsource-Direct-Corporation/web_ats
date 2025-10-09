import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import type { PRFData } from "../types/prfTypes";
import { PreviewInfo } from "./PreviewInfo";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";

interface Step02Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  step: number;
  formData: PRFData;
  updateFormData: (updates: Partial<PRFData>) => void;
}

export const Step02: React.FC<Step02Props> = ({
  goToNextStep,
  goToPreviousStep,
  step,
  formData,
  updateFormData,
}) => {
  // Logic for handling work schedule
  const handleFromTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateFormData({ work_schedule_from: e.target.value });
  const handleToTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateFormData({ work_schedule_to: e.target.value });

  const handleSalaryRangeToggle = () =>
    updateFormData({ is_salary_range: !formData.is_salary_range });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Job Details */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              value={formData.employment_type}
              onValueChange={(value) =>
                updateFormData({ employment_type: value })
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
            <Select
              value={formData.work_setup}
              onValueChange={(value) => updateFormData({ work_setup: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Work Arrangement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onsite">Onsite</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Category
              </label>
              <Input
                placeholder="Enter Category"
                value={formData.category}
                onChange={(e) => updateFormData({ category: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Position
              </label>
              <Input
                placeholder="Enter Position"
                value={formData.position}
                onChange={(e) => updateFormData({ position: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Working Site
              </label>
              <Input
                placeholder="Enter Working Site"
                value={formData.working_site}
                onChange={(e) =>
                  updateFormData({ working_site: e.target.value })
                }
              />
            </div>
            <div className="flex gap-5 items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Work Schedule From
                </label>
                <Input
                  type="time"
                  value={formData.work_schedule_from}
                  onChange={handleFromTimeChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Work Schedule To
                </label>
                <Input
                  type="time"
                  value={formData.work_schedule_to}
                  onChange={handleToTimeChange}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Job Description */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Job Description
          </h2>
          <div>
            <RichTextEditor
              title="Description"
              value={formData.description}
              onChange={(value) => updateFormData({ description: value })}
              placeholder="Enter job description"
            />
          </div>
          <div>
            <RichTextEditor
              title="Responsibilities"
              value={formData.responsibilities}
              onChange={(value) => updateFormData({ responsibilities: value })}
              placeholder="Enter responsibilities"
            />
          </div>
          <div>
            <RichTextEditor
              title="Qualifications"
              value={formData.qualifications}
              onChange={(value) => updateFormData({ qualifications: value })}
              placeholder="Enter qualifications"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Non-Negotiables
            </label>
            <Textarea
              placeholder="Enter non-negotiables"
              value={formData.non_negotiables}
              onChange={(e) =>
                updateFormData({ non_negotiables: e.target.value })
              }
            />
          </div>
        </div>
        {/* Salary Budget */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Salary Budget
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Salary Budget
              </label>
              <Input
                type="number"
                placeholder="Enter Salary Budget"
                value={formData.salary_budget}
                onChange={(e) =>
                  updateFormData({ salary_budget: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_salary_range}
                onChange={handleSalaryRangeToggle}
                id="salaryRangeToggle"
              />
              <label htmlFor="salaryRangeToggle" className="text-sm">
                Is Salary Range?
              </label>
            </div>
            {formData.is_salary_range && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Min Salary
                  </label>
                  <Input
                    type="number"
                    placeholder="Minimum Salary"
                    value={formData.min_salary}
                    onChange={(e) =>
                      updateFormData({ min_salary: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Max Salary
                  </label>
                  <Input
                    type="number"
                    placeholder="Maximum Salary"
                    value={formData.max_salary}
                    onChange={(e) =>
                      updateFormData({ max_salary: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            &larr; Previous
          </Button>
          <Button
            className="bg-[#0056D2] hover:bg-blue-700 text-white"
            onClick={goToNextStep}
          >
            Next &rarr;
          </Button>
        </div>
      </div>
      <PreviewInfo step={step} formData={formData} />
    </div>
  );
};
