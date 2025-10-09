import React from "react";
import { Button } from "@/shared/components/ui/button";
import { X, Briefcase } from "lucide-react";
import type { CreatePositionFormData } from "@/features/positions/types/createPosition";
import formatName from "@/shared/utils/formatName";
import formatMoney from "@/shared/utils/formatMoney";
import formatDate from "@/shared/utils/formatDate";

interface CancelModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface PreviewModalProps {
  show: boolean;
  onClose: () => void;
  formData: CreatePositionFormData;
  currentStep: number;
}

interface PoolApplicantsModalProps {
  show: boolean;
  onClose: () => void;
  formData: CreatePositionFormData;
  selectedPoolingOption: string;
  onPoolingOptionChange: (option: string) => void;
  onPublish: () => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Cancel Position Creation
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Are you sure you want to cancel? All unsaved changes will be lost.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Continue Editing
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

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
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-600">
              Position Preview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {formData.job_title || "Position Title"}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>{formatName(formData.department)}</span>
                <span>{formatName(formData.employment_type)}</span>
                <span>{formatName(formData.work_setup)}</span>
                <span>{formatName(formData.experience_level)}</span>
              </div>
            </div>

            {currentStep >= 2 && (
              <>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Job Description
                  </h4>
                  <div
                    className="prose prose-sm max-w-none preview-content"
                    dangerouslySetInnerHTML={{
                      __html: formData.description || "",
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Responsibilities
                  </h4>
                  <div
                    className="prose prose-sm max-w-none preview-content"
                    dangerouslySetInnerHTML={{
                      __html: formData.responsibilities || "",
                    }}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Headcount:</strong>
                <span className="ml-2">{formData.headcount}</span>
              </div>
              <div>
                <strong className="text-gray-700">Date Needed:</strong>
                <span className="ml-2">
                  {formData.date_needed &&
                    formatDate(String(formData.date_needed))}
                </span>
              </div>
              <div>
                <strong className="text-gray-700">Budget Range:</strong>
                <span className="ml-2">
                  {formatMoney(Number(formData.min_budget))} -{" "}
                  {formatMoney(Number(formData.max_budget))}
                </span>
              </div>
              <div>
                <strong className="text-gray-700">Education:</strong>
                <span className="ml-2">
                  {formatName(formData.education_level)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PoolApplicantsModal: React.FC<PoolApplicantsModalProps> = ({
  show,
  onClose,
  formData,
  selectedPoolingOption,
  onPoolingOptionChange,
  onPublish,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Ready to Publish
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          You're about to publish the job post for:{" "}
          <strong>{formData.job_title}</strong>
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium">{formData.job_title}</p>
          </div>
        </div>

        <p className="text-base text-gray-800 text-center mb-4">
          Would you like to start by pooling applicants for this role?
        </p>

        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="pooling"
              value="All Previous Applicants"
              checked={selectedPoolingOption === "All Previous Applicants"}
              onChange={(e) => onPoolingOptionChange(e.target.value)}
              className="text-blue-600"
            />
            <span className="text-sm">Pool from all previous applicants</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="pooling"
              value="Skip Pooling"
              checked={selectedPoolingOption === "Skip Pooling"}
              onChange={(e) => onPoolingOptionChange(e.target.value)}
              className="text-blue-600"
            />
            <span className="text-sm">Skip pooling and publish directly</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={onPublish}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};
