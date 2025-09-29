import { useState } from "react";

export const useModalManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showNonNegotiableModal, setShowNonNegotiableModal] = useState(false);
  const [showStagePopup, setShowStagePopup] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showPoolApplicantsPopup, setShowPoolApplicantsPopup] = useState(false);

  // Pool applicants
  const [selectedPoolingOption, setSelectedPoolingOption] = useState(
    "All Previous Applicants"
  );

  const closeAllModals = () => {
    setShowModal(false);
    setShowPreview(false);
    setShowSuccessPage(false);
    setShowNonNegotiableModal(false);
    setShowStagePopup(false);
    setShowAddQuestionModal(false);
    setShowPoolApplicantsPopup(false);
  };

  return {
    showModal,
    setShowModal,
    showPreview,
    setShowPreview,
    showSuccessPage,
    setShowSuccessPage,
    showNonNegotiableModal,
    setShowNonNegotiableModal,
    showStagePopup,
    setShowStagePopup,
    showAddQuestionModal,
    setShowAddQuestionModal,
    showPoolApplicantsPopup,
    setShowPoolApplicantsPopup,
    selectedPoolingOption,
    setSelectedPoolingOption,
    closeAllModals,
  };
};
