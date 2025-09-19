import React from "react";
import { Button } from "@/shared/components/ui/button";
import type { FormData } from "../types/prfTypes";
import { PreviewInfo } from "./PreviewInfo";

interface Step03Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  step: number;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step03: React.FC<Step03Props> = ({
  goToNextStep,
  goToPreviousStep,
  step,
  formData,
  updateFormData,
}) => {
  // Handlers for toggles and input changes
  const handleAssessmentRequiredChange = (value: string) => {
    updateFormData({ assessmentRequired: value });
  };
  const handleAssessmentTypeToggle = (
    type: keyof FormData["assessmentTypes"]
  ) => {
    updateFormData({
      assessmentTypes: {
        ...formData.assessmentTypes,
        [type]: !formData.assessmentTypes[type],
      },
    });
  };
  const handleOtherAssessmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFormData({ otherAssessment: e.target.value });
  };
  const handleHardwareToggle = (type: keyof FormData["hardwareRequired"]) => {
    updateFormData({
      hardwareRequired: {
        ...formData.hardwareRequired,
        [type]: !formData.hardwareRequired[type],
      },
    });
  };
  const handleSoftwareToggle = (type: string) => {
    updateFormData({
      softwareRequired: {
        ...formData.softwareRequired,
        [type]: !formData.softwareRequired[type],
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Assessments */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Assessments
          </h2>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Assessment Required
            </label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={formData.assessmentRequired}
              onChange={(e) => handleAssessmentRequiredChange(e.target.value)}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Assessment Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(formData.assessmentTypes).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.assessmentTypes[
                        type as keyof FormData["assessmentTypes"]
                      ]
                    }
                    onChange={() =>
                      handleAssessmentTypeToggle(
                        type as keyof FormData["assessmentTypes"]
                      )
                    }
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Other Assessment
            </label>
            <input
              className="border rounded px-2 py-1 w-full"
              type="text"
              value={formData.otherAssessment}
              onChange={handleOtherAssessmentChange}
              placeholder="Enter other assessment"
            />
          </div>
        </div>
        {/* Asset Request */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Asset Request
          </h2>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Hardware Required
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(formData.hardwareRequired).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.hardwareRequired[
                        type as keyof FormData["hardwareRequired"]
                      ]
                    }
                    onChange={() =>
                      handleHardwareToggle(
                        type as keyof FormData["hardwareRequired"]
                      )
                    }
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Software Required
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(formData.softwareRequired).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.softwareRequired[type]}
                    onChange={() => handleSoftwareToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            &larr; Previous
          </Button>
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
