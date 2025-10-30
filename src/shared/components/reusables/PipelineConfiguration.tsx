import { Card } from "@/shared/components/ui/card";
import type {
  PipelineStage,
  PipelineStep,
  Assessment,
  PipelineStepInDb,
  PipelineStepLocal,
} from "@/features/positions-client/types/create_position.types";
import { useState } from "react";
import { StageCard } from "./pipeline/StageCard";
import { AddAssessmentModal } from "./pipeline/AddAssessmentModal";

interface PipelineConfigurationProps {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (
    pipeline_identifier: string | number,
    data: PipelineStep
  ) => void;
  pipelineDeleteHandler: (pipeline_identifier: string | number) => void;
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
  const [showViewTeamMember, setShowViewTeamMember] = useState(false);
  const [stepData, setStepData] = useState<PipelineStep>({
    pipeline_identifier: `tmp-${Date.now()}`,
    process_type: "",
    process_title: "",
    description: "",
    order: 0,
    stage: 0,
    source: "local",
    assessments: [],
  });
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [redactedInfo, setRedactedInfo] = useState(false);
  // Remove global assessments state
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([]);
  const [searchTeamMember, setSearchTeamMember] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [reminderTime, setReminderTime] = useState("00:00:00");

  // Assessment form state
  const [assessmentForm, setAssessmentForm] = useState({
    type: "",
    title: "",
    description: "",
    required: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setStepData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetStepData = () => {
    setStepData({
      pipeline_identifier: `tmp-${Date.now()}`,
      process_type: "",
      process_title: "",
      description: "",
      order: 0,
      stage: 0,
      source: "local",
      assessments: [],
    });

    // Static for now
    setRedactedInfo(false);
    setSelectedTeamMembers([]);
    setTemplateType("");
    setReminderTime("00:00:00");
  };

  const handleOpenDialog = (stageId: number, isOpen: boolean) => {
    setOpenDialogs((prev) => ({ ...prev, [stageId]: isOpen }));
    if (!isOpen) {
      handleResetStepData();
    }
  };

  // Assessment handlers
  const handleAddAssessment = () => {
    if (assessmentForm.type && assessmentForm.title) {
      const newAssessment: Assessment = {
        localId: `tmp-${Date.now()}`,
        source: "local",
        ...assessmentForm,
      };
      setStepData((prev) => ({
        ...prev,
        assessments: [...(prev.assessments || []), newAssessment],
      }));
      setAssessmentForm({
        type: "",
        title: "",
        description: "",
        required: false,
      });
      setShowAddAssessment(false);
    }
  };

  const handleDeleteAssessment = (id: number) => {
    setStepData((prev) => ({
      ...prev,
      assessments: (prev.assessments || []).filter((a) => {
        if (a.source === "db") {
          return a.id !== id;
        } else {
          return a.localId !== String(id);
        }
      }),
    }));
  };

  // Team member handlers
  const handleToggleTeamMember = (memberId: number) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleEditStep = (pipeline_identifier: string | number) => {
    let step: PipelineStepLocal | PipelineStepInDb | undefined;

    if (typeof pipeline_identifier === "string") {
      // Only local steps use string pipeline_identifier
      step = pipelineSteps.find(
        (step): step is PipelineStepLocal =>
          step.source === "local" &&
          step.pipeline_identifier === pipeline_identifier
      );
    } else {
      // DB steps use number id
      step = pipelineSteps.find(
        (step): step is PipelineStepInDb =>
          step.source === "db" && step.id === pipeline_identifier
      );
    }

    if (step) {
      setOpenDialogs((prev) => ({ ...prev, [step.stage]: true }));
      if (step.source === "local") {
        setStepData({
          ...step,
          pipeline_identifier: step.pipeline_identifier,
          assessments: step.assessments || [],
        });
      } else {
        // For db steps, do not set pipeline_identifier
        const { pipeline_identifier, ...rest } = step as PipelineStepInDb & {
          pipeline_identifier?: string;
        };
        setStepData({
          ...rest,
          assessments: step.assessments || [],
        });
      }
      setSelectedTeamMembers((step as any).teamMembers || []);
      setRedactedInfo((step as any).redactedInfo || false);
      setTemplateType((step as any).templateType || "");
      setReminderTime((step as any).reminderTime || "00:00:00");
    }
  };

  const handleSaveStep = async (stage_id: number) => {
    if (stepData.source === "local") {
      const data: PipelineStepLocal = {
        ...stepData,
        stage: stage_id,
        assessments: stepData.assessments,
        source: "local",
      };
      if (!data.pipeline_identifier) {
        data.pipeline_identifier = `tmp-${Date.now()}`;
        data.order =
          pipelineSteps.filter((step) => step.stage === stage_id).length + 1;
      }
      pipelineHandler(data.pipeline_identifier, data);
    } else {
      const dbStep = stepData as PipelineStepInDb;
      const data: PipelineStepInDb = {
        ...dbStep,
        stage: stage_id,
        assessments: stepData.assessments,
        source: "db",
      };
      pipelineHandler(data.id, data);
    }
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
        {pipelineStagesState.map((stage) => {
          const stageSteps = pipelineSteps.filter(
            (step) => step.stage === stage.id
          );

          return (
            <StageCard
              key={stage.id}
              stage={stage}
              steps={stageSteps}
              errors={errors}
              dialogOpen={openDialogs[stage.id] || false}
              onDialogOpenChange={(isOpen) =>
                handleOpenDialog(stage.id, isOpen)
              }
              stepData={stepData}
              onStepDataChange={handleInputChange}
              redactedInfo={redactedInfo}
              onRedactedInfoChange={setRedactedInfo}
              assessments={stepData.assessments}
              onAssessmentsChange={(newAssessments) =>
                setStepData((prev) => ({
                  ...prev,
                  assessments: newAssessments,
                }))
              }
              onDeleteAssessment={handleDeleteAssessment}
              onAddAssessmentClick={() => setShowAddAssessment(true)}
              selectedTeamMembers={selectedTeamMembers}
              onToggleTeamMember={handleToggleTeamMember}
              searchTeamMember={searchTeamMember}
              onSearchTeamMemberChange={setSearchTeamMember}
              showViewTeamMember={showViewTeamMember}
              onToggleViewTeamMember={() =>
                setShowViewTeamMember(!showViewTeamMember)
              }
              templateType={templateType}
              onTemplateTypeChange={setTemplateType}
              reminderTime={reminderTime}
              onReminderTimeChange={setReminderTime}
              onSaveStep={() => handleSaveStep(stage.id)}
              onEditStep={handleEditStep}
              onDeleteStep={pipelineDeleteHandler}
            />
          );
        })}
      </div>

      {/* Add Assessment Modal */}
      <AddAssessmentModal
        open={showAddAssessment}
        onOpenChange={setShowAddAssessment}
        assessmentForm={assessmentForm}
        onAssessmentFormChange={setAssessmentForm}
        onAdd={handleAddAssessment}
      />
    </Card>
  );
}
