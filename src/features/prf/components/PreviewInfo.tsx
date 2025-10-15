import React, { useState } from "react";
import type { PRF } from "../types/prfTypes";
import formatName from "@/shared/utils/formatName";

interface PreviewInfoProps {
  step: number;
  formData: PRF;
}

export const PreviewInfo: React.FC<PreviewInfoProps> = ({ step, formData }) => {
  const [showMore, setShowMore] = useState(false);

  const selectedAssessments = Object.entries(formData.assessment_types)
    .filter(([, selected]) => selected)
    .map(([type]) => {
      const typeMap: { [key: string]: string } = {
        technical: "Technical Test",
        language: "Language Proficiency Test",
        cognitive: "Cognitive Test",
        personality: "Personality Test",
        behavioral: "Behavioral Test",
        cultural: "Cultural Test",
      };
      return typeMap[type];
    });

  // Get selected hardware
  const selectedHardware = Object.entries(formData.hardware_required)
    .filter(([, selected]) => selected)
    .map(([hardware]) => hardware.charAt(0).toUpperCase() + hardware.slice(1));

  // Get selected software
  const selectedSoftware = Object.entries(formData.software_required)
    .filter(([, selected]) => selected)
    .map(([software]) => software);

  const displaySalary = formData.is_salary_range
    ? `${formData.min_salary || "N/A"} - ${formData.max_salary || "N/A"}`
    : formData.salary_budget || "Not specified";

  const displayWorkSchedule =
    formData.work_schedule_from && formData.work_schedule_to
      ? `${formData.work_schedule_from} - ${formData.work_schedule_to}`
      : "Not specified";

  return (
    <div className="border rounded-md p-4 bg-white text-sm h-fit sticky top-28 space-y-4">
      {step !== 4 && (
        <>
          <div className="space-y-2">
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
              POSITION INFORMATION
            </h2>
            <p>
              <strong>Job Title:</strong>{" "}
              {formData.job_title || "Not specified"}
            </p>
            <p>
              <strong>Target Start Date:</strong>{" "}
              {formData.target_start_date || "Not specified"}
            </p>
            <p>
              <strong>Number of Vacancies:</strong>{" "}
              {formData.number_of_vacancies || "Not specified"}
            </p>
            <p>
              <strong>Reason for Posting Position:</strong>{" "}
              {formData.reason_for_posting === "Other"
                ? formData.other_reason_for_posting
                : formData.reason_for_posting || "Not specified"}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
              DEPARTMENT INFORMATION
            </h2>
            <p>
              <strong>Business Unit:</strong>{" "}
              {formData.business_unit || "Not specified"}
            </p>
            <p>
              <strong>Levels of Interview:</strong> {formData.interview_levels}
            </p>
            <p>
              <strong>Department Name:</strong>{" "}
              {formData.department || "Not specified"}
            </p>
            <p>
              <strong>Immediate Supervisor:</strong>{" "}
              {formData.immediate_supervisor_display || "Not specified"}
            </p>
          </div>
          {step >= 2 && (
            <>
              <div className="space-y-2">
                <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                  JOB DETAILS
                </h2>
                <p>
                  <strong>Employment Type:</strong>{" "}
                  {(formData.employment_type &&
                    formatName(formData.employment_type)) ||
                    "Not specified"}
                </p>
                <p>
                  <strong>Work Setup:</strong>{" "}
                  {(formData.work_setup && formatName(formData.work_setup)) ||
                    "Not specified"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {formData.category || "Not specified"}
                </p>
                <p>
                  <strong>Subcategory:</strong>{" "}
                  {formData.position || "Not specified"}
                </p>
                <p>
                  <strong>Working Site:</strong>{" "}
                  {formData.working_site || "Not specified"}
                </p>
                <p>
                  <strong>Working Schedule:</strong> {displayWorkSchedule}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                  JOB DESCRIPTION
                </h2>
                <p>
                  {formData.description ||
                    "Job description not provided yet..."}
                </p>
              </div>
              {showMore && (
                <>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">
                      Key Responsibilities:
                    </h3>
                    <p className="text-sm">
                      {formData.responsibilities ||
                        "Responsibilities not specified yet..."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Qualifications:</h3>
                    <p className="text-sm">
                      {formData.qualifications ||
                        "Qualifications not specified yet..."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Non-Negotiables:</h3>
                    <p className="text-sm">
                      {formData.non_negotiables ||
                        "Non-negotiables not specified yet..."}
                    </p>
                  </div>
                  {step === 3 && (
                    <div className="space-y-2">
                      <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                        ASSESSMENTS
                      </h2>
                      <p>
                        <strong>Assessment Required:</strong>{" "}
                        {formData.assessment_required}
                      </p>
                      {selectedAssessments.length > 0 && (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedAssessments.map((assessment, index) => (
                            <li key={index}>{assessment}</li>
                          ))}
                          {formData.other_assessment && (
                            <li>{formData.other_assessment}</li>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                      SALARY BUDGET
                    </h2>
                    <p className="font-semibold text-gray-800">
                      {displaySalary}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                      ASSET REQUEST
                    </h2>
                    {selectedHardware.length > 0 && (
                      <>
                        <p className="font-semibold text-sm">
                          Hardware Required:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedHardware.map((hardware, index) => (
                            <li key={index}>{hardware}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedSoftware.length > 0 && (
                      <>
                        <p className="font-semibold text-sm mt-2">
                          Software Required:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedSoftware.map((software, index) => (
                            <li key={index}>{software}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedHardware.length === 0 &&
                      selectedSoftware.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No hardware or software specified.
                        </p>
                      )}
                  </div>
                </>
              )}
              <div
                className="text-[#0056D2] text-sm mt-2 cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "▲ See less" : "▼ See more"}
              </div>
            </>
          )}
        </>
      )}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
            APPROVAL
          </h2>
          {[1, 2, 3].map((stepNumber, i) => {
            const titles = [
              {
                title: "HR Manager Review",
                subtitle: "Initial review and budget allocation",
                label: "HR Manager",
              },
              {
                title: "Finance Approval",
                subtitle: "Budget verification",
                label: "Finance Manager",
              },
              {
                title: "Final Approval",
                subtitle: "Final approval before position opens",
                label: "General Manager",
              },
            ];
            const isLast = i === 2;
            const { title, subtitle, label } = titles[i];

            return (
              <div key={i} className="relative flex gap-4">
                {/* Left Timeline */}
                <div className="flex flex-col items-center w-6">
                  {/* Line */}
                  {!isLast && (
                    <div className="absolute top-6 left-[11px] h-full w-px bg-blue-200 z-0" />
                  )}
                  {/* Circle */}
                  <div className="relative z-10 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {stepNumber}
                  </div>
                </div>
                {/* Right Content */}
                <div className="border rounded-lg p-4 bg-white shadow space-y-4 flex-1">
                  {/* Header with title & buttons */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-gray-500">{subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-red-600 bg-red-100 px-3 py-1 text-xs rounded">
                        Reject
                      </button>
                      <button className="text-green-600 bg-green-100 px-3 py-1 text-xs rounded">
                        Approve
                      </button>
                    </div>
                  </div>
                  {/* Approver */}
                  <p className="text-sm text-gray-500">
                    <strong>{label}:</strong> Mr. Carlos Garcia
                  </p>
                  {/* Budget Allocation */}
                  <div>
                    <label className="text-sm font-semibold block mb-1">
                      Budget Allocation
                    </label>
                    <input
                      type="text"
                      value={displaySalary}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-500 bg-white"
                    />
                  </div>
                  {/* Comments */}
                  <div>
                    <label className="text-sm font-semibold block mb-1">
                      Comments
                    </label>
                    <textarea
                      rows={4}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-white resize-none"
                      defaultValue={
                        stepNumber === 1
                          ? "Approved. Please confirm final budget availability with Finance before proceeding with recruitment."
                          : "Add your review comments..."
                      }
                    />
                  </div>
                  {/* Edit Button */}
                  {stepNumber === 1 && (
                    <div>
                      <button className="px-3 py-1 text-xs rounded bg-gray-100 text-blue-600 hover:bg-gray-200">
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
