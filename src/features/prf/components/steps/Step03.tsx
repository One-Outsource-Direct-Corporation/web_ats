import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import type { PRF, PRFFormData } from "../../types/prf.types";
import formatName from "@/shared/utils/formatName";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { ArrowLeft, ArrowRight, PlusCircle, X } from "lucide-react";
import { hardwareData, softwareData } from "../../data/hardware_software_data";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { PreviewInfo } from "../PreviewInfo";

interface Step03Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  step: number;
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
}

export const Step03: React.FC<Step03Props> = ({
  goToNextStep,
  goToPreviousStep,
  step,
  formData,
  updateFormData,
}) => {
  // State for adding custom hardware/software
  const [showAddHardware, setShowAddHardware] = useState(false);
  const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [newHardwareName, setNewHardwareName] = useState("");
  const [newSoftwareName, setNewSoftwareName] = useState("");

  const handleHardwareToggle = (type: keyof PRF["hardware_required"]) => {
    updateFormData((prev) => ({
      ...prev,
      hardware_required: {
        ...prev.hardware_required,
        [type]: !prev.hardware_required[type],
      },
    }));
  };

  const handleSoftwareToggle = (type: keyof PRF["software_required"]) => {
    updateFormData((prev) => ({
      ...prev,
      software_required: {
        ...prev.software_required,
        [type]: !prev.software_required[type],
      },
    }));
  };

  const handleAddCustomHardware = () => {
    if (!newHardwareName.trim()) {
      alert("Please enter a hardware name");
      return;
    }

    const fieldKey = newHardwareName.toLowerCase().replace(/\s+/g, "_");

    updateFormData((prev) => ({
      ...prev,
      hardware_required: {
        ...prev.hardware_required,
        [fieldKey]: true,
      },
    }));

    setNewHardwareName("");
    setShowAddHardware(false);
  };

  const handleAddCustomSoftware = () => {
    if (!newSoftwareName.trim()) {
      alert("Please enter a software name");
      return;
    }

    const fieldKey = newSoftwareName.toLowerCase().replace(/\s+/g, "_");

    updateFormData((prev) => ({
      ...prev,
      software_required: {
        ...prev.software_required,
        [fieldKey]: true,
      },
    }));

    setNewSoftwareName("");
    setShowAddSoftware(false);
  };

  const handleRemoveCustomHardware = (type: string) => {
    updateFormData((prev) => {
      const newHardware = { ...prev.hardware_required };
      delete newHardware[type as keyof PRF["hardware_required"]];
      return {
        ...prev,
        hardware_required: newHardware,
      };
    });
  };

  const handleRemoveCustomSoftware = (type: string) => {
    updateFormData((prev) => {
      const newSoftware = { ...prev.software_required };
      delete newSoftware[type as keyof PRF["software_required"]];
      return {
        ...prev,
        software_required: newSoftware,
      };
    });
  };

  // Get predefined and custom hardware
  const predefinedHardware = Object.keys(hardwareData);
  const customHardware = Object.keys(formData.hardware_required).filter(
    (key) => !predefinedHardware.includes(key)
  );

  // Get predefined and custom software
  const predefinedSoftware = Object.keys(softwareData);
  const customSoftware = Object.keys(formData.software_required).filter(
    (key) => !predefinedSoftware.includes(key)
  );

  // Check if no hardware or software is selected
  const noHardwareSelected = Object.values(formData.hardware_required).every(
    (val) => !val
  );
  const noSoftwareSelected = Object.values(formData.software_required).every(
    (val) => !val
  );
  const showWarning = noHardwareSelected || noSoftwareSelected;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {showWarning && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              ⚠️ Warning:
            </p>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              {noHardwareSelected && (
                <li>No hardware requirements have been selected</li>
              )}
              {noSoftwareSelected && (
                <li>No software requirements have been selected</li>
              )}
            </ul>
          </div>
        )}
        {/* Asset Request */}
        <FieldGroup>
          <h2 className="text-blue-700 font-bold text-sm mb-4 border-l-4 border-blue-700 pl-2 uppercase">
            Asset Request
          </h2>
          <Field className="mb-4">
            <FieldLabel>
              Hardware Required{" "}
              <PlusCircle
                className="w-5 h-5 text-gray-900/50 hover:text-blue-700 hover:cursor-pointer"
                onClick={() => setShowAddHardware(true)}
              />
              `
            </FieldLabel>

            {/* Add Hardware Form */}
            {showAddHardware && (
              <div className="mb-4 p-3 border border-blue-300 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter hardware name (e.g., Monitor, Keyboard)"
                    value={newHardwareName}
                    onChange={(e) => setNewHardwareName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCustomHardware}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddHardware(false);
                      setNewHardwareName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {/* Predefined Hardware */}
              {Object.keys(hardwareData).map((type) => (
                <Field orientation="horizontal" key={type}>
                  <Checkbox
                    id={`${type}`}
                    checked={Boolean(
                      formData.hardware_required[
                        type as keyof PRF["hardware_required"]
                      ]
                    )}
                    onCheckedChange={() =>
                      handleHardwareToggle(
                        type as keyof PRF["hardware_required"]
                      )
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <Label
                    htmlFor={`${type}`}
                    className="text-sm text-gray-700 flex items-center"
                  >
                    {formatName(type)}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </Field>
              ))}

              {/* Custom Hardware */}
              {customHardware.map((type) => (
                <Field
                  orientation="horizontal"
                  key={type}
                  className="relative group"
                >
                  <Checkbox
                    id={`${type}`}
                    checked={Boolean(
                      formData.hardware_required[
                        type as keyof PRF["hardware_required"]
                      ]
                    )}
                    onCheckedChange={() =>
                      handleHardwareToggle(
                        type as keyof PRF["hardware_required"]
                      )
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <Label
                    htmlFor={`${type}`}
                    className="text-sm text-gray-700 flex items-center flex-1"
                  >
                    {formatName(type)}
                    <span className="text-purple-500 ml-1 text-xs">
                      (Custom)
                    </span>
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCustomHardware(type)}
                    className="h-5 w-5 p-0 ml-2 text-gray-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Field>
              ))}
            </div>
          </Field>
          <Field className="mb-4">
            <FieldLabel>
              Software Required{" "}
              <PlusCircle
                className="w-5 h-5 text-gray-900/50 hover:text-blue-700 hover:cursor-pointer"
                onClick={() => setShowAddSoftware(true)}
              />
            </FieldLabel>

            {/* Add Software Form */}
            {showAddSoftware && (
              <div className="mb-4 p-3 border border-blue-300 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter software name (e.g., Slack, Figma)"
                    value={newSoftwareName}
                    onChange={(e) => setNewSoftwareName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCustomSoftware}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddSoftware(false);
                      setNewSoftwareName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {/* Predefined Software */}
              {Object.keys(softwareData).map((type) => (
                <Field orientation="horizontal" key={type}>
                  <Checkbox
                    id={`${type}`}
                    checked={Boolean(
                      formData.software_required[
                        type as keyof PRF["software_required"]
                      ]
                    )}
                    onCheckedChange={() =>
                      handleSoftwareToggle(
                        type as keyof PRF["software_required"]
                      )
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <FieldLabel htmlFor={type} className="text-sm text-gray-700">
                    {formatName(type)}
                  </FieldLabel>
                </Field>
              ))}

              {/* Custom Software */}
              {customSoftware.map((type) => (
                <Field
                  orientation="horizontal"
                  key={type}
                  className="relative group"
                >
                  <Checkbox
                    id={`${type}`}
                    checked={Boolean(
                      formData.software_required[
                        type as keyof PRF["software_required"]
                      ]
                    )}
                    onCheckedChange={() =>
                      handleSoftwareToggle(
                        type as keyof PRF["software_required"]
                      )
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <Label
                    htmlFor={`${type}`}
                    className="text-sm text-gray-700 flex items-center flex-1"
                  >
                    {formatName(type)}
                    <span className="text-purple-500 ml-1 text-xs">
                      (Custom)
                    </span>
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCustomSoftware(type)}
                    className="h-5 w-5 p-0 ml-2 text-gray-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Field>
              ))}
            </div>
          </Field>
        </FieldGroup>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>
          <Button
            className="bg-[#0056D2] hover:bg-blue-700 text-white"
            onClick={goToNextStep}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <PreviewInfo formData={formData} step={step} />
    </div>
  );
};
