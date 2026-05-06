import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import formatName from "@/shared/utils/formatName";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { PlusCircle, X } from "lucide-react";
import {
  hardwareData,
  softwareData,
} from "@/features/prf_2/utils/hardware_software_data";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import type { ValidationError } from "@/features/prf_2/utils/validateSteps";
import { getFieldError } from "@/shared/utils/formValidation";

interface PRFStep03Props {
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
  errors?: ValidationError | null;
}

export default function PRFStep03({
  formData,
  updateFormData,
  errors,
}: PRFStep03Props) {
  const [showAddHardware, setShowAddHardware] = useState(false);
  const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [newHardwareName, setNewHardwareName] = useState("");
  const [newSoftwareName, setNewSoftwareName] = useState("");

  const handleHardwareToggle = (type: string) => {
    updateFormData((prev) => ({
      ...prev,
      prf_input: {
        ...prev.prf_input,
        hardware_required: {
          ...prev.prf_input.hardware_required,
          [type]: !prev.prf_input.hardware_required[type],
        },
      },
    }));
  };

  const handleSoftwareToggle = (type: string) => {
    updateFormData((prev) => ({
      ...prev,
      prf_input: {
        ...prev.prf_input,
        software_required: {
          ...prev.prf_input.software_required,
          [type]: !prev.prf_input.software_required[type],
        },
      },
    }));
  };

  const handleAddCustomHardware = () => {
    if (!newHardwareName.trim()) {
      return;
    }

    const fieldKey = newHardwareName.toLowerCase().replace(/\s+/g, "_");

    updateFormData((prev) => ({
      ...prev,
      prf_input: {
        ...prev.prf_input,
        hardware_required: {
          ...prev.prf_input.hardware_required,
          [fieldKey]: true,
        },
      },
    }));

    setNewHardwareName("");
    setShowAddHardware(false);
  };

  const handleAddCustomSoftware = () => {
    if (!newSoftwareName.trim()) {
      return;
    }

    const fieldKey = newSoftwareName.toLowerCase().replace(/\s+/g, "_");

    updateFormData((prev) => ({
      ...prev,
      prf_input: {
        ...prev.prf_input,
        software_required: {
          ...prev.prf_input.software_required,
          [fieldKey]: true,
        },
      },
    }));

    setNewSoftwareName("");
    setShowAddSoftware(false);
  };

  const handleRemoveCustomHardware = (type: string) => {
    updateFormData((prev) => {
      const newHardware = { ...prev.prf_input.hardware_required };
      delete newHardware[type];

      return {
        ...prev,
        prf_input: {
          ...prev.prf_input,
          hardware_required: newHardware,
        },
      };
    });
  };

  const handleRemoveCustomSoftware = (type: string) => {
    updateFormData((prev) => {
      const newSoftware = { ...prev.prf_input.software_required };
      delete newSoftware[type];

      return {
        ...prev,
        prf_input: {
          ...prev.prf_input,
          software_required: newSoftware,
        },
      };
    });
  };

  const predefinedHardware = Object.keys(hardwareData);
  const customHardware = Object.keys(
    formData.prf_input.hardware_required,
  ).filter((key) => !predefinedHardware.includes(key));

  const predefinedSoftware = Object.keys(softwareData);
  const customSoftware = Object.keys(
    formData.prf_input.software_required,
  ).filter((key) => !predefinedSoftware.includes(key));

  const noHardwareSelected = Object.values(
    formData.prf_input.hardware_required,
  ).every((val) => !val);
  const noSoftwareSelected = Object.values(
    formData.prf_input.software_required,
  ).every((val) => !val);
  const showWarning = noHardwareSelected || noSoftwareSelected;

  const hardwareRequiredError = getFieldError(errors, "hardware_required");
  const softwareRequiredError = getFieldError(errors, "software_required");

  return (
    <div className="lg:col-span-2 space-y-6">
      {showWarning && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
          <p className="text-sm font-semibold text-yellow-800 mb-2">Warning:</p>
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
          </FieldLabel>

          {showAddHardware && (
            <div className="mb-4 p-3 border border-blue-300 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter hardware name"
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
            {Object.keys(hardwareData).map((type) => (
              <Field orientation="horizontal" key={type}>
                <Checkbox
                  id={type}
                  checked={Boolean(formData.prf_input.hardware_required[type])}
                  onCheckedChange={() => handleHardwareToggle(type)}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor={type}
                  className="text-sm text-gray-700 flex items-center"
                >
                  {formatName(type)}
                </Label>
              </Field>
            ))}

            {customHardware.map((type) => (
              <Field
                orientation="horizontal"
                key={type}
                className="relative group"
              >
                <Checkbox
                  id={type}
                  checked={Boolean(formData.prf_input.hardware_required[type])}
                  onCheckedChange={() => handleHardwareToggle(type)}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor={type}
                  className="text-sm text-gray-700 flex items-center flex-1"
                >
                  {formatName(type)}
                  <span className="text-blue-500 ml-1 text-xs">(Custom)</span>
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
          {hardwareRequiredError && (
            <FieldError>{hardwareRequiredError}</FieldError>
          )}
        </Field>

        <Field className="mb-4">
          <FieldLabel>
            Software Required{" "}
            <PlusCircle
              className="w-5 h-5 text-gray-900/50 hover:text-blue-700 hover:cursor-pointer"
              onClick={() => setShowAddSoftware(true)}
            />
          </FieldLabel>

          {showAddSoftware && (
            <div className="mb-4 p-3 border border-blue-300 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter software name"
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
            {Object.keys(softwareData).map((type) => (
              <Field orientation="horizontal" key={type}>
                <Checkbox
                  id={type}
                  checked={Boolean(formData.prf_input.software_required[type])}
                  onCheckedChange={() => handleSoftwareToggle(type)}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
                <FieldLabel htmlFor={type} className="text-sm text-gray-700">
                  {formatName(type)}
                </FieldLabel>
              </Field>
            ))}

            {customSoftware.map((type) => (
              <Field
                orientation="horizontal"
                key={type}
                className="relative group"
              >
                <Checkbox
                  id={type}
                  checked={Boolean(formData.prf_input.software_required[type])}
                  onCheckedChange={() => handleSoftwareToggle(type)}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor={type}
                  className="text-sm text-gray-700 flex items-center flex-1"
                >
                  {formatName(type)}
                  <span className="text-blue-500 ml-1 text-xs">(Custom)</span>
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
          {softwareRequiredError && (
            <FieldError>{softwareRequiredError}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </div>
  );
}
