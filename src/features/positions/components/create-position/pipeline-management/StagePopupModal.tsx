import React from "react";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type { StagePopupData } from "../../../types/createPosition";

interface StagePopupModalProps {
  show: boolean;
  onClose: () => void;
  stagePopupData: StagePopupData;
  setStagePopupData: React.Dispatch<React.SetStateAction<StagePopupData>>;
  editingStepId: number | null;
  onSave: () => void;
}

export const StagePopupModal: React.FC<StagePopupModalProps> = ({
  show,
  onClose,
  stagePopupData,
  setStagePopupData,
  editingStepId,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingStepId ? "Edit Pipeline Step" : "Add Pipeline Step"}
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Type *
            </label>
            <select
              value={stagePopupData.processType}
              onChange={(e) =>
                setStagePopupData((prev) => ({
                  ...prev,
                  processType: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Process Type</option>
              <option value="Resume Screening">Resume Screening</option>
              <option value="Phone Call Interview">Phone Call Interview</option>
              <option value="Initial Interview">Initial Interview</option>
              <option value="Assessments">Assessments</option>
              <option value="Final Interview">Final Interview</option>
              <option value="For Job Offer">For Job Offer</option>
              <option value="Onboarding">Onboarding</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Title *
            </label>
            <input
              type="text"
              value={stagePopupData.processTitle}
              onChange={(e) =>
                setStagePopupData((prev) => ({
                  ...prev,
                  processTitle: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter process title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={stagePopupData.description}
              onChange={(e) =>
                setStagePopupData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter process description"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stagePopupData.redactedInfo}
                onChange={(e) =>
                  setStagePopupData((prev) => ({
                    ...prev,
                    redactedInfo: e.target.checked,
                  }))
                }
              />
              <span className="text-sm font-medium text-gray-700">
                Redact candidate information
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                !stagePopupData.processType || !stagePopupData.processTitle
              }
            >
              {editingStepId ? "Update Step" : "Add Step"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
