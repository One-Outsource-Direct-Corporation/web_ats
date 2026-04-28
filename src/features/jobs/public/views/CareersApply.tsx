import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useJobDetail } from "../hooks/useJobDetail";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  DocumentUploadModal,
  type UploadedDocumentsPayload,
} from "@/assets/components/document-upload-modal";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { ApplicationSidebar } from "../components/application/ApplicationSidebar";
import { ApplicationHeader } from "../components/application/ApplicationHeader";
import { ApplicationFooter } from "../components/application/ApplicationFooter";
import { ApplicationCompleteModal } from "../components/application/ApplicationCompleteModal";
import Step01 from "../components/steps/Step01";
import Step02 from "../components/steps/Step02";
import Step03 from "../components/steps/Step03";
import Step04 from "../components/steps/Step04";
import type { WorkExperienceEntry } from "../types/application_form.types";
import { useCandidateApplicationSubmission } from "../hooks/useCandidateApplicationSubmission";

export default function CareersApply() {
  const params = useParams();
  const navigate = useNavigate();

  const { jobDetail, loading, error } = useJobDetail(params.jobId);

  const [showUploadModal, setShowUploadModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [trackingCode, setTrackingCode] = useState("");

  const { submitCandidateApplication, isSubmitting } =
    useCandidateApplicationSubmission();

  const {
    formData,
    currentStage,
    acceptTerms,
    setAcceptTerms,
    handleInputPersonalInfo,
    handleInputJobDetails,
    handleInputEducationWork,
    handleInputAcknowledgement,
    handleQuestionnaireParagraphInput,
    handleQuestionnaireSingleChoiceInput,
    handleQuestionnaireCheckboxInput,
    goToNextStage,
    goToPreviousStage,
  } = useApplicationForm(jobDetail?.job_posting?.job_title ?? "");

  // Wrapper functions to handle type compatibility
  const handleJobDetailsChange = (
    field: string,
    value: string | string[] | number | File | null,
  ) => {
    handleInputJobDetails(field as keyof typeof formData.jobDetails, value);
  };

  const handleEducationWorkChange = (
    field: string,
    value: string | number | null | WorkExperienceEntry[],
  ) => {
    handleInputEducationWork(
      field as keyof typeof formData.educationWork,
      value,
    );
  };

  const handleAcknowledgementChange = (
    field: keyof typeof formData.acknowledgement,
    value: string | boolean | File | null,
  ) => {
    handleInputAcknowledgement(field, value as string | boolean | null);
  };

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
      ? `Apply - ${jobDetail.job_posting.job_title}`
      : "Careers Apply";
  }, [jobDetail]);

  const handleDocumentModalClose = () => {
    setShowUploadModal(false);
  };

  const handleDocumentsUploadComplete = async (
    documents: UploadedDocumentsPayload,
  ) => {
    setResumeFile(documents.resumeFile);
    setCoverLetterFile(documents.coverLetterFile ?? null);
    setShowUploadModal(false);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleTrackApplication = () => {
    navigate("/applicationtracker");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBackToJobDescription = useCallback(() => {
    if (jobDetail) {
      navigate(`/jobs/${jobDetail.job_posting.id}`);
    }
  }, [jobDetail, navigate]);

  const handleNextOrSubmit = useCallback(async () => {
    if (!jobDetail) {
      return;
    }

    if (currentStage < 4) {
      if (currentStage === 1 && !acceptTerms) {
        toast.error("Please accept the data privacy terms to continue.");
        return;
      }

      goToNextStage();
      return;
    }

    if (!resumeFile) {
      toast.error("Resume is required. Please upload your resume to continue.");
      setShowUploadModal(true);
      return;
    }

    const interviewScheduleFieldStatus =
      jobDetail.application_form.application_form.preferred_interview_schedule;
    const selectedInterviewScheduleCount =
      formData.jobDetails.interviewSchedule.length;

    if (
      interviewScheduleFieldStatus !== "disabled" &&
      selectedInterviewScheduleCount < 1
    ) {
      toast.error("Please add at least one preferred interview schedule option.");
      return;
    }

    if (selectedInterviewScheduleCount > 3) {
      toast.error("You can only provide up to 3 preferred interview schedules.");
      return;
    }

    const signatureValue =
      typeof formData.acknowledgement.signature === "string"
        ? formData.acknowledgement.signature
        : formData.acknowledgement.signature?.name ?? null;

    try {
      const response = await submitCandidateApplication({
        payload: {
          job_posting: jobDetail.job_posting.id,
          source: "careers_page",
          personal_info: formData.personalInfo,
          job_details: {
            expectedSalary: formData.jobDetails.expectedSalary,
            willingToWorkOnsite: formData.jobDetails.willingToWorkOnsite,
            interviewSchedule: formData.jobDetails.interviewSchedule,
          },
          education_work: formData.educationWork,
          acknowledgement: {
            ...formData.acknowledgement,
            signature: signatureValue,
          },
          questionnaire_answers: formData.questionnaire,
          requirements: [],
        },
        files: {
          resume: resumeFile,
          coverLetter: coverLetterFile,
          photo: formData.jobDetails.photo,
          medicalCertificate: formData.jobDetails.medicalCertificate,
        },
      });

      setTrackingCode(response.tracking_code);
      setShowCompletionModal(true);
    } catch (submissionError: unknown) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to submit your application. Please try again.";
      toast.error(message);
    }
  }, [
    acceptTerms,
    coverLetterFile,
    currentStage,
    formData,
    goToNextStage,
    jobDetail,
    resumeFile,
    submitCandidateApplication,
  ]);

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

      <ApplicationSidebar
        currentStage={currentStage}
        onLogoClick={handleLogoClick}
        jobTitle={jobDetail.job_posting.job_title}
      />

      <section className="flex-1 flex flex-col overflow-y-auto h-screen pb-20">
        <ApplicationHeader
          job={jobDetail}
          onViewJobDescription={handleBackToJobDescription}
        />
        <div className="flex-1 p-4 lg:p-8">
          {currentStage === 1 && (
            <Step01
              formData={formData.personalInfo}
              applicationForm={jobDetail.application_form.application_form}
              onInputChange={handleInputPersonalInfo}
              acceptTerms={acceptTerms}
              onAcceptTermsChange={setAcceptTerms}
            />
          )}
          {currentStage === 2 && (
            <Step02
              formData={formData.jobDetails}
              onInputChange={handleJobDetailsChange}
              applicationForm={jobDetail.application_form.application_form}
            />
          )}
          {currentStage === 3 && (
            <Step03
              formData={formData.educationWork}
              onInputChange={handleEducationWorkChange}
              applicationForm={jobDetail.application_form.application_form}
            />
          )}
          {currentStage === 4 && (
            <Step04
              formData={formData.acknowledgement}
              onInputChange={handleAcknowledgementChange}
              applicationForm={jobDetail.application_form.application_form}
              questionnaire={jobDetail.application_form.questionnaire}
              questionnaireAnswers={formData.questionnaire}
              onQuestionnaireParagraphInput={handleQuestionnaireParagraphInput}
              onQuestionnaireSingleChoiceInput={
                handleQuestionnaireSingleChoiceInput
              }
              onQuestionnaireCheckboxInput={handleQuestionnaireCheckboxInput}
            />
          )}
        </div>
      </section>

      {/* Fixed Footer for Navigation Buttons */}
      <ApplicationFooter
        currentStage={currentStage}
        onBack={() => currentStage > 1 && goToPreviousStage()}
        onNext={handleNextOrSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Application Complete Modal */}
      {showCompletionModal && (
        <ApplicationCompleteModal
          onTrackApplication={handleTrackApplication}
          trackingCode={trackingCode}
        />
      )}
    </div>
  );
}
