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
import { useUsersByDepartment } from "../hooks/useUsersByDepartment";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import type { User } from "@/features/auth/types/auth.types";

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
  const { users, loading } = useUsersByDepartment();
  const handleInterviewLevelChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/^0+/, "");
    const parsedValue = Number.parseInt(value);

    updateFormData({
      interview_levels: Number.isNaN(parsedValue)
        ? 0
        : Math.max(0, parsedValue),
    });
  };

  const handleReasonForPostingChange = (value: string) => {
    updateFormData({
      reason_for_posting: value,
      other_reason_for_posting:
        value === "Other" ? "" : formData.other_reason_for_posting,
    });
  };

  const handleHiringManagerChange = (index: number, value: string) => {
    const updatedManagers = [...formData.hiring_managers];
    updatedManagers[index] = value;
    updateFormData({ hiring_managers: updatedManagers });
  };

  if (loading) return <LoadingComponent />;

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
                value={formData.job_title}
                onChange={(e) => updateFormData({ job_title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Target Start Date
              </label>
              <Input
                type="date"
                value={formData.target_start_date}
                onChange={(e) =>
                  updateFormData({ target_start_date: e.target.value })
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
                value={formData.number_of_vacancies}
                onChange={(e) =>
                  updateFormData({ number_of_vacancies: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Reason for Posting Position
              </label>
              <Select
                value={formData.reason_for_posting}
                onValueChange={handleReasonForPostingChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Position">New position</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Reliver">Reliver</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.reason_for_posting === "Other" && (
                <Input
                  className="w-full mt-2"
                  placeholder="Please specify"
                  value={formData.other_reason_for_posting}
                  onChange={(e) =>
                    updateFormData({ other_reason_for_posting: e.target.value })
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
                  checked={formData.business_unit === "OODC"}
                  onChange={(e) =>
                    updateFormData({ business_unit: e.target.value })
                  }
                />{" "}
                OODC
                <input
                  type="radio"
                  name="businessUnit"
                  value="OORS"
                  checked={formData.business_unit === "OORS"}
                  onChange={(e) =>
                    updateFormData({ business_unit: e.target.value })
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
                value={formData.department_name}
                onValueChange={(value) =>
                  updateFormData({ department_name: value })
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
                  <SelectItem value="Continuous Improvement">
                    Continuous Improvement
                  </SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
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
                  formData.interview_levels === 0
                    ? ""
                    : formData.interview_levels
                }
                onChange={handleInterviewLevelChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Immediate Supervisor
              </label>
              <Select
                value={formData.immediate_supervisor}
                onValueChange={(value) =>
                  updateFormData({ immediate_supervisor: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex: Ms. Hailey Adams" />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0 &&
                  users.some((usr: User) => usr.role === "supervisor") ? (
                    users
                      .filter((usr: User) => usr.role === "supervisor")
                      .map((usr: User) => (
                        <SelectItem key={usr.id} value={usr.id}>
                          {usr.first_name} {usr.last_name}
                        </SelectItem>
                      ))
                  ) : (
                    <>
                      <SelectItem value="No Supervisor">
                        No Supervisor
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 bg-gray-100 p-3 font-medium text-sm text-gray-700 border border-gray-200 rounded-t-md">
              <div>LEVELS OF INTERVIEW</div>
              <div>HIRING MANAGERS</div>
            </div>
            {Array.from({ length: formData.interview_levels }, (_, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4 items-center border-b border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Hiring Manager {i + 1}
                </div>
                <Select
                  value={formData.hiring_managers?.[i] || ""}
                  onValueChange={(value) => handleHiringManagerChange(i, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length > 0 &&
                    users.some((usr: User) => usr.role === "hiring_manager") ? (
                      users
                        .filter((usr: User) => usr.role === "hiring_manager")
                        .map((usr: User) => (
                          <SelectItem key={usr.id} value={usr.id}>
                            {usr.first_name} {usr.last_name}
                          </SelectItem>
                        ))
                    ) : (
                      <>
                        <SelectItem value="no-hiring-manager">
                          No Hiring Manager
                        </SelectItem>
                      </>
                    )}
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
