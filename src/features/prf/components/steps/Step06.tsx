import { Button } from "@/shared/components/ui/button";
import type { PRFFormData } from "../../types/prf.types";
import formatName from "@/shared/utils/formatName";
import { formatDate, formatTime } from "@/shared/utils/formatDate";
import { ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify";
import { PreviewInfo } from "../PreviewInfo";
import { formatDepartmentName } from "@/shared/utils/formatDepartmentName";

interface Step06Props {
  goToPreviousStep: () => void;
  formData: PRFFormData;
  step: number;
  handleSubmit: () => void;
}

export const Step06 = ({
  goToPreviousStep,
  formData,
  step,
  handleSubmit,
}: Step06Props) => {
  // Preview all entered data and submit
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 text-gray-800">
      <div className="lg:col-span-2 space-y-10">
        <h2 className="text-blue-700 font-bold text-lg mb-4 border-l-4 border-blue-700 pl-2 uppercase">
          Review Your Request
        </h2>
        <div className="space-y-6">
          {/* Position & Department Info */}
          <div>
            <h3 className="font-semibold text-md mb-2 border-blue-700 text-blue-700 border-l-4 pl-2">
              Position Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Job Title:</span>{" "}
                {formData.job_posting.job_title}
              </div>
              <div>
                <span className="font-medium">Target Start Date:</span>{" "}
                {formatDate(
                  formData.job_posting.target_start_date
                    ? formData.job_posting.target_start_date
                    : ""
                )}
              </div>
              <div>
                <span className="font-medium">No. of Vacancies:</span>{" "}
                {formData.job_posting.number_of_vacancies}
              </div>
              <div>
                <span className="font-medium">Reason for Posting:</span>{" "}
                {formData.job_posting.reason_for_posting}{" "}
                {formData.job_posting.reason_for_posting === "Other" &&
                  `(${formData.job_posting.other_reason_for_posting})`}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-md mb-2 border-blue-700 text-blue-700 border-l-4 pl-2">
              Department Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Business Unit:</span>{" "}
                {formData.business_unit?.toUpperCase()}
              </div>
              <div>
                <span className="font-medium">Department Name:</span>{" "}
                {formatDepartmentName(
                  formData.job_posting.department_name ?? ""
                )}
              </div>
              <div>
                <span className="font-medium">Immediate Supervisor:</span>{" "}
                {formData.immediate_supervisor ?? "Not specified"}
              </div>
            </div>
          </div>
          {/* Job Details */}
          <div>
            <h3 className="font-semibold text-md mb-2 border-blue-700 text-blue-700 border-l-4 pl-2">
              Job Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Employment Type:</span>{" "}
                {formatName(formData.job_posting.employment_type ?? "")}
              </div>
              <div>
                <span className="font-medium">Work Setup:</span>{" "}
                {formatName(formData.job_posting.work_setup ?? "")}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {formatName(formData.category ?? "")}
              </div>
              <div>
                <span className="font-medium">Experience Level:</span>{" "}
                {formatName(formData.job_posting.experience_level ?? "")}
              </div>
              <div>
                <span className="font-medium">Working Site:</span>{" "}
                {formData.job_posting.working_site}
              </div>
              <div>
                <span className="font-medium">Work Schedule:</span>{" "}
                {formatTime(
                  formData.work_schedule_from ?? "",
                  formData.work_schedule_to ?? ""
                ) || "Not specified"}
              </div>
            </div>
          </div>
          {/* Job Description */}
          <div>
            <h3 className="font-semibold text-md mb-2 border-blue-700 text-blue-700 border-l-4 pl-2">
              Job Description
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Description:</span>{" "}
                <div
                  className="text-gray-700 mb-4 preview-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      formData.job_posting?.description || ""
                    ),
                  }}
                />
              </div>
              <div>
                <span className="font-medium">Responsibilities:</span>{" "}
                <div
                  className="text-gray-700 mb-4 preview-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      formData.job_posting?.responsibilities || ""
                    ),
                  }}
                />
              </div>
              <div>
                <span className="font-medium">Qualifications:</span>{" "}
                <div
                  className="text-gray-700 mb-4 preview-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      formData.job_posting?.qualifications || ""
                    ),
                  }}
                />
              </div>
            </div>
          </div>
          {/* Salary Budget */}
          <div>
            <h3 className="font-semibold text-md mb-2 border-blue-700 text-blue-700 border-l-4 pl-2">
              Salary Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Min Salary:</span>{" "}
                {formData.job_posting.min_salary}
              </div>
              <div>
                <span className="font-medium">Max Salary:</span>{" "}
                {formData.job_posting.max_salary}
              </div>
            </div>
          </div>
          {/* Asset Request */}
          <div>
            <h3 className="font-semibold text-md mb-2 border-blue-700 text-blue-700 border-l-4 pl-2">
              Asset Request
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Hardware:</span>{" "}
                {Object.entries(formData.hardware_required)
                  .filter(([_, v]) => v)
                  .map(([k]) => formatName(k))
                  .join(", ")}
              </div>
              <div>
                <span className="font-medium">Software:</span>{" "}
                {Object.entries(formData.software_required)
                  .filter(([_, v]) => v)
                  .map(([k]) => formatName(k))
                  .join(", ")}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
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
