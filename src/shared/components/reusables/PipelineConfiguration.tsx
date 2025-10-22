import { Card } from "@/shared/components/ui/card";
import type {
  PipelineStage,
  PipelineStep,
} from "@/features/positions/types/createPosition";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface PipelineConfigurationProps {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (pipeline_identifier: number, data: PipelineStep) => void;
  pipelineDeleteHandler: (pipeline_identifier: number) => void;
  errors: any;
  pipelineStages?: PipelineStage[];
  title?: string;
}

export default function PipelineConfiguration({
  pipelineSteps,
  pipelineHandler,
  pipelineDeleteHandler,
  errors,
  pipelineStages = [
    { id: 1, name: "STAGE 01" },
    { id: 2, name: "STAGE 02" },
    { id: 3, name: "STAGE 03" },
    { id: 4, name: "STAGE 04" },
  ],
  title = "Pipeline Configuration",
}: PipelineConfigurationProps) {
  const [pipelineStagesState] = useState<PipelineStage[]>(pipelineStages);

  const [stepData, setStepData] = useState<PipelineStep>({
    pipeline_identifier: 0,
    process_type: "",
    process_title: "",
    description: "",
    order: 0,
    stage: 0,
  });
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleInputChange = (field: string, value: string) => {
    setStepData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetStepData = () => {
    setStepData({
      pipeline_identifier: 0,
      process_type: "",
      process_title: "",
      description: "",
      order: 0,
      stage: 0,
    });
  };

  const handleOpenDialog = (stageId: number, isOpen: boolean) => {
    setOpenDialogs((prev) => ({ ...prev, [stageId]: isOpen }));
  };

  const handleEditStep = (pipeline_identifier: number) => {
    // First check for newly added steps (has pipeline_identifier)
    let step = pipelineSteps.find(
      (step) => step.pipeline_identifier === pipeline_identifier
    );

    // If not found, check for existing DB records (has id)
    if (!step) {
      step = pipelineSteps.find(
        (step) => (step as any).id === pipeline_identifier
      );
    }

    if (step) {
      setOpenDialogs((prev) => ({ ...prev, [step.stage]: true }));
      setStepData({
        ...step,
        pipeline_identifier: step.pipeline_identifier || (step as any).id || 0,
      });
    }
  };

  const handleSaveStep = async (stage_id: number, data: PipelineStep) => {
    data.stage = stage_id;

    if (!data.pipeline_identifier) {
      data.pipeline_identifier = Math.floor(Math.random() * 1000000); // Temporary ID generation
      data.order =
        pipelineSteps.filter((step) => step.stage === stage_id).length + 1;
    } else {
      // For update, keep existing order and ID
      data.order = data.order; // Preserve existing order
    }

    pipelineHandler(data.pipeline_identifier, data);
    setOpenDialogs((prev) => ({ ...prev, [stage_id]: false }));
    handleResetStepData();
  };
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

      <div className="flex flex-col gap-6">
        {errors?.pipeline && typeof errors.pipeline[0] === "string" && (
          <div className="text-red-600 text-sm">
            <p>Add Pipeline Steps</p>
          </div>
        )}
        {pipelineStagesState.map((stage) => (
          <div key={stage.id} className="border border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              {stage.name}
            </h4>

            <div className="space-y-3 mb-4">
              {pipelineSteps.map(
                (step, index) =>
                  step.stage === stage.id && (
                    <div
                      key={step.id || step.pipeline_identifier}
                      className="p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      {errors?.pipeline &&
                        errors.pipeline[index]?.process_title && (
                          <div className="text-red-600 text-sm">
                            {Object.entries(errors.pipeline[index]).map(
                              ([field, messages]) => (
                                <p key={field + index}>
                                  {Array.isArray(messages)
                                    ? messages.join(", ")
                                    : String(messages)}
                                </p>
                              )
                            )}
                          </div>
                        )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {step.process_title}
                        </span>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleEditStep(
                                step.pipeline_identifier || step.id || 0
                              )
                            }
                          >
                            <Edit />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              pipelineDeleteHandler(
                                step.pipeline_identifier || step.id || 0
                              )
                            }
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>

                      {step.description && (
                        <p className="text-xs text-gray-600 mt-2">
                          {step.description}
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>

            <Dialog
              open={openDialogs[stage.id] || false}
              onOpenChange={(isOpen) => handleOpenDialog(stage.id, isOpen)}
            >
              <DialogTrigger className="w-full text-blue-600 border-blue-600 border rounded-lg flex items-center justify-center py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Pipeline Step</DialogTitle>
                  <DialogDescription>
                    Add Pipeline Step to {stage.name}
                  </DialogDescription>
                  <div className="py-4">
                    <FieldSet>
                      <Field>
                        <FieldLabel>Process Type *</FieldLabel>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("process_type", value)
                          }
                          value={stepData.process_type}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Process Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="resume_screening">
                                Resume Screening
                              </SelectItem>
                              <SelectItem value="phone_interview">
                                Phone Interview
                              </SelectItem>
                              <SelectItem value="initial_interview">
                                Initial Interview
                              </SelectItem>
                              <SelectItem value="assessments">
                                Assessments
                              </SelectItem>
                              <SelectItem value="final_interview">
                                Final Interview
                              </SelectItem>
                              <SelectItem value="offer">Offer</SelectItem>
                              <SelectItem value="onboarding">
                                Onboarding
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Process Title *</FieldLabel>
                        <Input
                          placeholder="Enter process title"
                          value={stepData.process_title}
                          onChange={(e) =>
                            handleInputChange("process_title", e.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Input
                          placeholder="Enter process description"
                          value={stepData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                        />
                      </Field>
                      <FieldGroup>
                        <Field orientation="horizontal">
                          <Checkbox />
                          <FieldLabel>Redacted</FieldLabel>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => handleSaveStep(stage.id, stepData)}
                    >
                      Save Step
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </Card>
  );
}
