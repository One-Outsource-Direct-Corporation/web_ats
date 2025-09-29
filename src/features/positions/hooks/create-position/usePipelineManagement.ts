import { useState } from "react";
import { FileText, Phone, Users, Calendar, Briefcase } from "lucide-react";
import type {
  PipelineStage,
  PipelineStep,
  StagePopupData,
  TeamMember,
  Assessment,
} from "../../types/createPosition";

export const usePipelineManagement = () => {
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    { id: 1, name: "STAGE 01", steps: [] },
    { id: 2, name: "STAGE 02", steps: [] },
    { id: 3, name: "STAGE 03", steps: [] },
    { id: 4, name: "STAGE 04", steps: [] },
  ]);

  const [currentStageId, setCurrentStageId] = useState<number | null>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [stagePopupData, setStagePopupData] = useState<StagePopupData>({
    processType: "",
    processTitle: "",
    description: "",
    redactedInfo: false,
    assessments: [],
    teamMembers: [],
    templateType: "",
    reminderTime: "00:00:00",
  });

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>(
    []
  );

  const getProcessTypeIcon = (processType: string) => {
    switch (processType) {
      case "Resume Screening":
        return FileText;
      case "Phone Call Interview":
        return Phone;
      case "Shortlisted":
        return Users;
      case "Initial Interview":
        return Calendar;
      case "Assessments":
        return FileText;
      case "Final Interview":
        return Users;
      case "For Job Offer":
        return Briefcase;
      case "Onboarding":
        return Users;
      default:
        return FileText;
    }
  };

  const addStepToStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setEditingStepId(null);
    setStagePopupData({
      processType: "",
      processTitle: "",
      description: "",
      redactedInfo: false,
      assessments: [],
      teamMembers: [],
      templateType: "",
      reminderTime: "00:00:00",
    });
    setSelectedTeamMembers([]);
  };

  const editStep = (stageId: number, stepId: number) => {
    setCurrentStageId(stageId);
    setEditingStepId(stepId);

    const stage = pipelineStages.find((s) => s.id === stageId);
    const step = stage?.steps.find((s) => s.id === stepId);

    if (step) {
      setStagePopupData({
        processType: step.type,
        processTitle: step.name,
        description: step.description || "",
        redactedInfo: step.redactedInfo || false,
        assessments: step.assessments || [],
        teamMembers: step.teamMembers || [],
        templateType: step.templateType || "",
        reminderTime: step.reminderTime || "00:00:00",
      });
      setSelectedTeamMembers(step.teamMembers || []);
    }
  };

  const saveStageData = (
    setGlobalAssessments: React.Dispatch<React.SetStateAction<Assessment[]>>
  ) => {
    if (currentStageId && stagePopupData.processTitle.trim()) {
      const IconComponent = getProcessTypeIcon(stagePopupData.processType);

      if (editingStepId) {
        setPipelineStages((prev) =>
          prev.map((stage) =>
            stage.id === currentStageId
              ? {
                  ...stage,
                  steps: stage.steps.map((step) =>
                    step.id === editingStepId
                      ? {
                          ...step,
                          name: stagePopupData.processTitle,
                          type: stagePopupData.processType,
                          icon: IconComponent,
                          description: stagePopupData.description,
                          redactedInfo: stagePopupData.redactedInfo,
                          assessments: stagePopupData.assessments,
                          teamMembers: selectedTeamMembers,
                          templateType: stagePopupData.templateType,
                          reminderTime: stagePopupData.reminderTime,
                        }
                      : step
                  ),
                }
              : stage
          )
        );
      } else {
        const newStep: PipelineStep = {
          id: Date.now(),
          name: stagePopupData.processTitle,
          type: stagePopupData.processType,
          icon: IconComponent,
          description: stagePopupData.description,
          redactedInfo: stagePopupData.redactedInfo,
          assessments: stagePopupData.assessments,
          teamMembers: selectedTeamMembers,
          templateType: stagePopupData.templateType,
          reminderTime: stagePopupData.reminderTime,
        };

        setPipelineStages((prev) =>
          prev.map((stage) =>
            stage.id === currentStageId
              ? { ...stage, steps: [...stage.steps, newStep] }
              : stage
          )
        );
      }

      const assessmentsWithStage = stagePopupData.assessments.map(
        (assessment) => ({
          ...assessment,
          stage: `Stage ${
            currentStageId && currentStageId < 10
              ? `0${currentStageId}`
              : currentStageId
          }`,
        })
      );

      setGlobalAssessments((prev) => {
        const filteredAssessments = editingStepId
          ? prev.filter(
              (a) => !stagePopupData.assessments.find((sa) => sa.id === a.id)
            )
          : prev;
        return [...filteredAssessments, ...assessmentsWithStage];
      });
    }
  };

  const resetStagePopup = () => {
    setCurrentStageId(null);
    setEditingStepId(null);
    setStagePopupData({
      processType: "",
      processTitle: "",
      description: "",
      redactedInfo: false,
      assessments: [],
      teamMembers: [],
      templateType: "",
      reminderTime: "00:00:00",
    });
    setSelectedTeamMembers([]);
  };

  return {
    pipelineStages,
    setPipelineStages,
    currentStageId,
    editingStepId,
    stagePopupData,
    setStagePopupData,
    selectedTeamMembers,
    setSelectedTeamMembers,
    getProcessTypeIcon,
    addStepToStage,
    editStep,
    saveStageData,
    resetStagePopup,
  };
};
