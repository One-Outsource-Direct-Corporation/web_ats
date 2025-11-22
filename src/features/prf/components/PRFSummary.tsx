import { formatDate, formatTime } from "@/shared/utils/formatDate";
import type { PRFFormData } from "../types/prf.types";
import { formatDepartmentName } from "@/shared/utils/formatDepartmentName";
import formatName from "@/shared/utils/formatName";
import formatMoney from "@/shared/utils/formatMoney";
import DOMPurify from "dompurify";
import {
  Building2,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Monitor,
  Code,
  FileText,
  Target,
} from "lucide-react";

interface PRFSummaryProps {
  formData: PRFFormData;
}

export default function PRFSummary({ formData }: PRFSummaryProps) {
  const selectedHardware = Object.entries(formData.hardware_required)
    .filter(([, selected]) => selected)
    .map(([hardware]) => formatName(hardware));

  const selectedSoftware = Object.entries(formData.software_required)
    .filter(([, selected]) => selected)
    .map(([software]) => formatName(software));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Position Request Summary
        </h2>
        <p className="text-blue-100 mt-1">
          Review your position request details before submission
        </p>
      </div>

      {/* Position & Department Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Position Information
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Job Title</span>
              <span className="text-gray-900">
                {formData.job_posting.job_title}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Target Start Date
              </span>
              <span className="text-gray-900">
                {formatDate(formData.job_posting.target_start_date || "")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Vacancies</span>
              <span className="text-gray-900">
                {formData.job_posting.number_of_vacancies}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">
                Reason for Posting
              </span>
              <span className="text-gray-900 text-right max-w-xs">
                {formData.job_posting.reason_for_posting === "Other"
                  ? formData.job_posting.other_reason_for_posting
                  : formData.job_posting.reason_for_posting}
              </span>
            </div>
          </div>
        </div>

        {/* Department Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Department Information
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Business Unit</span>
              <span className="text-gray-900">
                {formData.business_unit?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Department</span>
              <span className="text-gray-900">
                {formatDepartmentName(
                  formData.job_posting.department_name ?? ""
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Supervisor</span>
              <span className="text-gray-900">
                {formData.immediate_supervisor
                  ? formData.immediate_supervisor_display?.full_name
                  : "Not specified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-1">
              Employment Type
            </div>
            <div className="text-gray-900">
              {formatName(formData.job_posting.employment_type ?? "")}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-1">
              Work Setup
            </div>
            <div className="text-gray-900">
              {formatName(formData.job_posting.work_setup ?? "")}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-1">
              Category
            </div>
            <div className="text-gray-900">
              {formatName(formData.category ?? "")}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-1">
              Experience Level
            </div>
            <div className="text-gray-900">
              {formatName(formData.job_posting.experience_level ?? "")}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-1">
              Working Site
            </div>
            <div className="text-gray-900 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {formData.job_posting.working_site}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-1">
              Work Schedule
            </div>
            <div className="text-gray-900 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(
                formData.work_schedule_from ?? "",
                formData.work_schedule_to ?? ""
              ) || "Not specified"}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Job Description
          </h3>
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <div
              className="text-gray-700 text-sm leading-relaxed preview-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  formData.job_posting?.description || ""
                ),
              }}
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Responsibilities</h4>
            <div
              className="text-gray-700 text-sm leading-relaxed preview-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  formData.job_posting?.responsibilities || ""
                ),
              }}
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Qualifications</h4>
            <div
              className="text-gray-700 text-sm leading-relaxed preview-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  formData.job_posting?.qualifications || ""
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Salary & Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Salary Budget */}
        <div className="bg-green-50 rounded-lg border border-gray-200 p-6 shadow-sm ">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Budget Allocation
            </h3>
          </div>
          <div className="rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {formatMoney(formData.job_posting.min_salary ?? 0)} -{" "}
                {formatMoney(formData.job_posting.max_salary ?? 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Asset Request */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Asset Requirements
            </h3>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">Hardware</span>
              </div>
              <div className="text-gray-700">
                {selectedHardware.length > 0
                  ? selectedHardware.join(", ")
                  : "None specified"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">Software</span>
              </div>
              <div className="text-gray-700">
                {selectedSoftware.length > 0
                  ? selectedSoftware.join(", ")
                  : "None specified"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
