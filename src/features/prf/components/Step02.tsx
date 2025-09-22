import React from "react";
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
import type { FormData } from "../types/prfTypes";
import { PreviewInfo } from "./PreviewInfo";

interface Step02Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  step: number;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
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
    updateFormData({ workScheduleFrom: e.target.value });
  const handleToTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateFormData({ workScheduleTo: e.target.value });

  const handleSalaryRangeToggle = () =>
    updateFormData({ isSalaryRange: !formData.isSalaryRange });

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
              value={formData.contractType}
              onValueChange={(value) => updateFormData({ contractType: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Contract Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Probationary">Probationary</SelectItem>
                <SelectItem value="Project-based">Project-based</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={formData.workArrangement}
              onValueChange={(value) =>
                updateFormData({ workArrangement: value })
              }
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
                value={formData.workingSite}
                onChange={(e) =>
                  updateFormData({ workingSite: e.target.value })
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
                  value={formData.workScheduleFrom}
                  onChange={handleFromTimeChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Work Schedule To
                </label>
                <Input
                  type="time"
                  value={formData.workScheduleTo}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Description
              </label>
              <Textarea
                placeholder="Enter job description"
                value={formData.jobDescription}
                onChange={(e) =>
                  updateFormData({ jobDescription: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Responsibilities
              </label>
              <Textarea
                placeholder="Enter responsibilities"
                value={formData.responsibilities}
                onChange={(e) =>
                  updateFormData({ responsibilities: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Qualifications
              </label>
              <Textarea
                placeholder="Enter qualifications"
                value={formData.qualifications}
                onChange={(e) =>
                  updateFormData({ qualifications: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Non-Negotiables
              </label>
              <Textarea
                placeholder="Enter non-negotiables"
                value={formData.nonNegotiables}
                onChange={(e) =>
                  updateFormData({ nonNegotiables: e.target.value })
                }
              />
            </div>
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
                value={formData.salaryBudget}
                onChange={(e) =>
                  updateFormData({ salaryBudget: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isSalaryRange}
                onChange={handleSalaryRangeToggle}
                id="salaryRangeToggle"
              />
              <label htmlFor="salaryRangeToggle" className="text-sm">
                Is Salary Range?
              </label>
            </div>
            {formData.isSalaryRange && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Min Salary
                  </label>
                  <Input
                    type="number"
                    placeholder="Minimum Salary"
                    value={formData.minSalary}
                    onChange={(e) =>
                      updateFormData({ minSalary: e.target.value })
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
                    value={formData.maxSalary}
                    onChange={(e) =>
                      updateFormData({ maxSalary: e.target.value })
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
