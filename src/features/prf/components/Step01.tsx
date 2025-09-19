import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import type { FormData } from "../types/prfTypes";
import { PreviewInfo } from "./PreviewInfo";

interface Step01Props {
  goToNextStep: () => void;
  step: number;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step01: React.FC<Step01Props> = ({
  goToNextStep,
  step,
  formData,
  updateFormData,
}) => {
  const handleInterviewLevelChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/^0+/, "");
    const parsedValue = Number.parseInt(value);
    updateFormData({
      interviewLevels: Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue),
    });
  };

  const handleReasonForPostingChange = (value: string) => {
    updateFormData({
      reasonForPosting: value,
      otherReasonForPosting:
        value === "Other" ? "" : formData.otherReasonForPosting,
    });
  };

  const handleHiringManagerChange = (index: number, value: string) => {
    const updatedManagers = [...formData.hiringManagers];
    updatedManagers[index] = value;
    updateFormData({ hiringManagers: updatedManagers });
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Position Information */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Position Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Job Title
              </label>
              <Input
                placeholder="Enter Job Title"
                value={formData.jobTitle}
                onChange={(e) => updateFormData({ jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Target Start Date
              </label>
              <Input
                type="date"
                value={formData.targetStartDate}
                onChange={(e) =>
                  updateFormData({ targetStartDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                No. of Vacancies
              </label>
              <Input
                type="number"
                placeholder="e.g. 3"
                value={formData.numberOfVacancies}
                onChange={(e) =>
                  updateFormData({ numberOfVacancies: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Reason for Posting Position
              </label>
              <Select
                value={formData.reasonForPosting}
                onValueChange={handleReasonForPostingChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New position">New position</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Reliver">Reliver</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.reasonForPosting === "Other" && (
                <Input
                  className="w-full mt-2"
                  placeholder="Please specify"
                  value={formData.otherReasonForPosting}
                  onChange={(e) =>
                    updateFormData({ otherReasonForPosting: e.target.value })
                  }
                />
              )}
            </div>
          </div>
        </div>
        {/* Department Information */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Department Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Business Unit
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="businessUnit"
                  value="OODC"
                  checked={formData.businessUnit === "OODC"}
                  onChange={(e) =>
                    updateFormData({ businessUnit: e.target.value })
                  }
                />{" "}
                OODC
                <input
                  type="radio"
                  name="businessUnit"
                  value="OORS"
                  checked={formData.businessUnit === "OORS"}
                  onChange={(e) =>
                    updateFormData({ businessUnit: e.target.value })
                  }
                />{" "}
                OORS
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Department Name
              </label>
              <Select
                value={formData.departmentName}
                onValueChange={(value) =>
                  updateFormData({ departmentName: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex: Information Technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Information Technology">
                    Information Technology
                  </SelectItem>
                  <SelectItem value="Human Resources">
                    Human Resources
                  </SelectItem>
                  <SelectItem value="Continuous Improvement Department">
                    Continuous Improvement Department
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Levels of Interview
              </label>
              <Input
                type="number"
                className="w-full"
                value={
                  formData.interviewLevels === 0 ? "" : formData.interviewLevels
                }
                onChange={handleInterviewLevelChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Immediate Supervisor
              </label>
              <Select
                value={formData.immediateSupervisor}
                onValueChange={(value) =>
                  updateFormData({ immediateSupervisor: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex: Ms. Hailey Adams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hailey Adams">Ms. Hailey Adams</SelectItem>
                  <SelectItem value="John Smith">Mr. John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 bg-gray-100 p-3 font-medium text-sm text-gray-700 border border-gray-200 rounded-t-md">
              <div>LEVELS OF INTERVIEW</div>
              <div>HIRING MANAGERS</div>
            </div>
            {Array.from({ length: formData.interviewLevels }, (_, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4 items-center border-b border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Hiring Manager {i + 1}
                </div>
                <Select
                  value={formData.hiringManagers?.[i] || ""}
                  onValueChange={(value) => handleHiringManagerChange(i, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager A">Manager A</SelectItem>
                    <SelectItem value="Manager B">Manager B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-10">
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
