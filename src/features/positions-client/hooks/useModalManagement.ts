import { useState } from "react";

export const useModalManagement = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showNonNegotiableModal, setShowNonNegotiableModal] = useState(false);
  const [showPoolApplicantsPopup, setShowPoolApplicantsPopup] = useState(false);

  const [selectedPoolingOption, setSelectedPoolingOption] = useState(
    "All Previous Applicants"
  );

  const closeAllModals = () => {
    setShowPreview(false);
    setShowSuccessPage(false);
    setShowNonNegotiableModal(false);
    setShowPoolApplicantsPopup(false);
  };

  return {
    showPreview,
    setShowPreview,
    showSuccessPage,
    setShowSuccessPage,
    showNonNegotiableModal,
    setShowNonNegotiableModal,
    showPoolApplicantsPopup,
    setShowPoolApplicantsPopup,
    selectedPoolingOption,
    setSelectedPoolingOption,
    closeAllModals,
  };
};
