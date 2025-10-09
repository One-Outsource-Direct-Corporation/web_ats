import { useState } from "react";
import type {
  PipelineStage,
  PipelineStep,
  StagePopupData,
} from "../types/createPosition";

const initialPipelineStages: PipelineStage[] = [
  {
    id: 1,
    name: "STAGE 01",
    steps: [],
  },
  {
    id: 2,
    name: "STAGE 02",
    steps: [],
  },
  {
    id: 3,
    name: "STAGE 03",
    steps: [],
  },
  {
    id: 4,
    name: "STAGE 04",
    steps: [],
  },
];

const initialStagePopupData: StagePopupData = {
  processType: "",
  processTitle: "",
  description: "",
  redactedInfo: false,
  assessments: [],
  teamMembers: [],
  templateType: "",
  reminderTime: "00:00:00",
};

export function usePipelineStages() {
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(
    initialPipelineStages
  );
  const [currentStageId, setCurrentStageId] = useState<number | null>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [stagePopupData, setStagePopupData] = useState<StagePopupData>(
    initialStagePopupData
  );
  const [stepMoveMode, setStepMoveMode] = useState(false);
  const [selectedStepForMove, setSelectedStepForMove] = useState<{
    stageId: number;
    stepId: number;
  } | null>(null);

  const deleteStep = (stageId: number, stepId: number) => {
    setPipelineStages(
      pipelineStages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              steps: stage.steps.filter((step) => step.id !== stepId),
            }
          : stage
      )
    );
  };

  const handleMoveStep = (stageId: number, stepId: number) => {
    if (selectedStepForMove) {
      const sourceStageId = selectedStepForMove.stageId;
      const sourceStepId = selectedStepForMove.stepId;

      // Don't move if it's the same step
      if (sourceStageId === stageId && sourceStepId === stepId) {
        setStepMoveMode(false);
        setSelectedStepForMove(null);
        return;
      }

      // Find source and target steps with their complete data
      let sourceStep: PipelineStep | null = null;
      let targetStep: PipelineStep | null = null;
      let sourceStageIndex = -1;
      let targetStageIndex = -1;
      let sourceStepIndex = -1;
      let targetStepIndex = -1;

      const updatedStages = [...pipelineStages];

      // Find source step and its indices
      for (let i = 0; i < updatedStages.length; i++) {
        if (updatedStages[i].id === sourceStageId) {
          sourceStageIndex = i;
          sourceStepIndex = updatedStages[i].steps.findIndex(
            (step) => step.id === sourceStepId
          );
          if (sourceStepIndex !== -1) {
            sourceStep = updatedStages[i].steps[sourceStepIndex];
          }
          break;
        }
      }

      // Find target step and its indices
      for (let i = 0; i < updatedStages.length; i++) {
        if (updatedStages[i].id === stageId) {
          targetStageIndex = i;
          targetStepIndex = updatedStages[i].steps.findIndex(
            (step) => step.id === stepId
          );
          if (targetStepIndex !== -1) {
            targetStep = updatedStages[i].steps[targetStepIndex];
          }
          break;
        }
      }

      if (
        sourceStep &&
        targetStep &&
        sourceStepIndex !== -1 &&
        targetStepIndex !== -1
      ) {
        if (sourceStageId === stageId) {
          // Same stage - swap positions
          const newSteps = [...updatedStages[sourceStageIndex].steps];
          newSteps[sourceStepIndex] = targetStep;
          newSteps[targetStepIndex] = sourceStep;
          updatedStages[sourceStageIndex] = {
            ...updatedStages[sourceStageIndex],
            steps: newSteps,
          };
        } else {
          // Different stages - remove from source, add to target
          updatedStages[sourceStageIndex].steps.splice(sourceStepIndex, 1);
          updatedStages[targetStageIndex].steps.splice(
            targetStepIndex,
            0,
            sourceStep
          );
        }
        setPipelineStages(updatedStages);
      }

      setStepMoveMode(false);
      setSelectedStepForMove(null);
    }
  };

  const addStepToStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setEditingStepId(null);
    setStagePopupData(initialStagePopupData);
  };

  const editStep = (stepId: number) => {
    // Find the step and stage
    let foundStep: PipelineStep | null = null;
    let foundStageId: number | null = null;

    for (const stage of pipelineStages) {
      const step = stage.steps.find((s) => s.id === stepId);
      if (step) {
        foundStep = step;
        foundStageId = stage.id;
        break;
      }
    }

    if (foundStep && foundStageId) {
      setCurrentStageId(foundStageId);
      setEditingStepId(stepId);
      setStagePopupData({
        processType: foundStep.type,
        processTitle: foundStep.name,
        description: foundStep.description || "",
        redactedInfo: foundStep.redactedInfo || false,
        assessments: foundStep.assessments || [],
        teamMembers: foundStep.teamMembers || [],
        templateType: foundStep.templateType || "",
        reminderTime: foundStep.reminderTime || "00:00:00",
      });
    }
  };

  const resetStagePopup = () => {
    setCurrentStageId(null);
    setEditingStepId(null);
    setStagePopupData(initialStagePopupData);
  };

  return {
    pipelineStages,
    setPipelineStages,
    currentStageId,
    setCurrentStageId,
    editingStepId,
    setEditingStepId,
    stagePopupData,
    setStagePopupData,
    stepMoveMode,
    setStepMoveMode,
    selectedStepForMove,
    setSelectedStepForMove,
    deleteStep,
    handleMoveStep,
    addStepToStage,
    editStep,
    resetStagePopup,
  };
}
