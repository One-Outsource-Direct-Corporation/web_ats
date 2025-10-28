import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  StepConfig,
  TeamMember,
  TimePickerValues,
} from "../types/create_position.types";

import { useFormData } from "./useFormData";
import { useLocationsBatches } from "./useLocationsBatches";
import { usePipelineStages } from "./usePipelineStages";
import { useAssessments } from "./useAssessments";
import { useQuestionnaires } from "./useQuestionnaires";
import { useQuestions } from "./useQuestions";
import { useJobDescription } from "./useJobDescription";

const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sif Daae",
    position: "Hiring Managers",
    department: "CI Department",
    process: "Hiring Manager Interview",
  },
  {
    id: 2,
    name: "Kanye West",
    position: "Human Resource",
    department: "HR Department",
    process: "Phone Call Interview",
  },
  {
    id: 3,
    name: "Mark Josephs",
    position: "Lead Developer",
    department: "CI Department",
    process: "Panel Interview",
  },
  {
    id: 4,
    name: "Virla Eliza",
    position: "Supervisor",
    department: "CI Department",
    process: "Panel Interview",
  },
];

export function useCreateNewPosition() {
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPoolApplicantsPopup, setShowPoolApplicantsPopup] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showNonNegotiableModal, setShowNonNegotiableModal] = useState(false);
  const [selectedPoolingOption, setSelectedPoolingOption] = useState(
    "All Previous Applicants"
  );

  // Pipeline-related popups
  const [showStagePopup, setShowStagePopup] = useState(false);
  const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);

  // Step 3 questionnaire modals
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showAddQuestionModalStep3, setShowAddQuestionModalStep3] =
    useState(false);

  // Time picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerValues, setTimePickerValues] = useState<TimePickerValues>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Team members
  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>(
    []
  );
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [showTeamMembers, setShowTeamMembers] = useState(false);

  // Initialize all hooks
  const formData = useFormData();
  const locationsBatches = useLocationsBatches();
  const pipelineStages = usePipelineStages();
  const assessments = useAssessments();
  const questionnaires = useQuestionnaires();
  const questions = useQuestions();
  const jobDescription = useJobDescription();

  useEffect(() => {
    document.title = "Create New Position";
  }, []);

  const steps: StepConfig[] = [
    { number: 1, title: "Details", active: currentStep === 1 },
    { number: 2, title: "Description", active: currentStep === 2 },
    { number: 3, title: "Application Form", active: currentStep === 3 },
    { number: 4, title: "Pipeline", active: currentStep === 4 },
    { number: 5, title: "Assessment", active: currentStep === 5 },
  ];

  const handleCancel = () => {
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    navigate("/requests");
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === 3) {
      setShowNonNegotiableModal(true);
    } else if (currentStep === 5) {
      setShowPoolApplicantsPopup(true);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || completedSteps.includes(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Position Details";
      case 2:
        return "Position Description";
      case 3:
        return "Application Form";
      case 4:
        return "Position Pipeline";
      case 5:
        return "Assessment";
      default:
        return "Create New Position";
    }
  };

  // Team member management
  const addTeamMember = (member: TeamMember) => {
    if (!selectedTeamMembers.find((m) => m.id === member.id)) {
      setSelectedTeamMembers([...selectedTeamMembers, member]);
    }
  };

  const removeTeamMember = (memberId: number) => {
    setSelectedTeamMembers(
      selectedTeamMembers.filter((m) => m.id !== memberId)
    );
  };

  const filteredTeamMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  // Time picker functions
  const setCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    setTimePickerValues({ hours, minutes, seconds });
    pipelineStages.setStagePopupData((prev) => ({
      ...prev,
      reminderTime: `${hours}:${minutes}:${seconds}`,
    }));
  };

  const updateTime = () => {
    const timeString = `${timePickerValues.hours}:${timePickerValues.minutes}:${timePickerValues.seconds}`;
    pipelineStages.setStagePopupData((prev) => ({
      ...prev,
      reminderTime: timeString,
    }));
    setShowTimePicker(false);
  };

  const handleSaveNonNegotiables = () => {
    setShowNonNegotiableModal(false);
    setCurrentStep(4);
  };

  return {
    // Step management
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    steps,

    // Modal states
    showModal,
    setShowModal,
    showPreview,
    setShowPreview,
    showPoolApplicantsPopup,
    setShowPoolApplicantsPopup,
    showSuccessPage,
    setShowSuccessPage,
    showNonNegotiableModal,
    setShowNonNegotiableModal,
    selectedPoolingOption,
    setSelectedPoolingOption,

    // Pipeline popups
    showStagePopup,
    setShowStagePopup,
    showAssessmentPopup,
    setShowAssessmentPopup,

    // Step 3 modals
    showQuestionnaireModal,
    setShowQuestionnaireModal,
    showAddQuestionModalStep3,
    setShowAddQuestionModalStep3,

    // Time picker
    showTimePicker,
    setShowTimePicker,
    timePickerValues,
    setTimePickerValues,

    // Team members
    teamMembers,
    selectedTeamMembers,
    setSelectedTeamMembers,
    teamSearchQuery,
    setTeamSearchQuery,
    showTeamMembers,
    setShowTeamMembers,

    // Navigation handlers
    handleCancel,
    handleConfirmCancel,
    handleNext,
    handleBack,
    handleStepClick,
    getStepTitle,

    // Team member management
    addTeamMember,
    removeTeamMember,
    filteredTeamMembers,

    // Time picker functions
    setCurrentTime,
    updateTime,

    // Non-negotiable handling
    handleSaveNonNegotiables,

    // All feature hooks
    formData,
    locationsBatches,
    pipelineStages,
    assessments,
    questionnaires,
    questions,
    jobDescription,
  };
}
