import type { PRFFormData } from "@/features/prf_2/types/PRFFormData.ts";
import { useState } from "react";
import formatName from "@/shared/utils/formatName.ts";
import { formatDate, formatTime } from "@/shared/utils/formatDate.ts";
import DOMPurify from "dompurify";

interface PRFSidebarPreview {
  step: number;
  formData: PRFFormData;
}

export default function PRFSidebarPreview({
  step,
  formData,
}: PRFSidebarPreview) {
  const [showMore, setShowMore] = useState<boolean>(false);

  const selectedHardware = Object.entries(formData.prf_input.hardware_required)
    .filter(([, selected]) => selected)
    .map(([hardware]) => hardware.charAt(0).toUpperCase() + hardware.slice(1));

  const selectedSoftware = Object.entries(formData.prf_input.software_required)
    .filter(([, selected]) => selected)
    .map(([software]) => software);

  return (
    <div className="border rounded-md p-4 bg-white text-sm h-fit sticky space-y-4">
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
          {formatDate(formData.job_posting.target_start_date) ||
            "Not specified"}
        </p>
        <p>
          <strong>Number of Vacancies:</strong>{" "}
          {formData.job_posting.number_of_vacancies || "Not specified"}
        </p>
        <p>
          <strong>Reason for Posting Position:</strong>{" "}
          {formData.job_posting.reason_for_posting === "Other"
            ? formData.job_posting.other_reason_for_posting
            : formatName(formData.job_posting.reason_for_posting) ||
              "Not specified"}
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
          DEPARTMENT INFORMATION
        </h2>
        <p>
          <strong>Business Unit:</strong>{" "}
          {formData.prf_input.business_unit?.toUpperCase() || "Not specified"}
        </p>
        <p>
          <strong>Department Name:</strong>{" "}
          {formData.job_posting.department_display || "Not specified"}
        </p>
        <p>
          <strong>Immediate Supervisor:</strong>{" "}
          {formData.prf_input.immediate_supervisor_display || "Not specified"}
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
              {formatName(formData.prf_input.category || "") || "Not specified"}
            </p>
            <p>
              <strong>Experience Level:</strong>{" "}
              {formatName(formData.job_posting.experience_level || "") ||
                "Not specified"}
            </p>
            <p>
              <strong>Working Site:</strong>{" "}
              {formData.job_posting.working_site || "Not specified"}
            </p>
            <p>
              <strong>Working Schedule:</strong>{" "}
              {formatTime(
                formData.job_posting.work_schedule_from || "",
                formData.job_posting.work_schedule_to || "",
              ) || "Not specified"}
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
                      formData.job_posting?.description || "",
                    ),
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Key Responsibilities:</h3>
                <div
                  className="text-gray-700 mb-4 preview-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      formData.job_posting?.responsibilities || "",
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
                      formData.job_posting?.qualifications || "",
                    ),
                  }}
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
                  SALARY BUDGET
                </h2>
                <p className="font-semibold text-gray-800">
                  {formData.job_posting.min_salary} -{" "}
                  {formData.job_posting.max_salary}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
                  ASSET REQUEST
                </h2>
                {selectedHardware.length > 0 && (
                  <>
                    <p className="font-semibold text-sm">Hardware Required:</p>
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
    </div>
  );
}
