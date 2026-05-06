import React from "react";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type { PositionFormData } from "@/features/external_posting/types/externalPosting.types";
import formatName from "@/shared/utils/formatName";
import formatMoney from "@/shared/utils/formatMoney";
import { formatDate } from "@/shared/utils/formatDate";

interface PreviewModalProps {
  show: boolean;
  onClose: () => void;
  formData: PositionFormData;
  currentStep: number;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  show,
  onClose,
  formData,
  currentStep,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-600">
              Position Preview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {formData.job_posting.job_title || "Position Title"}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  {formatName(formData.job_posting.department_name ?? "")}
                </span>
                <span>
                  {formatName(formData.job_posting.employment_type ?? "")}
                </span>
                <span>{formatName(formData.job_posting.work_setup ?? "")}</span>
                <span>
                  {formatName(formData.job_posting.experience_level ?? "")}
                </span>
              </div>
            </div>

            {currentStep >= 2 && (
              <>
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">
                    Job Description
                  </h4>
                  <div
                    className="preview-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formData.job_posting.description || "",
                    }}
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">
                    Responsibilities
                  </h4>
                  <div
                    className="preview-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formData.job_posting.responsibilities || "",
                    }}
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">
                    Qualifications
                  </h4>
                  <div
                    className="preview-content prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formData.job_posting.qualifications || "",
                    }}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Headcount:</strong>
                <span className="ml-2">
                  {formData.job_posting.number_of_vacancies}
                </span>
              </div>
              <div>
                <strong className="text-gray-700">Date Needed:</strong>
                <span className="ml-2">
                  {formData.job_posting.target_start_date &&
                    formatDate(String(formData.job_posting.target_start_date))}
                </span>
              </div>
              <div>
                <strong className="text-gray-700">Budget Range:</strong>
                <span className="ml-2">
                  {formatMoney(Number(formData.job_posting.min_salary))} -{" "}
                  {formatMoney(Number(formData.job_posting.max_salary))}
                </span>
              </div>
              <div>
                <strong className="text-gray-700">Education:</strong>
                <span className="ml-2">
                  {formatName(formData.education_level ?? "")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
