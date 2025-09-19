import React from "react";
import { Button } from "@/shared/components/ui/button";
import type { FormData } from "../types/prfTypes";
import { PreviewInfo } from "./PreviewInfo";

interface Step04Props {
  goToPreviousStep: () => void;
  step: number;
  formData: FormData;
  handleSubmit: () => void;
}

export const Step04: React.FC<Step04Props> = ({
  goToPreviousStep,
  step,
  formData,
  handleSubmit,
}) => {
  // Preview all entered data and submit
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 text-gray-800">
      <div className="lg:col-span-2 space-y-10">
        <h2 className="text-[#0056D2] font-bold text-lg mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
          Review Your Request
        </h2>
        <div className="space-y-6">
          {/* Position & Department Info */}
          <div>
            <h3 className="font-semibold text-md mb-2">Position Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Job Title:</span>{" "}
                {formData.jobTitle}
              </div>
              <div>
                <span className="font-medium">Target Start Date:</span>{" "}
                {formData.targetStartDate}
              </div>
              <div>
                <span className="font-medium">No. of Vacancies:</span>{" "}
                {formData.numberOfVacancies}
              </div>
              <div>
                <span className="font-medium">Reason for Posting:</span>{" "}
                {formData.reasonForPosting}{" "}
                {formData.reasonForPosting === "Other" &&
                  `(${formData.otherReasonForPosting})`}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-md mb-2">
              Department Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Business Unit:</span>{" "}
                {formData.businessUnit}
              </div>
              <div>
                <span className="font-medium">Department Name:</span>{" "}
                {formData.departmentName}
              </div>
              <div>
                <span className="font-medium">Immediate Supervisor:</span>{" "}
                {formData.immediateSupervisor}
              </div>
              <div>
                <span className="font-medium">Interview Levels:</span>{" "}
                {formData.interviewLevels}
              </div>
            </div>
          </div>
          {/* Job Details */}
          <div>
            <h3 className="font-semibold text-md mb-2">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Contract Type:</span>{" "}
                {formData.contractType}
              </div>
              <div>
                <span className="font-medium">Work Arrangement:</span>{" "}
                {formData.workArrangement}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {formData.category}
              </div>
              <div>
                <span className="font-medium">Position:</span>{" "}
                {formData.position}
              </div>
              <div>
                <span className="font-medium">Working Site:</span>{" "}
                {formData.workingSite}
              </div>
              <div>
                <span className="font-medium">Work Schedule:</span>{" "}
                {formData.workScheduleFrom} - {formData.workScheduleTo}
              </div>
            </div>
          </div>
          {/* Job Description */}
          <div>
            <h3 className="font-semibold text-md mb-2">Job Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Description:</span>{" "}
                {formData.jobDescription}
              </div>
              <div>
                <span className="font-medium">Responsibilities:</span>{" "}
                {formData.responsibilities}
              </div>
              <div>
                <span className="font-medium">Qualifications:</span>{" "}
                {formData.qualifications}
              </div>
              <div>
                <span className="font-medium">Non-Negotiables:</span>{" "}
                {formData.nonNegotiables}
              </div>
            </div>
          </div>
          {/* Salary Budget */}
          <div>
            <h3 className="font-semibold text-md mb-2">Salary Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Budget:</span>{" "}
                {formData.salaryBudget}
              </div>
              <div>
                <span className="font-medium">Is Salary Range:</span>{" "}
                {formData.isSalaryRange ? "Yes" : "No"}
              </div>
              {formData.isSalaryRange && (
                <>
                  <div>
                    <span className="font-medium">Min Salary:</span>{" "}
                    {formData.minSalary}
                  </div>
                  <div>
                    <span className="font-medium">Max Salary:</span>{" "}
                    {formData.maxSalary}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Assessments */}
          <div>
            <h3 className="font-semibold text-md mb-2">Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Required:</span>{" "}
                {formData.assessmentRequired}
              </div>
              <div>
                <span className="font-medium">Types:</span>{" "}
                {Object.entries(formData.assessmentTypes)
                  .filter(([_, v]) => v)
                  .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                  .join(", ")}
              </div>
              {formData.otherAssessment && (
                <div>
                  <span className="font-medium">Other Assessment:</span>{" "}
                  {formData.otherAssessment}
                </div>
              )}
            </div>
          </div>
          {/* Asset Request */}
          <div>
            <h3 className="font-semibold text-md mb-2">Asset Request</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Hardware:</span>{" "}
                {Object.entries(formData.hardwareRequired)
                  .filter(([_, v]) => v)
                  .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                  .join(", ")}
              </div>
              <div>
                <span className="font-medium">Software:</span>{" "}
                {Object.entries(formData.softwareRequired)
                  .filter(([_, v]) => v)
                  .map(([k]) => k)
                  .join(", ")}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            &larr; Previous
          </Button>
          <Button
            className="bg-[#0056D2] hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
      <PreviewInfo step={step} formData={formData} />
    </div>
  );
};
