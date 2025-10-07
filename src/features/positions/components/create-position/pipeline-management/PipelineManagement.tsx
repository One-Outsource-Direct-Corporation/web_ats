import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type {
  PipelineStage,
  PipelineStep,
} from "../../../types/createPosition";
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
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

interface PipelineManagementProps {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (
    pipeline_identifier: number,
    field: string,
    value: any
  ) => void;
  pipelineStages: PipelineStage[];
}

// Dummy ID
let dummy_id = 1;

export const PipelineManagement: React.FC<PipelineManagementProps> = ({
  pipelineSteps,
  pipelineHandler,
  pipelineStages,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Pipeline Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="border border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              {stage.name}
            </h4>

            <div className="space-y-3 mb-4">
              {stage.steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 border border-gray-200 rounded-md bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {step.process_title}
                      </span>
                    </div>
                  </div>

                  {step.description && (
                    <p className="text-xs text-gray-600 mt-2">
                      {step.description}
                    </p>
                  )}

                  {/* {step.assessments && step.assessments.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-600">
                        {step.assessments.length} assessment(s)
                      </span>
                    </div>
                  )}

                  {step.teamMembers && step.teamMembers.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-green-600">
                        {step.teamMembers.length} team member(s)
                      </span>
                    </div>
                  )} */}
                </div>
              ))}
            </div>

            <Dialog>
              <DialogTrigger className="w-full text-blue-600 border-blue-600 border rounded-lg flex items-center justify-center py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Pipeline Step</DialogTitle>
                  <DialogDescription hidden></DialogDescription>
                  <div className="py-4">
                    <FieldSet>
                      <Field>
                        <FieldLabel>Process Type *</FieldLabel>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Process Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="resume_screening">
                                Resume Screening
                              </SelectItem>
                              <SelectItem value="phone_call_interview">
                                Phone Call Interview
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
                              <SelectItem value="for_job_offer">
                                For Job Offer
                              </SelectItem>
                              <SelectItem value="onboarding">
                                Onboarding
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Process Title *</FieldLabel>
                        <Input placeholder="Enter process title" />
                      </Field>
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Input placeholder="Enter process description" />
                      </Field>
                      <Field className="flex flex-row items-center space-x-2">
                        <FieldLabel>Redacted</FieldLabel>
                      </Field>
                    </FieldSet>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};
