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
  title?: string;
}

export default function PipelineConfiguration({
  pipelineSteps,
  pipelineHandler,
  pipelineDeleteHandler,
  errors,
  title = "Pipeline Configuration",
}: PipelineConfigurationProps) {
  const pipelineStages: PipelineStage[] = [
    { id: 1, name: "STAGE 01" },
    { id: 2, name: "STAGE 02" },
    { id: 3, name: "STAGE 03" },
    { id: 4, name: "STAGE 04" },
  ];
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
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([]);
  const [searchTeamMember, setSearchTeamMember] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [reminderTime, setReminderTime] = useState("00:00:00");

  // This AssessmentForm is from Pipeline not for Assessment in Step05
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

  const handleToggleTeamMember = (memberId: number) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleEditStep = (pipeline_identifier: string | number) => {
    const step = pipelineSteps.find((step) => {
      if (step.source === "local" && typeof pipeline_identifier === "string") {
        return step.pipeline_identifier === pipeline_identifier;
      }

      if (step.source === "db" && typeof pipeline_identifier === "number") {
        return step.id === pipeline_identifier;
      }

      return false;
    });

    if (step) {
      setOpenDialogs((prev) => ({ ...prev, [step.stage]: true }));
      if (step.source === "local") {
        setStepData({
          ...step,
          pipeline_identifier: step.pipeline_identifier,
          assessments: step.assessments || [],
        });
      } else {
        const { ...rest } = step as PipelineStepInDb;
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
    const isLocal = stepData.source === "local";

    const data = {
      ...stepData,
      stage: stage_id,
      source: isLocal ? "local" : "db",
    } as PipelineStep;

    if (isLocal) {
      if ((data as PipelineStepLocal).pipeline_identifier) {
        (data as PipelineStepLocal).pipeline_identifier = `tmp-${Date.now()}`;
      }
      pipelineHandler((data as PipelineStepLocal).pipeline_identifier, data);
    } else {
      pipelineHandler((data as PipelineStepInDb).id, data);
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
        {pipelineStages.map((stage) => {
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
