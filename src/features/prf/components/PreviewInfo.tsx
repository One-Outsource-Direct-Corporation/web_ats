import { useState } from "react";
import type { PRFFormData } from "../types/prf.types";
import formatName from "@/shared/utils/formatName";
import DOMPurify from "dompurify";
import { formatDepartmentName } from "@/shared/utils/formatDepartmentName";

interface PreviewInfoProps {
  step: number;
  formData: PRFFormData;
}

export const PreviewInfo = ({ step, formData }: PreviewInfoProps) => {
  const [showMore, setShowMore] = useState(false);

  const selectedHardware = Object.entries(formData.hardware_required)
    .filter(([, selected]) => selected)
    .map(([hardware]) => hardware.charAt(0).toUpperCase() + hardware.slice(1));

  const selectedSoftware = Object.entries(formData.software_required)
    .filter(([, selected]) => selected)
    .map(([software]) => software);

  function formatTimeAMPM(time: string) {
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  const displayWorkSchedule =
    formData.work_schedule_from && formData.work_schedule_to
      ? `${formatTimeAMPM(formData.work_schedule_from)} - ${formatTimeAMPM(
          formData.work_schedule_to
        )}`
      : "Not specified";

  return (
    <div className="border rounded-md p-4 bg-white text-sm h-fit sticky top-28 space-y-4">
      {step !== 1 && step !== 6 && (
        <>
          <div className="space-y-2">
            <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
              POSITION INFORMATION
            </h2>
            <p>
              <strong>Job Title:</strong>{" "}
              {formData.job_posting.job_title || "Not specified"}
            </p>
            <p>
              <strong>Target Start Date:</strong>{" "}
              {formData.job_posting.target_start_date || "Not specified"}
            </p>
            <p>
              <strong>Number of Vacancies:</strong>{" "}
              {formData.job_posting.number_of_vacancies || "Not specified"}
            </p>
            <p>
              <strong>Reason for Posting Position:</strong>{" "}
              {formData.job_posting.reason_for_posting === "Other"
                ? formData.job_posting.other_reason_for_posting
                : formData.job_posting.reason_for_posting || "Not specified"}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
              DEPARTMENT INFORMATION
            </h2>
            <p>
              <strong>Business Unit:</strong>{" "}
              {formData.business_unit?.toUpperCase() || "Not specified"}
            </p>
            <p>
              <strong>Department Name:</strong>{" "}
              {formatDepartmentName(formData.job_posting.department ?? "") ||
                "Not specified"}
            </p>
            <p>
              <strong>Immediate Supervisor:</strong>{" "}
              {formData.immediate_supervisor || "Not specified"}
            </p>
          </div>
          {step >= 2 && step < 6 && (
            <>
              <div className="space-y-2">
                <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
                  JOB DETAILS
                </h2>
                <p>
                  <strong>Employment Type:</strong>{" "}
                  {(formData.job_posting.employment_type &&
                    formatName(formData.job_posting.employment_type)) ||
                    "Not specified"}
                </p>
                <p>
                  <strong>Work Setup:</strong>{" "}
                  {(formData.job_posting.work_setup &&
                    formatName(formData.job_posting.work_setup)) ||
                    "Not specified"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {formatName(formData.category ?? "") || "Not specified"}
                </p>
                <p>
                  <strong>Experience Level:</strong>{" "}
                  {formatName(formData.job_posting.experience_level ?? "") ||
                    "Not specified"}
                </p>
                <p>
                  <strong>Working Site:</strong>{" "}
                  {formData.job_posting.working_site || "Not specified"}
                </p>
                <p>
                  <strong>Working Schedule:</strong> {displayWorkSchedule}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
                  JOB DESCRIPTION
                </h2>
              </div>
              {showMore && (
                <>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Description:</h3>
                    <div
                      className="text-gray-700 mb-4 preview-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          formData.job_posting?.description || ""
                        ),
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">
                      Key Responsibilities:
                    </h3>
                    <div
                      className="text-gray-700 mb-4 preview-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          formData.job_posting?.responsibilities || ""
                        ),
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Qualifications:</h3>
                    <div
                      className="text-gray-700 mb-4 preview-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          formData.job_posting?.qualifications || ""
                        ),
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
                      SALARY BUDGET
                    </h2>
                    <p className="font-semibold text-gray-800">
                      {formData.job_posting.min_budget} -{" "}
                      {formData.job_posting.max_budget}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
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
                            <li key={index}>{formatName(software)}</li>
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
                className="text-blue-700 text-sm mt-2 cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "▲ See less" : "▼ See more"}
              </div>
            </>
          )}
        </>
      )}
      {step === 6 && (
        <div className="space-y-6">
          <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
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
                      value={
                        formData.job_posting.min_budget &&
                        formData.job_posting.max_budget
                          ? `${formData.job_posting.min_budget} - ${formData.job_posting.max_budget}`
                          : `No budget allocated`
                      }
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
