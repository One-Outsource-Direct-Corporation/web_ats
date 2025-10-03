import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobDetail } from "../hooks/useJobDetail";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DocumentUploadModal } from "@/assets/components/document-upload-modal";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { ApplicationSidebar } from "../components/application/ApplicationSidebar";
import { ApplicationHeader } from "../components/application/ApplicationHeader";
import { ApplicationFooter } from "../components/application/ApplicationFooter";
import { MobileProgressBar } from "../components/application/MobileProgressBar";
import { DataPrivacySection } from "../components/application/DataPrivacySection";
import { PersonalInfoSection } from "../components/application/PersonalInfoSection";
import { ContactInfoSection } from "../components/application/ContactInfoSection";
import { AddressInfoSection } from "../components/application/AddressInfoSection";
import { JobDetailsSection } from "../components/application/JobDetailsSection";
import { EducationSection } from "../components/application/EducationSection";
import { WorkExperienceSection } from "../components/application/WorkExperienceSection";
import { AcknowledgementSection } from "../components/application/AcknowledgementSection";
import { ApplicationCompleteModal } from "../components/application/ApplicationCompleteModal";

export default function CareersApply() {
  const params = useParams();
  const navigate = useNavigate();

  const { jobDetail, loading, error } = useJobDetail(params.jobId);

  const [showUploadModal, setShowUploadModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const {
    formData,
    stage2Data,
    stage3Data,
    stage4Data,
    currentStage,
    acceptTerms,
    setAcceptTerms,
    handlePersonalInfoChange,
    handleJobDetailsChange,
    handleEducationWorkChange,
    handleAcknowledgementChange,
    handleAddWorkExperience,
    handleRemoveWorkExperience,
    handleDocumentsUploaded,
    goToNextStage,
    goToPreviousStage,
    saveFormState,
    clearFormState,
  } = useApplicationForm(jobDetail?.job_title);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showUploadModal || showCompletionModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showUploadModal, showCompletionModal]);

  useEffect(() => {
    document.title = jobDetail
      ? `Apply - ${jobDetail.job_title}`
      : "Careers Apply";
  }, [jobDetail?.job_title]);

  const handleDocumentModalClose = () => {
    setShowUploadModal(false);
  };

  const handleDocumentsUploadComplete = (resumeData: any) => {
    handleDocumentsUploaded(resumeData);
    setShowUploadModal(false);
  };

  const handleNext = () => {
    if (currentStage < 4) {
      goToNextStage();
    } else {
      // Generate tracking code and submit
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setTrackingCode(code);
      setShowCompletionModal(true);
      clearFormState();
    }
  };

  const handleBack = () => {
    goToPreviousStage();
  };

  const handleBackToHome = () => {
    navigate("/careers");
  };

  const handleTrackApplication = () => {
    navigate("/careers/track");
  };

  const handleLogoClick = () => {
    navigate("/careers");
  };

  const handleBackToJobDescription = useCallback(() => {
    if (jobDetail) {
      saveFormState();
      navigate(`/careers/jobs/${jobDetail.id}`);
    }
  }, [jobDetail, saveFormState, navigate]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Button
            variant="outline"
            className="mt-6 bg-transparent"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!jobDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load job details</p>
          <button onClick={handleBackToHome} className="text-blue-600 mt-4">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen">
      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-900/65 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <DocumentUploadModal
              onClose={handleDocumentModalClose}
              onDocumentsUploaded={handleDocumentsUploadComplete}
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar */}
      <MobileProgressBar
        currentStage={currentStage}
        jobTitle={jobDetail.job_title || ""}
        onLogoClick={handleLogoClick}
      />

      {/* Desktop Sidebar */}
      <ApplicationSidebar
        currentStage={currentStage}
        onLogoClick={handleLogoClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto h-screen pb-20">
        {/* Desktop Header */}
        <ApplicationHeader
          job={jobDetail}
          onViewJobDescription={handleBackToJobDescription}
        />

        {/* Form Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Stage 1 - Applicant Information */}
          {currentStage === 1 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <DataPrivacySection
                acceptTerms={acceptTerms}
                onAcceptTermsChange={setAcceptTerms}
              />
              <PersonalInfoSection
                formData={formData}
                onInputChange={handlePersonalInfoChange}
              />
              <ContactInfoSection
                formData={formData}
                onInputChange={handlePersonalInfoChange}
              />
              <AddressInfoSection
                formData={formData}
                onInputChange={handlePersonalInfoChange}
              />
            </div>
          )}

          {/* Stage 2 - Job Details */}
          {currentStage === 2 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <JobDetailsSection
                data={stage2Data}
                onChange={handleJobDetailsChange}
              />
            </div>
          )}

          {/* Stage 3 - Work and Education */}
          {currentStage === 3 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <EducationSection
                data={stage3Data}
                onChange={handleEducationWorkChange}
              />
              <WorkExperienceSection
                data={stage3Data}
                onChange={handleEducationWorkChange}
                onAddExperience={handleAddWorkExperience}
                onRemoveExperience={handleRemoveWorkExperience}
              />
            </div>
          )}

          {/* Stage 4 - Acknowledgement */}
          {currentStage === 4 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <AcknowledgementSection
                data={stage4Data}
                onChange={handleAcknowledgementChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer for Navigation Buttons */}
      <ApplicationFooter
        currentStage={currentStage}
        acceptTerms={acceptTerms}
        certificationAccepted={stage4Data.certificationAccepted}
        onBack={handleBack}
        onNext={handleNext}
      />

      {/* Application Complete Modal */}
      {showCompletionModal && (
        <ApplicationCompleteModal
          trackingCode={trackingCode}
          onBackToHome={handleBackToHome}
          onTrackApplication={handleTrackApplication}
        />
      )}
    </div>
  );
}
