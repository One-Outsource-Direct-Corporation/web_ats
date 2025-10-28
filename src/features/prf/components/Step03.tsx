import React from "react";
import { Button } from "@/shared/components/ui/button";
import type { PRF } from "../types/prf.types";
import { PreviewInfo } from "./PreviewInfo";
import formatName from "@/shared/utils/formatName";

interface Step03Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  step: number;
  formData: PRF;
  updateFormData: (updates: Partial<PRF>) => void;
}

export const Step03: React.FC<Step03Props> = ({
  goToNextStep,
  goToPreviousStep,
  step,
  formData,
  updateFormData,
}) => {
  const handleAssessmentTypeToggle = (type: keyof PRF["assessment_types"]) => {
    updateFormData({
      assessment_types: {
        ...formData.assessment_types,
        [type]: !formData.assessment_types[type],
      },
    });
  };
  const handleOtherAssessmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFormData({ other_assessment: e.target.value });
  };
  const handleHardwareToggle = (type: keyof PRF["hardware_required"]) => {
    updateFormData({
      hardware_required: {
        ...formData.hardware_required,
        [type]: !formData.hardware_required[type],
      },
    });
  };
  const handleSoftwareToggle = (type: string) => {
    updateFormData({
      software_required: {
        ...formData.software_required,
        [type]: !formData.software_required[type],
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
              value={formData.assessment_required ? "true" : "false"}
              onChange={(e) =>
                updateFormData({
                  assessment_required: e.target.value === "true",
                })
              }
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Assessment Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(formData.assessment_types).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.assessment_types[
                        type as keyof PRF["assessment_types"]
                      ]
                    }
                    onChange={() =>
                      handleAssessmentTypeToggle(
                        type as keyof PRF["assessment_types"]
                      )
                    }
                  />
                  {formatName(type)}
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
              value={formData.other_assessment}
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
              {Object.keys(formData.hardware_required).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.hardware_required[
                        type as keyof PRF["hardware_required"]
                      ]
                    }
                    onChange={() =>
                      handleHardwareToggle(
                        type as keyof PRF["hardware_required"]
                      )
                    }
                  />
                  {formatName(type)}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Software Required
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(formData.software_required).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.software_required[type]}
                    onChange={() => handleSoftwareToggle(type)}
                  />
                  {formatName(type)}
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
